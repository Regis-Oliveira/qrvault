import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type QRCodeStyling from "qr-code-styling";
import { describe, expect, it, vi } from "vitest";
import { DownloadPanel } from "@/components/DownloadPanel";

function makeQRRef(overrides: Partial<QRCodeStyling> = {}) {
	return {
		current: {
			append: vi.fn(),
			update: vi.fn(),
			download: vi.fn<() => Promise<void>>().mockResolvedValue(undefined),
			getRawData: vi.fn().mockResolvedValue(new Blob()),
			...overrides
		} as unknown as QRCodeStyling
	};
}

describe("DownloadPanel — download buttons", () => {
	it("renders PNG, SVG and JPG download buttons", () => {
		render(<DownloadPanel qrInstance={makeQRRef()} disabled={false} />);
		expect(screen.getByRole("button", { name: "a11y.downloadPng" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "a11y.downloadSvg" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "a11y.downloadJpg" })).toBeInTheDocument();
	});

	it("buttons are disabled when disabled prop is true", () => {
		render(<DownloadPanel qrInstance={makeQRRef()} disabled={true} />);
		expect(screen.getByRole("button", { name: "a11y.downloadPng" })).toBeDisabled();
		expect(screen.getByRole("button", { name: "a11y.downloadSvg" })).toBeDisabled();
		expect(screen.getByRole("button", { name: "a11y.downloadJpg" })).toBeDisabled();
	});

	it("calls qrInstance.download with png format", async () => {
		const ref = makeQRRef();
		render(<DownloadPanel qrInstance={ref} disabled={false} />);
		await userEvent.click(screen.getByRole("button", { name: "a11y.downloadPng" }));
		expect(ref.current.download).toHaveBeenCalledWith({ name: "qrvault-qr", extension: "png" });
	});

	it("calls qrInstance.download with svg format", async () => {
		const ref = makeQRRef();
		render(<DownloadPanel qrInstance={ref} disabled={false} />);
		await userEvent.click(screen.getByRole("button", { name: "a11y.downloadSvg" }));
		expect(ref.current.download).toHaveBeenCalledWith({ name: "qrvault-qr", extension: "svg" });
	});

	it("calls qrInstance.download with jpeg format", async () => {
		const ref = makeQRRef();
		render(<DownloadPanel qrInstance={ref} disabled={false} />);
		await userEvent.click(screen.getByRole("button", { name: "a11y.downloadJpg" }));
		expect(ref.current.download).toHaveBeenCalledWith({ name: "qrvault-qr", extension: "jpeg" });
	});

	it("does not call download when disabled", async () => {
		const ref = makeQRRef();
		render(<DownloadPanel qrInstance={ref} disabled={true} />);
		await userEvent.click(screen.getByRole("button", { name: "a11y.downloadPng" }));
		expect(ref.current.download).not.toHaveBeenCalled();
	});
});

describe("DownloadPanel — share", () => {
	it("renders WhatsApp and copy link buttons", () => {
		render(<DownloadPanel qrInstance={makeQRRef()} disabled={false} />);
		expect(screen.getByRole("button", { name: "a11y.shareWhatsapp" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "a11y.copyLink" })).toBeInTheDocument();
	});

	it("opens WhatsApp with current URL encoded", async () => {
		const openMock = vi.spyOn(window, "open").mockImplementation(() => null);
		render(<DownloadPanel qrInstance={makeQRRef()} disabled={false} />);
		await userEvent.click(screen.getByRole("button", { name: "a11y.shareWhatsapp" }));
		expect(openMock).toHaveBeenCalledWith(
			expect.stringContaining("wa.me"),
			"_blank",
			"noopener,noreferrer"
		);
		openMock.mockRestore();
	});

	it("shows 'Copied!' feedback after copy link", async () => {
		Object.assign(navigator, {
			clipboard: { writeText: vi.fn().mockResolvedValue(undefined) }
		});
		render(<DownloadPanel qrInstance={makeQRRef()} disabled={false} />);
		await userEvent.click(screen.getByRole("button", { name: "a11y.copyLink" }));
		expect(screen.getByRole("button", { name: "a11y.copyLink" })).toHaveTextContent("share.copied");
	});
});
