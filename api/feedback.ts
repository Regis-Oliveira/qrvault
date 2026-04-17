import type { VercelRequest, VercelResponse } from "@vercel/node";

const ALLOWED_ORIGIN = "https://qrvault-three.vercel.app/";
const DISCORD_WEBHOOK_PREFIX = "https://discord.com/api/webhooks/";

// Simple in-memory rate limit: max 5 requests per IP per 10 minutes.
// For a stateless serverless environment this is best-effort (each cold start
// resets the map), but it stops casual abuse without extra infrastructure.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000; // 10 min
const MAX_REQUESTS = 5;

// Maximum base64 screenshot size accepted (~3 MB binary after decoding)
const MAX_SCREENSHOT_B64_LEN = 4 * 1024 * 1024; // ~3 MB decoded

type Category = "bug" | "suggestion" | "general";

const CATEGORY_META: Record<
  Category,
  { emoji: string; label: string; color: number; envVar: string }
> = {
  bug: {
    emoji: "🐛",
    label: "Bug Report",
    color: 0xf87171, // red
    envVar: "DISCORD_WEBHOOK_BUG",
  },
  suggestion: {
    emoji: "💡",
    label: "Suggestion",
    color: 0xfbbf24, // yellow
    envVar: "DISCORD_WEBHOOK_SUGGESTION",
  },
  general: {
    emoji: "💬",
    label: "General Feedback",
    color: 0x06b6d4, // cyan
    envVar: "DISCORD_WEBHOOK_FEEDBACK",
  },
};

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  if (entry.count >= MAX_REQUESTS) return true;

  entry.count++;
  return false;
}

function setCorsHeaders(res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Block requests from foreign origins (browser-initiated cross-site requests).
  // Direct server-to-server calls won't have an Origin header — that's acceptable.
  const origin = req.headers["origin"];
  if (origin && origin !== ALLOWED_ORIGIN) {
    return res.status(403).json({ error: "Forbidden" });
  }

  // Require JSON content type for POST bodies
  const contentType = req.headers["content-type"] ?? "";
  if (!contentType.includes("application/json")) {
    return res
      .status(415)
      .json({ error: "Content-Type must be application/json" });
  }

  // Rate limit by IP
  const forwarded = req.headers["x-forwarded-for"];
  const ip =
    (typeof forwarded === "string" ? forwarded : (forwarded?.[0] ?? ""))
      .split(",")[0]
      .trim() || "unknown";

  if (isRateLimited(ip)) {
    console.warn(`Rate limit exceeded for IP: ${ip}`);
    return res
      .status(429)
      .json({ error: "Too many requests. Please wait a few minutes." });
  }

  // Validate body
  const { message, category, screenshot } = req.body ?? {};

  if (typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({ error: "Message is required." });
  }

  if (message.length > 1000) {
    return res
      .status(400)
      .json({ error: "Message must be under 1000 characters." });
  }

  // Neutralise Discord mention injection (@everyone, @here, user/role pings)
  const safeMessage = message
    .trim()
    .replace(/@(everyone|here)/gi, "@\u200b$1")
    .replace(/<@[!&]?\d+>/g, "[mention]");

  if (!category || !(category in CATEGORY_META)) {
    return res.status(400).json({ error: "Invalid category." });
  }

  // Validate optional screenshot — require a well-formed data URL with a known image MIME type
  const SCREENSHOT_DATA_URL_RE = /^data:image\/(jpeg|png|webp|gif|bmp);base64,/;
  if (screenshot !== undefined) {
    if (typeof screenshot !== "string") {
      return res.status(400).json({ error: "Invalid screenshot format." });
    }
    if (!SCREENSHOT_DATA_URL_RE.test(screenshot)) {
      return res.status(400).json({ error: "Invalid screenshot format." });
    }
    if (screenshot.length > MAX_SCREENSHOT_B64_LEN) {
      return res
        .status(400)
        .json({ error: "Screenshot is too large (max ~3 MB)." });
    }
  }

  const meta = CATEGORY_META[category as Category];

  const webhookUrl = process.env[meta.envVar];
  if (!webhookUrl) {
    console.error(`${meta.envVar} is not set`);
    return res.status(500).json({ error: "Feedback service not configured." });
  }

  // Guard against SSRF if an env var is ever tampered with
  if (!webhookUrl.startsWith(DISCORD_WEBHOOK_PREFIX)) {
    console.error(`${meta.envVar} does not point to a Discord webhook`);
    return res.status(500).json({ error: "Feedback service misconfigured." });
  }

  const embed = {
    title: `${meta.emoji} ${meta.label} — QRVault`,
    description: safeMessage,
    color: meta.color,
    timestamp: new Date().toISOString(),
    footer: { text: "QRVault Feedback Widget" },
    ...(screenshot ? { image: { url: "attachment://screenshot.jpg" } } : {}),
  };

  let discordRes: Response;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);

  try {
    if (screenshot) {
      // Strip the data URL prefix and decode to binary
      const base64Data = screenshot.replace(SCREENSHOT_DATA_URL_RE, "");
      const imageBuffer = Buffer.from(base64Data, "base64");

      const form = new FormData();
      form.append("payload_json", JSON.stringify({ embeds: [embed] }));
      form.append(
        "files[0]",
        new Blob([imageBuffer], { type: "image/jpeg" }),
        "screenshot.jpg",
      );

      discordRes = await fetch(webhookUrl, {
        method: "POST",
        body: form,
        signal: controller.signal,
      });
    } else {
      discordRes = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embeds: [embed] }),
        signal: controller.signal,
      });
    }
  } catch (err) {
    clearTimeout(timeout);
    console.error("Discord webhook request failed:", err);
    return res.status(502).json({ error: "Failed to deliver feedback." });
  }

  clearTimeout(timeout);

  if (!discordRes.ok) {
    console.error("Discord webhook failed:", discordRes.status);
    return res.status(502).json({ error: "Failed to deliver feedback." });
  }

  return res.status(200).json({ success: true });
}
