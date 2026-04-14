import type { EmailConfig, QRConfig, WifiConfig } from "@/types/qr";

function encodeWifi(wifi: WifiConfig): string {
	const escapeWifi = (s: string) => s.replace(/[\\;,"':]/g, (c) => `\\${c}`);
	const ssid = escapeWifi(wifi.ssid);
	const pass = wifi.security === "nopass" ? "" : escapeWifi(wifi.password);
	const hidden = wifi.hidden ? "H:true;" : "";
	return `WIFI:T:${wifi.security};S:${ssid};P:${pass};${hidden};`;
}

function encodeEmail(email: EmailConfig): string {
	const params: string[] = [];
	if (email.subject) params.push(`subject=${encodeURIComponent(email.subject)}`);
	if (email.body) params.push(`body=${encodeURIComponent(email.body)}`);
	const query = params.length > 0 ? `?${params.join("&")}` : "";
	return `mailto:${email.address}${query}`;
}

export function buildQRData(config: QRConfig): string {
	switch (config.contentType) {
		case "url": {
			const raw = config.text.trim();
			if (!raw) return "";
			// Prepend https:// if no protocol is present
			if (!/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(raw)) return `https://${raw}`;
			return raw;
		}
		case "text":
			return config.text;
		case "wifi":
			return encodeWifi(config.wifi);
		case "email":
			return encodeEmail(config.email);
	}
}

export function isConfigEmpty(config: QRConfig): boolean {
	switch (config.contentType) {
		case "url":
		case "text":
			return config.text.trim() === "";
		case "wifi":
			return config.wifi.ssid.trim() === "";
		case "email":
			return config.email.address.trim() === "";
	}
}
