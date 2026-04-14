import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Footer } from "@/components/Footer";

describe("Footer", () => {
	it("renders the brand name", () => {
		render(<Footer />);
		expect(screen.getByText("QRVault")).toBeInTheDocument();
	});

	it("renders the privacy notice", () => {
		render(<Footer />);
		expect(screen.getByText("footer.privacy")).toBeInTheDocument();
	});

	it("renders footer credits", () => {
		render(<Footer />);
		expect(screen.getByText("footer.madeWith")).toBeInTheDocument();
		expect(screen.getByText("footer.rights")).toBeInTheDocument();
	});

	it("uses a footer landmark element", () => {
		render(<Footer />);
		expect(screen.getByRole("contentinfo")).toBeInTheDocument();
	});
});
