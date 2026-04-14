import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Logo } from "@/components/Logo";

describe("Logo", () => {
	it("renders an SVG element", () => {
		const { container } = render(<Logo />);
		expect(container.querySelector("svg")).toBeInTheDocument();
	});

	it("applies the default size of 36", () => {
		const { container } = render(<Logo />);
		const svg = container.querySelector("svg")!;
		expect(svg.getAttribute("width")).toBe("36");
		expect(svg.getAttribute("height")).toBe("36");
	});

	it("applies a custom size", () => {
		const { container } = render(<Logo size={48} />);
		const svg = container.querySelector("svg")!;
		expect(svg.getAttribute("width")).toBe("48");
		expect(svg.getAttribute("height")).toBe("48");
	});

	it("is hidden from screen readers", () => {
		const { container } = render(<Logo />);
		const svg = container.querySelector("svg")!;
		expect(svg.getAttribute("aria-hidden")).toBe("true");
	});

	it("applies an optional className", () => {
		const { container } = render(<Logo className="test-class" />);
		expect(container.querySelector("svg")!.classList.contains("test-class")).toBe(true);
	});
});
