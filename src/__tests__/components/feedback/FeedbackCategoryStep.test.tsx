import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FeedbackCategoryStep } from "@/components/feedback/FeedbackCategoryStep";

describe("FeedbackCategoryStep", () => {
	describe("rendering", () => {
		it("renders the choose-category prompt", () => {
			render(<FeedbackCategoryStep onSelect={vi.fn()} />);
			expect(screen.getByText("feedback.chooseCategory")).toBeInTheDocument();
		});

		it("renders exactly 3 category buttons", () => {
			render(<FeedbackCategoryStep onSelect={vi.fn()} />);
			expect(screen.getAllByRole("button")).toHaveLength(3);
		});

		it("renders the bug category button", () => {
			render(<FeedbackCategoryStep onSelect={vi.fn()} />);
			expect(screen.getByText("feedback.categoryBug")).toBeInTheDocument();
		});

		it("renders the suggestion category button", () => {
			render(<FeedbackCategoryStep onSelect={vi.fn()} />);
			expect(screen.getByText("feedback.categorySuggestion")).toBeInTheDocument();
		});

		it("renders the general category button", () => {
			render(<FeedbackCategoryStep onSelect={vi.fn()} />);
			expect(screen.getByText("feedback.categoryGeneral")).toBeInTheDocument();
		});
	});

	describe("interactions", () => {
		it("calls onSelect with 'bug' when the bug button is clicked", async () => {
			const user = userEvent.setup();
			const onSelect = vi.fn();
			render(<FeedbackCategoryStep onSelect={onSelect} />);
			await user.click(screen.getByText("feedback.categoryBug"));
			expect(onSelect).toHaveBeenCalledWith("bug");
		});

		it("calls onSelect with 'suggestion' when the suggestion button is clicked", async () => {
			const user = userEvent.setup();
			const onSelect = vi.fn();
			render(<FeedbackCategoryStep onSelect={onSelect} />);
			await user.click(screen.getByText("feedback.categorySuggestion"));
			expect(onSelect).toHaveBeenCalledWith("suggestion");
		});

		it("calls onSelect with 'general' when the general button is clicked", async () => {
			const user = userEvent.setup();
			const onSelect = vi.fn();
			render(<FeedbackCategoryStep onSelect={onSelect} />);
			await user.click(screen.getByText("feedback.categoryGeneral"));
			expect(onSelect).toHaveBeenCalledWith("general");
		});
	});
});
