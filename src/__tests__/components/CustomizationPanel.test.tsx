import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CustomizationPanel } from "@/components/CustomizationPanel";
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

function setup(config: QRConfig = base) {
	const onUpdate = vi.fn();
	render(<CustomizationPanel config={config} onUpdate={onUpdate} />);
	return { onUpdate };
}

// ─── Dot style ────────────────────────────────────────────────────────────

describe("CustomizationPanel — dot style", () => {
	it("renders the dot style select", () => {
		setup();
		expect(screen.getByLabelText("customization.dotStyle")).toBeInTheDocument();
	});

	it("calls onUpdate with dotStyle when changed", () => {
		const { onUpdate } = setup();
		fireEvent.change(screen.getByLabelText("customization.dotStyle"), {
			target: { value: "dots" }
		});
		expect(onUpdate).toHaveBeenCalledWith("dotStyle", "dots");
	});

	it("shows current dotStyle as selected", () => {
		setup({ ...base, dotStyle: "rounded" });
		expect(screen.getByLabelText("customization.dotStyle")).toHaveValue("rounded");
	});
});

// ─── Corner style ─────────────────────────────────────────────────────────

describe("CustomizationPanel — corner style", () => {
	it("renders the corner style select", () => {
		setup();
		expect(screen.getByLabelText("customization.cornerStyle")).toBeInTheDocument();
	});

	it("calls onUpdate with cornerStyle when changed", () => {
		const { onUpdate } = setup();
		fireEvent.change(screen.getByLabelText("customization.cornerStyle"), {
			target: { value: "dot" }
		});
		expect(onUpdate).toHaveBeenCalledWith("cornerStyle", "dot");
	});
});

// ─── Error correction ─────────────────────────────────────────────────────

describe("CustomizationPanel — error correction", () => {
	it("renders the error correction select", () => {
		setup();
		expect(screen.getByLabelText("customization.errorCorrection")).toBeInTheDocument();
	});

	it("calls onUpdate with errorCorrection level when changed", () => {
		const { onUpdate } = setup();
		fireEvent.change(screen.getByLabelText("customization.errorCorrection"), {
			target: { value: "H" }
		});
		expect(onUpdate).toHaveBeenCalledWith("errorCorrection", "H");
	});
});

// ─── Color inputs ─────────────────────────────────────────────────────────

describe("CustomizationPanel — colors", () => {
	it("renders dot color input", () => {
		setup();
		expect(screen.getByLabelText("customization.dotColor")).toBeInTheDocument();
	});

	it("renders background color input", () => {
		setup();
		expect(screen.getByLabelText("customization.backgroundColor")).toBeInTheDocument();
	});

	it("calls onUpdate with dotColor on change", () => {
		const { onUpdate } = setup();
		fireEvent.change(screen.getByLabelText("customization.dotColor"), {
			target: { value: "#ff0000" }
		});
		expect(onUpdate).toHaveBeenCalledWith("dotColor", "#ff0000");
	});

	it("calls onUpdate with backgroundColor on change", () => {
		const { onUpdate } = setup();
		fireEvent.change(screen.getByLabelText("customization.backgroundColor"), {
			target: { value: "#000000" }
		});
		expect(onUpdate).toHaveBeenCalledWith("backgroundColor", "#000000");
	});
});

// ─── Size slider ──────────────────────────────────────────────────────────

describe("CustomizationPanel — size", () => {
	it("renders the size slider", () => {
		setup();
		expect(screen.getByLabelText("customization.size")).toBeInTheDocument();
	});

	it("shows current size value", () => {
		setup();
		expect(screen.getByText("300px")).toBeInTheDocument();
	});

	it("calls onUpdate with numeric size when slider changes", () => {
		const { onUpdate } = setup();
		fireEvent.change(screen.getByLabelText("customization.size"), {
			target: { value: "400" }
		});
		expect(onUpdate).toHaveBeenCalledWith("size", 400);
	});
});

// ─── Logo upload ──────────────────────────────────────────────────────────

describe("CustomizationPanel — logo", () => {
	it("shows the upload logo button", () => {
		setup();
		expect(screen.getByRole("button", { name: "a11y.uploadLogoAriaLabel" })).toBeInTheDocument();
	});

	it("does not show remove button when no logo", () => {
		setup();
		expect(
			screen.queryByRole("button", { name: "a11y.removeLogoAriaLabel" })
		).not.toBeInTheDocument();
	});

	it("shows logo preview and remove button when logoDataUrl is set", () => {
		setup({ ...base, logoDataUrl: "data:image/png;base64,abc" });
		expect(screen.getByAltText("Logo preview")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "a11y.removeLogoAriaLabel" })).toBeInTheDocument();
	});

	it("calls onUpdate with undefined when remove is clicked", async () => {
		const { onUpdate } = setup({ ...base, logoDataUrl: "data:image/png;base64,abc" });
		await userEvent.click(screen.getByRole("button", { name: "a11y.removeLogoAriaLabel" }));
		expect(onUpdate).toHaveBeenCalledWith("logoDataUrl", undefined);
	});

	it("rejects files larger than 200KB and does not call onUpdate", () => {
		const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {
			// suppress alert in test environment
		});
		const { onUpdate } = setup();
		const oversizedFile = new File([new ArrayBuffer(201 * 1024)], "big.png", {
			type: "image/png"
		});
		const input = document.querySelector('input[type="file"]') as HTMLInputElement;
		fireEvent.change(input, { target: { files: [oversizedFile] } });
		expect(alertMock).toHaveBeenCalled();
		expect(onUpdate).not.toHaveBeenCalled();
		alertMock.mockRestore();
	});
});
