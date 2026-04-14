import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AccordionFAQ } from "@/components/AccordionFAQ";

// The mocked `t('faq.items', { returnObjects: true })` returns the key string,
// so we override to return a structured array.
vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string, opts?: Record<string, unknown>) => {
			if (key === "faq.items" && opts?.returnObjects) {
				return [
					{ question: "Is it private?", answer: "Yes, completely." },
					{ question: "What is a QR code?", answer: "A 2D barcode." },
					{ question: "Can I customize it?", answer: "Yes, colors and shapes." },
					{ question: "Does it support WiFi?", answer: "Yes." },
					{ question: "What formats can I download?", answer: "PNG, SVG, JPEG, WebP." },
					{ question: "Can I embed a logo?", answer: "Yes, upload any image." },
					{ question: "Is there a server?", answer: "No, everything runs in your browser." }
				];
			}
			return key;
		},
		i18n: { language: "en", changeLanguage: vi.fn() }
	})
}));

describe("AccordionFAQ", () => {
	it("renders the section heading", () => {
		render(<AccordionFAQ />);
		expect(screen.getByRole("heading", { name: "faq.title" })).toBeInTheDocument();
	});

	it("renders all 7 FAQ questions as buttons", () => {
		render(<AccordionFAQ />);
		const buttons = screen.getAllByRole("button");
		expect(buttons).toHaveLength(7);
	});

	// Answers are always in the DOM — hidden via opacity:0 on a parent div.
	// Use toBeVisible() which walks up ancestors and catches opacity:0.
	it("all answers are hidden initially", () => {
		render(<AccordionFAQ />);
		expect(screen.getByText("Yes, completely.")).not.toBeVisible();
	});

	it("expands an item when its button is clicked", async () => {
		const user = userEvent.setup();
		render(<AccordionFAQ />);
		await user.click(screen.getByRole("button", { name: /is it private/i }));
		expect(screen.getByText("Yes, completely.")).toBeVisible();
	});

	it("collapses an item when clicked again", async () => {
		const user = userEvent.setup();
		render(<AccordionFAQ />);
		const btn = screen.getByRole("button", { name: /is it private/i });
		await user.click(btn);
		expect(screen.getByText("Yes, completely.")).toBeVisible();
		await user.click(btn);
		expect(screen.getByText("Yes, completely.")).not.toBeVisible();
	});

	it("closes the previous item when a new one is opened", async () => {
		const user = userEvent.setup();
		render(<AccordionFAQ />);

		await user.click(screen.getByRole("button", { name: /is it private/i }));
		expect(screen.getByText("Yes, completely.")).toBeVisible();

		await user.click(screen.getByRole("button", { name: /what is a qr code/i }));
		expect(screen.getByText("Yes, completely.")).not.toBeVisible();
		expect(screen.getByText("A 2D barcode.")).toBeVisible();
	});

	it("sets aria-expanded correctly", async () => {
		const user = userEvent.setup();
		render(<AccordionFAQ />);
		const btn = screen.getByRole("button", { name: /is it private/i });
		expect(btn).toHaveAttribute("aria-expanded", "false");
		await user.click(btn);
		expect(btn).toHaveAttribute("aria-expanded", "true");
	});

	it("answer region is linked to its question button", async () => {
		const user = userEvent.setup();
		render(<AccordionFAQ />);
		const btn = screen.getByRole("button", { name: /is it private/i });
		const controlsId = btn.getAttribute("aria-controls");
		await user.click(btn);
		const region = document.getElementById(controlsId!);
		expect(region).toBeInTheDocument();
		expect(within(region!).getByText("Yes, completely.")).toBeInTheDocument();
	});
});
