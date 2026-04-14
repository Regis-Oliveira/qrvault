import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useQRConfig } from "@/hooks/useQRConfig";

describe("useQRConfig — initial state", () => {
	it("starts with contentType url", () => {
		const { result } = renderHook(() => useQRConfig());
		expect(result.current.config.contentType).toBe("url");
	});

	it("starts with empty text", () => {
		const { result } = renderHook(() => useQRConfig());
		expect(result.current.config.text).toBe("");
	});

	it("starts with cyan dot color", () => {
		const { result } = renderHook(() => useQRConfig());
		expect(result.current.config.dotColor).toBe("#06b6d4");
	});

	it("starts with white background", () => {
		const { result } = renderHook(() => useQRConfig());
		expect(result.current.config.backgroundColor).toBe("#ffffff");
	});

	it("starts with size 300", () => {
		const { result } = renderHook(() => useQRConfig());
		expect(result.current.config.size).toBe(300);
	});

	it("starts with no logo", () => {
		const { result } = renderHook(() => useQRConfig());
		expect(result.current.config.logoDataUrl).toBeUndefined();
	});

	it("starts with M error correction", () => {
		const { result } = renderHook(() => useQRConfig());
		expect(result.current.config.errorCorrection).toBe("M");
	});
});

describe("useQRConfig — update", () => {
	it("updates text field", () => {
		const { result } = renderHook(() => useQRConfig());
		act(() => result.current.update("text", "https://example.com"));
		expect(result.current.config.text).toBe("https://example.com");
	});

	it("updates contentType", () => {
		const { result } = renderHook(() => useQRConfig());
		act(() => result.current.update("contentType", "wifi"));
		expect(result.current.config.contentType).toBe("wifi");
	});

	it("updates dotColor", () => {
		const { result } = renderHook(() => useQRConfig());
		act(() => result.current.update("dotColor", "#ff0000"));
		expect(result.current.config.dotColor).toBe("#ff0000");
	});

	it("updates size", () => {
		const { result } = renderHook(() => useQRConfig());
		act(() => result.current.update("size", 400));
		expect(result.current.config.size).toBe(400);
	});

	it("updates logoDataUrl to a string", () => {
		const { result } = renderHook(() => useQRConfig());
		act(() => result.current.update("logoDataUrl", "data:image/png;base64,abc"));
		expect(result.current.config.logoDataUrl).toBe("data:image/png;base64,abc");
	});

	it("updates logoDataUrl back to undefined", () => {
		const { result } = renderHook(() => useQRConfig());
		act(() => result.current.update("logoDataUrl", "data:image/png;base64,abc"));
		act(() => result.current.update("logoDataUrl", undefined));
		expect(result.current.config.logoDataUrl).toBeUndefined();
	});

	it("does not mutate unrelated fields on update", () => {
		const { result } = renderHook(() => useQRConfig());
		act(() => result.current.update("text", "hello"));
		expect(result.current.config.dotColor).toBe("#06b6d4");
		expect(result.current.config.contentType).toBe("url");
	});

	it("updates wifi sub-object", () => {
		const { result } = renderHook(() => useQRConfig());
		act(() =>
			result.current.update("wifi", {
				ssid: "MyNet",
				password: "secret",
				security: "WPA",
				hidden: true
			})
		);
		expect(result.current.config.wifi.ssid).toBe("MyNet");
		expect(result.current.config.wifi.hidden).toBe(true);
	});
});

describe("useQRConfig — reset", () => {
	it("resets all fields to defaults", () => {
		const { result } = renderHook(() => useQRConfig());
		act(() => {
			result.current.update("text", "https://changed.com");
			result.current.update("dotColor", "#ff0000");
			result.current.update("size", 512);
		});
		act(() => result.current.reset());
		expect(result.current.config.text).toBe("");
		expect(result.current.config.dotColor).toBe("#06b6d4");
		expect(result.current.config.size).toBe(300);
	});
});
