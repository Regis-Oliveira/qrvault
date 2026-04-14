import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Header } from "@/components/Header";
import { setLanguage } from "@/i18n";

describe("Header", () => {
	it("renders the brand name", () => {
		render(<Header />);
		expect(screen.getByText("brand.name")).toBeInTheDocument();
	});

	it("renders the logo link with accessible label", () => {
		render(<Header />);
		const link = screen.getByRole("link", { name: "brand.name" });
		expect(link).toBeInTheDocument();
	});

	it("renders the buy me a coffee link", () => {
		render(<Header />);
		expect(screen.getByRole("link", { name: "nav.buyMeCoffee" })).toBeInTheDocument();
	});

	it("renders the language switcher trigger button", () => {
		render(<Header />);
		expect(screen.getByRole("button", { name: /select language/i })).toBeInTheDocument();
	});

	it("opens the language dropdown and lists all languages when trigger is clicked", async () => {
		const user = userEvent.setup();
		render(<Header />);
		await user.click(screen.getByTestId("lang-trigger"));
		const listbox = screen.getByTestId("lang-dropdown");
		expect(listbox).toBeInTheDocument();
		expect(within(listbox).getByText("English")).toBeInTheDocument();
		expect(within(listbox).getByText("Português")).toBeInTheDocument();
		expect(within(listbox).getByText("Español")).toBeInTheDocument();
		expect(within(listbox).getByText("Français")).toBeInTheDocument();
		expect(within(listbox).getByText("Polski")).toBeInTheDocument();
	});

	it("calls setLanguage and closes dropdown when a language option is clicked", async () => {
		const user = userEvent.setup();
		render(<Header />);
		await user.click(screen.getByTestId("lang-trigger"));
		const listbox = screen.getByTestId("lang-dropdown");
		await user.click(within(listbox).getByText("Português"));
		expect(setLanguage).toHaveBeenCalledWith("pt-BR");
		expect(screen.queryByTestId("lang-dropdown")).not.toBeInTheDocument();
	});

	it("renders a navigation landmark", () => {
		render(<Header />);
		expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeInTheDocument();
	});
});
