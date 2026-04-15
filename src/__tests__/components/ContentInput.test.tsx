import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ContentInput } from "@/components/ContentInput";
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

function setup(props: Partial<Parameters<typeof ContentInput>[0]> = {}) {
	const onTextChange = vi.fn<(v: string) => void>();
	const onContentTypeChange = vi.fn<(t: QRConfig["contentType"]) => void>();
	const onWifiChange = vi.fn();
	const onEmailChange = vi.fn();
	render(
		<ContentInput
			config={base}
			onTextChange={onTextChange}
			onContentTypeChange={onContentTypeChange}
			onWifiChange={onWifiChange}
			onEmailChange={onEmailChange}
			{...props}
		/>
	);
	return { onTextChange, onContentTypeChange, onWifiChange, onEmailChange };
}

// ─── Tab switching ─────────────────────────────────────────────────────────

describe("ContentInput — tab switching", () => {
	it("renders all four content type tabs", () => {
		setup();
		expect(screen.getByRole("tab", { name: "contentType.url" })).toBeInTheDocument();
		expect(screen.getByRole("tab", { name: "contentType.text" })).toBeInTheDocument();
		expect(screen.getByRole("tab", { name: "contentType.email" })).toBeInTheDocument();
		expect(screen.getByRole("tab", { name: "contentType.wifi" })).toBeInTheDocument();
	});

	it("URL tab is selected by default", () => {
		setup();
		expect(screen.getByRole("tab", { name: "contentType.url" })).toHaveAttribute(
			"aria-selected",
			"true"
		);
	});

	it("calls onContentTypeChange when a tab is clicked", async () => {
		const { onContentTypeChange } = setup();
		await userEvent.click(screen.getByRole("tab", { name: "contentType.wifi" }));
		expect(onContentTypeChange).toHaveBeenCalledWith("wifi");
	});

	it("calls onContentTypeChange with 'email' when email tab clicked", async () => {
		const { onContentTypeChange } = setup();
		await userEvent.click(screen.getByRole("tab", { name: "contentType.email" }));
		expect(onContentTypeChange).toHaveBeenCalledWith("email");
	});
});

// ─── URL input ────────────────────────────────────────────────────────────

describe("ContentInput — url input", () => {
	it("shows a url input for the url content type", () => {
		setup();
		expect(screen.getByRole("textbox", { name: "url.label" })).toBeInTheDocument();
		expect(screen.queryByRole("textbox", { name: "input.label" })).not.toBeInTheDocument();
	});

	it("calls onTextChange after debounce when user types a URL", () => {
		vi.useFakeTimers();
		const { onTextChange } = setup();
		fireEvent.change(screen.getByRole("textbox", { name: "url.label" }), {
			target: { value: "https://example.com" }
		});
		expect(onTextChange).not.toHaveBeenCalled();
		vi.advanceTimersByTime(300);
		expect(onTextChange).toHaveBeenCalledWith("https://example.com");
		vi.useRealTimers();
	});

	it("does not show an error for an empty value", () => {
		setup();
		expect(screen.queryByText("url.error")).not.toBeInTheDocument();
	});

	it("does not show an error for a valid https URL", () => {
		setup();
		fireEvent.change(screen.getByRole("textbox", { name: "url.label" }), {
			target: { value: "https://example.com" }
		});
		expect(screen.queryByText("url.error")).not.toBeInTheDocument();
	});

	it("does not show an error for a valid http URL", () => {
		setup();
		fireEvent.change(screen.getByRole("textbox", { name: "url.label" }), {
			target: { value: "http://example.com/path?q=1" }
		});
		expect(screen.queryByText("url.error")).not.toBeInTheDocument();
	});

	it("shows an error for a URL without protocol", () => {
		setup();
		fireEvent.change(screen.getByRole("textbox", { name: "url.label" }), {
			target: { value: "example.com" }
		});
		expect(screen.getByText("url.error")).toBeInTheDocument();
	});

	it("clears the error when the field is cleared", () => {
		setup();
		const input = screen.getByRole("textbox", { name: "url.label" });
		fireEvent.change(input, { target: { value: "not-a-url" } });
		expect(screen.getByText("url.error")).toBeInTheDocument();
		fireEvent.change(input, { target: { value: "" } });
		expect(screen.queryByText("url.error")).not.toBeInTheDocument();
	});
});

// ─── Text textarea ─────────────────────────────────────────────────────────

describe("ContentInput — text textarea", () => {
	it("shows the textarea for text content type", () => {
		setup({ config: { ...base, contentType: "text" } });
		expect(screen.getByRole("textbox", { name: "input.label" })).toBeInTheDocument();
	});

	it("calls onTextChange after debounce when user types", () => {
		vi.useFakeTimers();
		const { onTextChange } = setup({ config: { ...base, contentType: "text" } });
		const textarea = screen.getByRole("textbox", { name: "input.label" });
		fireEvent.change(textarea, { target: { value: "hello" } });
		expect(onTextChange).not.toHaveBeenCalled();
		vi.advanceTimersByTime(300);
		expect(onTextChange).toHaveBeenCalledWith("hello");
		vi.useRealTimers();
	});

	it("does not call onTextChange before debounce elapses", () => {
		vi.useFakeTimers();
		const { onTextChange } = setup({ config: { ...base, contentType: "text" } });
		fireEvent.change(screen.getByRole("textbox", { name: "input.label" }), {
			target: { value: "ab" }
		});
		vi.advanceTimersByTime(100);
		expect(onTextChange).not.toHaveBeenCalled();
		vi.useRealTimers();
	});
});

// ─── WiFi form ─────────────────────────────────────────────────────────────

describe("ContentInput — wifi form", () => {
	it("shows SSID, security and password fields for wifi type", () => {
		setup({ config: { ...base, contentType: "wifi" } });
		expect(screen.getByLabelText("wifi.ssid")).toBeInTheDocument();
		expect(screen.getByLabelText("wifi.security")).toBeInTheDocument();
		expect(screen.getByLabelText("wifi.password")).toBeInTheDocument();
	});

	it("hides password field when security is nopass", () => {
		setup({
			config: {
				...base,
				contentType: "wifi",
				wifi: { ...base.wifi, security: "nopass" }
			}
		});
		expect(screen.queryByLabelText("wifi.password")).not.toBeInTheDocument();
	});

	it("calls onWifiChange when SSID is typed", () => {
		const { onWifiChange } = setup({ config: { ...base, contentType: "wifi" } });
		fireEvent.change(screen.getByLabelText("wifi.ssid"), { target: { value: "A" } });
		expect(onWifiChange).toHaveBeenCalled();
	});

	it("shows hidden network checkbox", () => {
		setup({ config: { ...base, contentType: "wifi" } });
		expect(screen.getByRole("checkbox")).toBeInTheDocument();
	});

	it("calls onWifiChange when hidden checkbox is toggled", async () => {
		const { onWifiChange } = setup({ config: { ...base, contentType: "wifi" } });
		await userEvent.click(screen.getByRole("checkbox"));
		expect(onWifiChange).toHaveBeenCalledWith(expect.objectContaining({ hidden: true }));
	});
});

// ─── Email form ────────────────────────────────────────────────────────────

describe("ContentInput — email form", () => {
	it("shows address, subject and body fields", () => {
		setup({ config: { ...base, contentType: "email" } });
		expect(screen.getByLabelText("email.address")).toBeInTheDocument();
		expect(screen.getByLabelText("email.subject")).toBeInTheDocument();
		expect(screen.getByLabelText("email.body")).toBeInTheDocument();
	});

	it("calls onEmailChange when address is typed", () => {
		const { onEmailChange } = setup({ config: { ...base, contentType: "email" } });
		fireEvent.change(screen.getByLabelText("email.address"), { target: { value: "a@b.com" } });
		expect(onEmailChange).toHaveBeenCalledWith(expect.objectContaining({ address: "a@b.com" }));
	});

	it("calls onEmailChange with updated subject", () => {
		const { onEmailChange } = setup({ config: { ...base, contentType: "email" } });
		fireEvent.change(screen.getByLabelText("email.subject"), { target: { value: "Hi" } });
		expect(onEmailChange).toHaveBeenCalledWith(expect.objectContaining({ subject: "Hi" }));
	});
});
