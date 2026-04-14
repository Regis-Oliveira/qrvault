import { describe, expect, it } from "vitest";
import { buildQRData, isConfigEmpty } from "@/lib/qrContent";
import type { QRConfig } from "@/types/qr";

const base: QRConfig = {
	contentType: "url",
	text: "",
	wifi: { ssid: "", password: "", security: "WPA", hidden: false },
	email: { address: "", subject: "", body: "" },
	dotStyle: "square",
	dotColor: "#06b6d4",
	backgroundColor: "#ffffff",
	cornerStyle: "square",
	errorCorrection: "M",
	size: 300,
	logoDataUrl: undefined
};

// ─── buildQRData ──────────────────────────────────────────────────────────────

describe("buildQRData — URL", () => {
	it("returns empty string when text is blank", () => {
		expect(buildQRData({ ...base, contentType: "url", text: "" })).toBe("");
	});

	it("returns empty string when text is only whitespace", () => {
		expect(buildQRData({ ...base, contentType: "url", text: "   " })).toBe("");
	});

	it("prepends https:// when no protocol given", () => {
		expect(buildQRData({ ...base, contentType: "url", text: "example.com" })).toBe(
			"https://example.com"
		);
	});

	it("does not modify a URL that already has http://", () => {
		expect(buildQRData({ ...base, contentType: "url", text: "http://example.com" })).toBe(
			"http://example.com"
		);
	});

	it("does not modify a URL that already has https://", () => {
		expect(buildQRData({ ...base, contentType: "url", text: "https://qrvault.app" })).toBe(
			"https://qrvault.app"
		);
	});

	it("trims leading/trailing whitespace before processing", () => {
		expect(buildQRData({ ...base, contentType: "url", text: "  example.com  " })).toBe(
			"https://example.com"
		);
	});
});

describe("buildQRData — text", () => {
	it("returns raw text as-is", () => {
		expect(buildQRData({ ...base, contentType: "text", text: "Hello world" })).toBe("Hello world");
	});

	it("returns empty string for empty text", () => {
		expect(buildQRData({ ...base, contentType: "text", text: "" })).toBe("");
	});
});

describe("buildQRData — WiFi", () => {
	it("builds WPA string correctly", () => {
		const result = buildQRData({
			...base,
			contentType: "wifi",
			wifi: { ssid: "MyNetwork", password: "secret123", security: "WPA", hidden: false }
		});
		expect(result).toBe("WIFI:T:WPA;S:MyNetwork;P:secret123;;");
	});

	it("builds open network string (nopass, empty password)", () => {
		const result = buildQRData({
			...base,
			contentType: "wifi",
			wifi: { ssid: "OpenNet", password: "", security: "nopass", hidden: false }
		});
		expect(result).toBe("WIFI:T:nopass;S:OpenNet;P:;;");
	});

	it("appends H:true; for hidden networks", () => {
		const result = buildQRData({
			...base,
			contentType: "wifi",
			wifi: { ssid: "HiddenNet", password: "pass", security: "WPA", hidden: true }
		});
		expect(result).toContain("H:true;");
	});

	it("escapes semicolons in SSID", () => {
		const result = buildQRData({
			...base,
			contentType: "wifi",
			wifi: { ssid: "My;Network", password: "pass", security: "WPA", hidden: false }
		});
		expect(result).toContain("My\\;Network");
	});

	it("escapes double quotes in SSID", () => {
		const result = buildQRData({
			...base,
			contentType: "wifi",
			wifi: { ssid: 'Net"work', password: "pass", security: "WPA", hidden: false }
		});
		expect(result).toContain('Net\\"work');
	});

	it("escapes backslashes in password", () => {
		const result = buildQRData({
			...base,
			contentType: "wifi",
			wifi: { ssid: "Net", password: "pass\\word", security: "WPA", hidden: false }
		});
		expect(result).toContain("pass\\\\word");
	});
});

describe("buildQRData — email", () => {
	it("builds basic mailto URI", () => {
		const result = buildQRData({
			...base,
			contentType: "email",
			email: { address: "test@example.com", subject: "", body: "" }
		});
		expect(result).toBe("mailto:test@example.com");
	});

	it("includes subject when provided", () => {
		const result = buildQRData({
			...base,
			contentType: "email",
			email: { address: "test@example.com", subject: "Hello", body: "" }
		});
		expect(result).toBe("mailto:test@example.com?subject=Hello");
	});

	it("includes both subject and body", () => {
		const result = buildQRData({
			...base,
			contentType: "email",
			email: { address: "hi@example.com", subject: "Hey", body: "How are you?" }
		});
		expect(result).toContain("subject=Hey");
		expect(result).toContain("body=How%20are%20you%3F");
	});

	it("encodes special characters in subject", () => {
		const result = buildQRData({
			...base,
			contentType: "email",
			email: { address: "a@b.com", subject: "Hello & World", body: "" }
		});
		expect(result).toContain("subject=Hello%20%26%20World");
	});
});

// ─── isConfigEmpty ────────────────────────────────────────────────────────────

describe("isConfigEmpty — url/text", () => {
	it("returns true when url text is empty", () => {
		expect(isConfigEmpty({ ...base, contentType: "url", text: "" })).toBe(true);
	});

	it("returns true when url text is only whitespace", () => {
		expect(isConfigEmpty({ ...base, contentType: "url", text: "   " })).toBe(true);
	});

	it("returns false when url text has content", () => {
		expect(isConfigEmpty({ ...base, contentType: "url", text: "example.com" })).toBe(false);
	});

	it("returns true when text content is empty", () => {
		expect(isConfigEmpty({ ...base, contentType: "text", text: "" })).toBe(true);
	});

	it("returns false when text content has value", () => {
		expect(isConfigEmpty({ ...base, contentType: "text", text: "hello" })).toBe(false);
	});
});

describe("isConfigEmpty — wifi", () => {
	it("returns true when SSID is empty", () => {
		expect(
			isConfigEmpty({
				...base,
				contentType: "wifi",
				wifi: { ssid: "", password: "pass", security: "WPA", hidden: false }
			})
		).toBe(true);
	});

	it("returns false when SSID has value", () => {
		expect(
			isConfigEmpty({
				...base,
				contentType: "wifi",
				wifi: { ssid: "MyNet", password: "", security: "nopass", hidden: false }
			})
		).toBe(false);
	});
});

describe("isConfigEmpty — email", () => {
	it("returns true when email address is empty", () => {
		expect(
			isConfigEmpty({
				...base,
				contentType: "email",
				email: { address: "", subject: "Hi", body: "" }
			})
		).toBe(true);
	});

	it("returns false when email address is provided", () => {
		expect(
			isConfigEmpty({
				...base,
				contentType: "email",
				email: { address: "a@b.com", subject: "", body: "" }
			})
		).toBe(false);
	});
});
