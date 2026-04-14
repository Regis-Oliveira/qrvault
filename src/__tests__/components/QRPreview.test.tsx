import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QRPreview } from "@/components/QRPreview";
import type { QRConfig } from "@/types/qr";

const base: QRConfig = {
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

const emptyConfig: QRConfig = { ...base, text: "" };

describe("QRPreview", () => {
	it("renders the QR container with correct role and aria-label", () => {
		render(<QRPreview config={base} />);
		expect(screen.getByRole("img", { name: "a11y.qrPreview" })).toBeInTheDocument();
	});

	it("shows the empty overlay when config is empty", () => {
		render(<QRPreview config={emptyConfig} />);
		expect(screen.getByText("preview.empty")).toBeInTheDocument();
	});

	it("does not show the empty overlay when config has content", () => {
		render(<QRPreview config={base} />);
		expect(screen.queryByText("preview.empty")).not.toBeInTheDocument();
	});

	it("shows scan hint when config has content", () => {
		render(<QRPreview config={base} />);
		expect(screen.getByText("preview.scanHint")).toBeInTheDocument();
	});

	it("does not show scan hint when config is empty", () => {
		render(<QRPreview config={emptyConfig} />);
		expect(screen.queryByText("preview.scanHint")).not.toBeInTheDocument();
	});
});
