import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type QRCodeStyling from "qr-code-styling";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DownloadPanel } from "@/components/DownloadPanel";
import type { QRConfig } from "@/types/qr";

const DEFAULT_CONFIG: QRConfig = {
	contentType: "url",
	text: "https://example.com",
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

function makeQRRef(overrides: Partial<QRCodeStyling> = {}) {
	return {
		current: {
			append: vi.fn(),
			update: vi.fn(),
			download: vi.fn<() => Promise<void>>().mockResolvedValue(undefined),
			getRawData: vi.fn().mockResolvedValue(new Blob(["mock-qr"], { type: "image/png" })),
			...overrides
		} as unknown as QRCodeStyling
	};
}

function renderPanel(props: Partial<Parameters<typeof DownloadPanel>[0]> = {}) {
	return render(
		<DownloadPanel qrInstance={makeQRRef()} disabled={false} config={DEFAULT_CONFIG} {...props} />
	);
}

// ─── Download buttons ─────────────────────────────────────────────────────────

describe("DownloadPanel — download buttons", () => {
	it("renders PNG, SVG and JPG download buttons", () => {
		renderPanel();
		expect(screen.getByRole("button", { name: "a11y.downloadPng" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "a11y.downloadSvg" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "a11y.downloadJpg" })).toBeInTheDocument();
	});

	it("buttons are disabled when disabled prop is true", () => {
		renderPanel({ disabled: true });
		expect(screen.getByRole("button", { name: "a11y.downloadPng" })).toBeDisabled();
		expect(screen.getByRole("button", { name: "a11y.downloadSvg" })).toBeDisabled();
		expect(screen.getByRole("button", { name: "a11y.downloadJpg" })).toBeDisabled();
	});

	it("calls qrInstance.download with png format", async () => {
		const ref = makeQRRef();
		render(<DownloadPanel qrInstance={ref} disabled={false} config={DEFAULT_CONFIG} />);
		await userEvent.click(screen.getByRole("button", { name: "a11y.downloadPng" }));
		expect(ref.current.download).toHaveBeenCalledWith({ name: "qrvault-qr", extension: "png" });
	});

	it("shows success feedback on the clicked button after download", async () => {
		const ref = makeQRRef();
		render(<DownloadPanel qrInstance={ref} disabled={false} config={DEFAULT_CONFIG} />);
		await userEvent.click(screen.getByRole("button", { name: "a11y.downloadPng" }));
		expect(screen.getByRole("button", { name: "a11y.downloadPng" })).toHaveTextContent(
			"✓ download.png"
		);
	});

	it("does not show success feedback on other buttons after download", async () => {
		const ref = makeQRRef();
		render(<DownloadPanel qrInstance={ref} disabled={false} config={DEFAULT_CONFIG} />);
		await userEvent.click(screen.getByRole("button", { name: "a11y.downloadPng" }));
		expect(screen.getByRole("button", { name: "a11y.downloadSvg" })).toHaveTextContent(
			"download.svg"
		);
	});

	it("calls qrInstance.download with svg format", async () => {
		const ref = makeQRRef();
		render(<DownloadPanel qrInstance={ref} disabled={false} config={DEFAULT_CONFIG} />);
		await userEvent.click(screen.getByRole("button", { name: "a11y.downloadSvg" }));
		expect(ref.current.download).toHaveBeenCalledWith({ name: "qrvault-qr", extension: "svg" });
	});

	it("calls qrInstance.download with jpeg format", async () => {
		const ref = makeQRRef();
		render(<DownloadPanel qrInstance={ref} disabled={false} config={DEFAULT_CONFIG} />);
		await userEvent.click(screen.getByRole("button", { name: "a11y.downloadJpg" }));
		expect(ref.current.download).toHaveBeenCalledWith({ name: "qrvault-qr", extension: "jpeg" });
	});

	it("does not call download when disabled", async () => {
		const ref = makeQRRef();
		render(<DownloadPanel qrInstance={ref} disabled={true} config={DEFAULT_CONFIG} />);
		await userEvent.click(screen.getByRole("button", { name: "a11y.downloadPng" }));
		expect(ref.current.download).not.toHaveBeenCalled();
	});
});

// ─── Save button ──────────────────────────────────────────────────────────────

describe("DownloadPanel — save button", () => {
	it("renders the save button", () => {
		renderPanel();
		expect(screen.getByRole("button", { name: "save.button" })).toBeInTheDocument();
	});

	it("save button is disabled when disabled prop is true", () => {
		renderPanel({ disabled: true });
		expect(screen.getByRole("button", { name: "save.button" })).toBeDisabled();
	});

	it("shows Update label when editMeta is provided", () => {
		renderPanel({
			editMeta: { id: "abc", title: "My QR", description: "", category: "Work" }
		});
		expect(screen.getByRole("button", { name: "save.updateBtn" })).toBeInTheDocument();
	});

	it("opens the save dialog when save button is clicked", async () => {
		renderPanel();
		await userEvent.click(screen.getByRole("button", { name: "save.button" }));
		expect(screen.getByRole("dialog")).toBeInTheDocument();
	});
});

// ─── Share — copy content ─────────────────────────────────────────────────────

describe("DownloadPanel — copy content", () => {
	beforeEach(() => {
		Object.assign(navigator, {
			clipboard: { writeText: vi.fn().mockResolvedValue(undefined) }
		});
	});

	it("renders the copy content button", () => {
		renderPanel();
		expect(screen.getByRole("button", { name: "a11y.copyContent" })).toBeInTheDocument();
	});

	it("copy content button is disabled when disabled prop is true", () => {
		renderPanel({ disabled: true });
		expect(screen.getByRole("button", { name: "a11y.copyContent" })).toBeDisabled();
	});

	it("copies the QR encoded URL for url type", async () => {
		renderPanel();
		await userEvent.click(screen.getByRole("button", { name: "a11y.copyContent" }));
		expect(navigator.clipboard.writeText).toHaveBeenCalledWith("https://example.com");
	});

	it("copies the plain text for text type", async () => {
		renderPanel({ config: { ...DEFAULT_CONFIG, contentType: "text", text: "hello world" } });
		await userEvent.click(screen.getByRole("button", { name: "a11y.copyContent" }));
		expect(navigator.clipboard.writeText).toHaveBeenCalledWith("hello world");
	});

	it("copies the mailto string for email type", async () => {
		renderPanel({
			config: {
				...DEFAULT_CONFIG,
				contentType: "email",
				email: { address: "test@example.com", subject: "Hi", body: "" }
			}
		});
		await userEvent.click(screen.getByRole("button", { name: "a11y.copyContent" }));
		expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
			"mailto:test@example.com?subject=Hi"
		);
	});

	it("copies the WiFi string for wifi type", async () => {
		renderPanel({
			config: {
				...DEFAULT_CONFIG,
				contentType: "wifi",
				wifi: { ssid: "MyNet", password: "secret", security: "WPA", hidden: false }
			}
		});
		await userEvent.click(screen.getByRole("button", { name: "a11y.copyContent" }));
		expect(navigator.clipboard.writeText).toHaveBeenCalledWith("WIFI:T:WPA;S:MyNet;P:secret;;");
	});

	it("shows Copied! feedback after clicking copy", async () => {
		renderPanel();
		await userEvent.click(screen.getByRole("button", { name: "a11y.copyContent" }));
		expect(screen.getByRole("button", { name: "a11y.copyContent" })).toHaveTextContent(
			"share.copied"
		);
	});

	it("does not write to clipboard when content is empty", async () => {
		renderPanel({ config: { ...DEFAULT_CONFIG, contentType: "url", text: "" } });
		await userEvent.click(screen.getByRole("button", { name: "a11y.copyContent" }));
		expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
	});

	it("does not throw when clipboard API is unavailable", async () => {
		Object.assign(navigator, {
			clipboard: { writeText: vi.fn().mockRejectedValue(new Error("not allowed")) }
		});
		renderPanel();
		await userEvent.click(screen.getByRole("button", { name: "a11y.copyContent" }));
		expect(screen.getByRole("button", { name: "a11y.copyContent" })).toBeInTheDocument();
	});
});

// ─── Share — share image ──────────────────────────────────────────────────────

describe("DownloadPanel — share image", () => {
	afterEach(() => {
		// Reset canShare / share so other tests aren't affected
		Object.defineProperty(navigator, "canShare", {
			value: undefined,
			writable: true,
			configurable: true
		});
		Object.defineProperty(navigator, "share", {
			value: undefined,
			writable: true,
			configurable: true
		});
	});

	it("does not render Share Image button when navigator.canShare is not available", () => {
		// canShare is undefined by default in jsdom
		renderPanel();
		expect(screen.queryByRole("button", { name: "a11y.shareImage" })).not.toBeInTheDocument();
	});

	it("renders Share Image button when navigator.canShare returns true", () => {
		Object.defineProperty(navigator, "canShare", { value: () => true, configurable: true });
		Object.defineProperty(navigator, "share", {
			value: vi.fn().mockResolvedValue(undefined),
			configurable: true
		});
		renderPanel();
		expect(screen.getByRole("button", { name: "a11y.shareImage" })).toBeInTheDocument();
	});

	it("does not render Share Image button when navigator.canShare returns false", () => {
		Object.defineProperty(navigator, "canShare", { value: () => false, configurable: true });
		renderPanel();
		expect(screen.queryByRole("button", { name: "a11y.shareImage" })).not.toBeInTheDocument();
	});

	it("calls navigator.share with a PNG File when Share Image is clicked", async () => {
		const shareMock = vi.fn().mockResolvedValue(undefined);
		Object.defineProperty(navigator, "canShare", { value: () => true, configurable: true });
		Object.defineProperty(navigator, "share", { value: shareMock, configurable: true });

		const ref = makeQRRef({
			getRawData: vi.fn().mockResolvedValue(new Blob(["qr"], { type: "image/png" }))
		});
		render(<DownloadPanel qrInstance={ref} disabled={false} config={DEFAULT_CONFIG} />);

		await userEvent.click(screen.getByRole("button", { name: "a11y.shareImage" }));

		expect(shareMock).toHaveBeenCalledWith(
			expect.objectContaining({
				files: expect.arrayContaining([expect.any(File)])
			})
		);
		const [call] = shareMock.mock.calls;
		expect(call[0].files[0].name).toBe("qrvault-qr.png");
		expect(call[0].files[0].type).toBe("image/png");
	});

	it("Share Image button is disabled when disabled prop is true", () => {
		Object.defineProperty(navigator, "canShare", { value: () => true, configurable: true });
		Object.defineProperty(navigator, "share", {
			value: vi.fn().mockResolvedValue(undefined),
			configurable: true
		});
		renderPanel({ disabled: true });
		expect(screen.getByRole("button", { name: "a11y.shareImage" })).toBeDisabled();
	});

	it("does not throw when user cancels the share sheet (AbortError)", async () => {
		Object.defineProperty(navigator, "canShare", { value: () => true, configurable: true });
		Object.defineProperty(navigator, "share", {
			value: vi.fn().mockRejectedValue(new DOMException("Share cancelled", "AbortError")),
			configurable: true
		});
		renderPanel();
		await userEvent.click(screen.getByRole("button", { name: "a11y.shareImage" }));
		expect(screen.getByRole("button", { name: "a11y.shareImage" })).toBeInTheDocument();
	});

	it("does not call navigator.share when getRawData returns non-Blob", async () => {
		const shareMock = vi.fn().mockResolvedValue(undefined);
		Object.defineProperty(navigator, "canShare", { value: () => true, configurable: true });
		Object.defineProperty(navigator, "share", { value: shareMock, configurable: true });

		const ref = makeQRRef({ getRawData: vi.fn().mockResolvedValue(null) });
		render(<DownloadPanel qrInstance={ref} disabled={false} config={DEFAULT_CONFIG} />);

		await userEvent.click(screen.getByRole("button", { name: "a11y.shareImage" }));
		expect(shareMock).not.toHaveBeenCalled();
	});
});
