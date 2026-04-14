import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FeedbackWidget } from "@/components/feedback/FeedbackWidget";

const openPanel = async (user: ReturnType<typeof userEvent.setup>) => {
	await user.click(screen.getByRole("button", { name: "feedback.title" }));
};

const selectBugCategory = async (user: ReturnType<typeof userEvent.setup>) => {
	await user.click(screen.getByRole("button", { name: /feedback\.categoryBug/ }));
};

describe("FeedbackWidget", () => {
	beforeEach(() => {
		vi.stubGlobal("fetch", vi.fn());
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	// ─── Trigger button ───────────────────────────────────────────────────────

	describe("trigger button", () => {
		it("renders collapsed with aria-expanded false", () => {
			render(<FeedbackWidget />);
			expect(screen.getByRole("button", { name: "feedback.title" })).toHaveAttribute(
				"aria-expanded",
				"false"
			);
		});

		it("sets aria-expanded true when opened", async () => {
			const user = userEvent.setup();
			render(<FeedbackWidget />);
			await openPanel(user);
			expect(screen.getByRole("button", { name: "feedback.title" })).toHaveAttribute(
				"aria-expanded",
				"true"
			);
		});

		it("sets aria-expanded false when closed again", async () => {
			const user = userEvent.setup();
			render(<FeedbackWidget />);
			await openPanel(user);
			await openPanel(user); // toggle off
			expect(screen.getByRole("button", { name: "feedback.title" })).toHaveAttribute(
				"aria-expanded",
				"false"
			);
		});
	});

	// ─── Category step ────────────────────────────────────────────────────────

	describe("category step", () => {
		it("panel is hidden initially", () => {
			render(<FeedbackWidget />);
			expect(screen.queryByText("feedback.chooseCategory")).not.toBeInTheDocument();
		});

		it("shows category prompt when panel opens", async () => {
			const user = userEvent.setup();
			render(<FeedbackWidget />);
			await openPanel(user);
			expect(screen.getByText("feedback.chooseCategory")).toBeInTheDocument();
		});

		it("renders all three category buttons", async () => {
			const user = userEvent.setup();
			render(<FeedbackWidget />);
			await openPanel(user);
			expect(screen.getByRole("button", { name: /feedback\.categoryBug/ })).toBeInTheDocument();
			expect(
				screen.getByRole("button", { name: /feedback\.categorySuggestion/ })
			).toBeInTheDocument();
			expect(screen.getByRole("button", { name: /feedback\.categoryGeneral/ })).toBeInTheDocument();
		});

		it("does not show back button on category step", async () => {
			const user = userEvent.setup();
			render(<FeedbackWidget />);
			await openPanel(user);
			expect(screen.queryByRole("button", { name: "feedback.back" })).not.toBeInTheDocument();
		});
	});

	// ─── Message step ─────────────────────────────────────────────────────────

	describe("message step", () => {
		it("shows textarea after selecting a category", async () => {
			const user = userEvent.setup();
			render(<FeedbackWidget />);
			await openPanel(user);
			await selectBugCategory(user);
			expect(screen.getByRole("textbox")).toBeInTheDocument();
		});

		it("shows back button on message step", async () => {
			const user = userEvent.setup();
			render(<FeedbackWidget />);
			await openPanel(user);
			await selectBugCategory(user);
			expect(screen.getByRole("button", { name: "feedback.back" })).toBeInTheDocument();
		});

		it("submit button is disabled when message is empty", async () => {
			const user = userEvent.setup();
			render(<FeedbackWidget />);
			await openPanel(user);
			await selectBugCategory(user);
			expect(screen.getByRole("button", { name: /feedback\.send/ })).toBeDisabled();
		});

		it("submit button enables when message is typed", async () => {
			const user = userEvent.setup();
			render(<FeedbackWidget />);
			await openPanel(user);
			await selectBugCategory(user);
			await user.type(screen.getByRole("textbox"), "Found a bug!");
			expect(screen.getByRole("button", { name: /feedback\.send/ })).not.toBeDisabled();
		});

		it("shows character counter", async () => {
			const user = userEvent.setup();
			render(<FeedbackWidget />);
			await openPanel(user);
			await selectBugCategory(user);
			expect(screen.getByText(/a11y\.feedbackCharCount/)).toBeInTheDocument();
		});
	});

	// ─── Back navigation ──────────────────────────────────────────────────────

	describe("back navigation", () => {
		it("returns to category step when back is clicked", async () => {
			const user = userEvent.setup();
			render(<FeedbackWidget />);
			await openPanel(user);
			await selectBugCategory(user);
			await user.click(screen.getByRole("button", { name: "feedback.back" }));
			expect(screen.getByText("feedback.chooseCategory")).toBeInTheDocument();
		});

		it("clears the message when going back", async () => {
			const user = userEvent.setup();
			render(<FeedbackWidget />);
			await openPanel(user);
			await selectBugCategory(user);
			await user.type(screen.getByRole("textbox"), "some text");
			await user.click(screen.getByRole("button", { name: "feedback.back" }));
			await selectBugCategory(user);
			expect(screen.getByRole("textbox")).toHaveValue("");
		});
	});

	// ─── Close button ─────────────────────────────────────────────────────────

	describe("close button", () => {
		it("hides the panel when close is clicked", async () => {
			const user = userEvent.setup();
			render(<FeedbackWidget />);
			await openPanel(user);
			await user.click(screen.getByRole("button", { name: "feedback.close" }));
			await waitFor(() => {
				expect(screen.queryByText("feedback.chooseCategory")).not.toBeInTheDocument();
			});
		});
	});

	// ─── Submission ───────────────────────────────────────────────────────────

	describe("submission", () => {
		it("shows success view after successful submission", async () => {
			(fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
				ok: true,
				json: async () => ({})
			});
			const user = userEvent.setup();
			render(<FeedbackWidget />);
			await openPanel(user);
			await selectBugCategory(user);
			await user.type(screen.getByRole("textbox"), "Great tool!");
			await user.click(screen.getByRole("button", { name: /feedback\.send/ }));
			await screen.findByRole("status");
			expect(screen.getByText("feedback.successTitle")).toBeInTheDocument();
			expect(screen.getByText("feedback.successBody")).toBeInTheDocument();
		});

		it("clears the textarea after successful submission", async () => {
			(fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
				ok: true,
				json: async () => ({})
			});
			const user = userEvent.setup();
			render(<FeedbackWidget />);
			await openPanel(user);
			await selectBugCategory(user);
			await user.type(screen.getByRole("textbox"), "Great tool!");
			await user.click(screen.getByRole("button", { name: /feedback\.send/ }));
			await screen.findByRole("status");
			// Textarea is gone during success view; going back shows empty textarea
			await user.click(screen.getByRole("button", { name: "feedback.back" }));
			await selectBugCategory(user);
			expect(screen.getByRole("textbox")).toHaveValue("");
		});

		it("shows error alert on failed submission with server message", async () => {
			(fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
				ok: false,
				json: async () => ({ error: "Rate limit exceeded" })
			});
			const user = userEvent.setup();
			render(<FeedbackWidget />);
			await openPanel(user);
			await selectBugCategory(user);
			await user.type(screen.getByRole("textbox"), "Test message");
			await user.click(screen.getByRole("button", { name: /feedback\.send/ }));
			await waitFor(() => {
				expect(screen.getByRole("alert")).toHaveTextContent("Rate limit exceeded");
			});
		});

		it("shows generic error when server returns no message", async () => {
			(fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
				ok: false,
				json: async () => ({})
			});
			const user = userEvent.setup();
			render(<FeedbackWidget />);
			await openPanel(user);
			await selectBugCategory(user);
			await user.type(screen.getByRole("textbox"), "Test message");
			await user.click(screen.getByRole("button", { name: /feedback\.send/ }));
			await waitFor(() => {
				expect(screen.getByRole("alert")).toHaveTextContent("feedback.errorGeneric");
			});
		});

		it("re-enables the form after a failed submission", async () => {
			(fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
				ok: false,
				json: async () => ({})
			});
			const user = userEvent.setup();
			render(<FeedbackWidget />);
			await openPanel(user);
			await selectBugCategory(user);
			await user.type(screen.getByRole("textbox"), "Test message");
			await user.click(screen.getByRole("button", { name: /feedback\.send/ }));
			await waitFor(() => expect(screen.getByRole("textbox")).not.toBeDisabled());
		});
	});

	// ─── Bug fix: back after success ──────────────────────────────────────────

	describe("back after success", () => {
		it("shows category step instead of success view when back is clicked", async () => {
			(fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
				ok: true,
				json: async () => ({})
			});
			const user = userEvent.setup();
			render(<FeedbackWidget />);
			await openPanel(user);
			await selectBugCategory(user);
			await user.type(screen.getByRole("textbox"), "Great app!");
			await user.click(screen.getByRole("button", { name: /feedback\.send/ }));
			await screen.findByRole("status");

			await user.click(screen.getByRole("button", { name: "feedback.back" }));

			expect(screen.getByText("feedback.chooseCategory")).toBeInTheDocument();
			expect(screen.queryByRole("status")).not.toBeInTheDocument();
		});
	});
});
