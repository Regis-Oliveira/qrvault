import type { VercelRequest, VercelResponse } from "@vercel/node";

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
		envVar: "DISCORD_WEBHOOK_BUG"
	},
	suggestion: {
		emoji: "💡",
		label: "Suggestion",
		color: 0xfbbf24, // yellow
		envVar: "DISCORD_WEBHOOK_SUGGESTION"
	},
	general: {
		emoji: "💬",
		label: "General Feedback",
		color: 0x06b6d4, // cyan
		envVar: "DISCORD_WEBHOOK_FEEDBACK"
	}
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	// Rate limit by IP
	const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() ?? "unknown";

	if (isRateLimited(ip)) {
		return res.status(429).json({ error: "Too many requests. Please wait a few minutes." });
	}

	// Validate body
	const { message, category, screenshot } = req.body ?? {};

	if (typeof message !== "string" || message.trim().length === 0) {
		return res.status(400).json({ error: "Message is required." });
	}

	if (message.length > 1000) {
		return res.status(400).json({ error: "Message must be under 1000 characters." });
	}

	if (!category || !(category in CATEGORY_META)) {
		return res.status(400).json({ error: "Invalid category." });
	}

	// Validate optional screenshot
	if (screenshot !== undefined) {
		if (typeof screenshot !== "string") {
			return res.status(400).json({ error: "Invalid screenshot format." });
		}
		if (!screenshot.startsWith("data:image/")) {
			return res.status(400).json({ error: "Invalid screenshot format." });
		}
		if (screenshot.length > MAX_SCREENSHOT_B64_LEN) {
			return res.status(400).json({ error: "Screenshot is too large (max ~3 MB)." });
		}
	}

	const meta = CATEGORY_META[category as Category];

	const webhookUrl = process.env[meta.envVar];
	if (!webhookUrl) {
		console.error(`${meta.envVar} is not set`);
		return res.status(500).json({ error: "Feedback service not configured." });
	}

	const embed = {
		title: `${meta.emoji} ${meta.label} — QRVault`,
		description: message.trim(),
		color: meta.color,
		timestamp: new Date().toISOString(),
		footer: { text: "QRVault Feedback Widget" },
		...(screenshot ? { image: { url: "attachment://screenshot.jpg" } } : {})
	};

	let discordRes: Response;

	if (screenshot) {
		// Strip the data URL prefix and decode to binary
		const base64Data = screenshot.replace(/^data:image\/\w+;base64,/, "");
		const imageBuffer = Buffer.from(base64Data, "base64");

		const form = new FormData();
		form.append("payload_json", JSON.stringify({ embeds: [embed] }));
		form.append("files[0]", new Blob([imageBuffer], { type: "image/jpeg" }), "screenshot.jpg");

		discordRes = await fetch(webhookUrl, { method: "POST", body: form });
	} else {
		discordRes = await fetch(webhookUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ embeds: [embed] })
		});
	}

	if (!discordRes.ok) {
		console.error("Discord webhook failed:", discordRes.status);
		return res.status(502).json({ error: "Failed to deliver feedback." });
	}

	return res.status(200).json({ success: true });
}
