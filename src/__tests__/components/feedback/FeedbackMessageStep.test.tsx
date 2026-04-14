import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FeedbackMessageStep } from "@/components/feedback/FeedbackMessageStep";
import { CATEGORIES } from "@/components/feedback/types";

const defaultProps = {
	message: "",
	onMessageChange: vi.fn(),
	status: "idle" as const,
	errorMsg: "",
	selectedCat: CATEGORIES[0], // bug — color: #f87171
	placeholder: "Describe the bug…",
	remaining: 1000,
	canSubmit: false,
	onSubmit: vi.fn(),
	screenshot: null,
	onScreenshotRequest: vi.fn(),
	onScreenshotRemove: vi.fn()
};

describe("FeedbackMessageStep", () => {
	describe("rendering", () => {
		it("renders the textarea", () => {
			render(<FeedbackMessageStep {...defaultProps} />);
			expect(screen.getByRole("textbox")).toBeInTheDocument();
		});

		it("textarea has the placeholder as aria-label", () => {
			render(<FeedbackMessageStep {...defaultProps} placeholder="Write your message" />);
			expect(screen.getByRole("textbox")).toHaveAttribute("aria-label", "Write your message");
		});

		it("renders the character counter", () => {
			render(<FeedbackMessageStep {...defaultProps} />);
			expect(screen.getByText("a11y.feedbackCharCount")).toBeInTheDocument();
		});

		it("renders the submit button", () => {
			render(<FeedbackMessageStep {...defaultProps} />);
			expect(screen.getByRole("button", { name: /feedback\.send/ })).toBeInTheDocument();
		});

		it("submit button is disabled when canSubmit is false", () => {
			render(<FeedbackMessageStep {...defaultProps} canSubmit={false} />);
			expect(screen.getByRole("button", { name: /feedback\.send/ })).toBeDisabled();
		});

		it("submit button is enabled when canSubmit is true", () => {
			render(<FeedbackMessageStep {...defaultProps} canSubmit={true} />);
			expect(screen.getByRole("button", { name: /feedback\.send/ })).not.toBeDisabled();
		});

		it("shows the add-screenshot button when screenshot is null", () => {
			render(<FeedbackMessageStep {...defaultProps} screenshot={null} />);
			expect(screen.getByTitle("feedback.addScreenshot")).toBeInTheDocument();
		});

		it("shows the screenshot thumbnail when a screenshot is provided", () => {
			render(<FeedbackMessageStep {...defaultProps} screenshot="data:image/png;base64,FAKE" />);
			expect(screen.getByAltText("feedback.screenshotPreviewAlt")).toBeInTheDocument();
		});

		it("shows the remove-screenshot button when a screenshot is provided", () => {
			render(<FeedbackMessageStep {...defaultProps} screenshot="data:image/png;base64,FAKE" />);
			expect(screen.getByRole("button", { name: "feedback.removeScreenshot" })).toBeInTheDocument();
		});
	});

	describe("interactions", () => {
		it("calls onScreenshotRequest when the add-screenshot button is clicked", async () => {
			const user = userEvent.setup();
			const onScreenshotRequest = vi.fn();
			render(<FeedbackMessageStep {...defaultProps} onScreenshotRequest={onScreenshotRequest} />);
			await user.click(screen.getByTitle("feedback.addScreenshot"));
			expect(onScreenshotRequest).toHaveBeenCalledOnce();
		});

		it("calls onScreenshotRemove when the remove button is clicked", async () => {
			const user = userEvent.setup();
			const onScreenshotRemove = vi.fn();
			render(
				<FeedbackMessageStep
					{...defaultProps}
					screenshot="data:image/png;base64,FAKE"
					onScreenshotRemove={onScreenshotRemove}
				/>
			);
			await user.click(screen.getByRole("button", { name: "feedback.removeScreenshot" }));
			expect(onScreenshotRemove).toHaveBeenCalledOnce();
		});

		it("calls onMessageChange when text is typed", async () => {
			const user = userEvent.setup();
			const onMessageChange = vi.fn();
			render(<FeedbackMessageStep {...defaultProps} onMessageChange={onMessageChange} />);
			await user.type(screen.getByRole("textbox"), "Hello");
			expect(onMessageChange).toHaveBeenCalled();
		});

		it("calls onSubmit when the form is submitted", () => {
			const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
			render(<FeedbackMessageStep {...defaultProps} canSubmit={true} onSubmit={onSubmit} />);
			fireEvent.submit(screen.getByRole("button", { name: /feedback\.send/ }).closest("form")!);
			expect(onSubmit).toHaveBeenCalledOnce();
		});
	});

	describe("error and sending states", () => {
		it("shows the error message in the alert region when status is error", () => {
			render(
				<FeedbackMessageStep {...defaultProps} status="error" errorMsg="Something went wrong" />
			);
			expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong");
		});

		it("shows an empty alert when status is not error", () => {
			render(<FeedbackMessageStep {...defaultProps} status="idle" errorMsg="ignored" />);
			expect(screen.getByRole("alert")).toHaveTextContent("");
		});

		it("disables the textarea when status is sending", () => {
			render(<FeedbackMessageStep {...defaultProps} status="sending" />);
			expect(screen.getByRole("textbox")).toBeDisabled();
		});

		it("shows 'feedback.sending' in the submit button when sending", () => {
			render(<FeedbackMessageStep {...defaultProps} status="sending" />);
			expect(screen.getByText("feedback.sending")).toBeInTheDocument();
		});

		it("disables the add-screenshot button when sending", () => {
			render(<FeedbackMessageStep {...defaultProps} status="sending" screenshot={null} />);
			expect(screen.getByTitle("feedback.addScreenshot")).toBeDisabled();
		});

		it("disables the remove-screenshot button when sending", () => {
			render(
				<FeedbackMessageStep
					{...defaultProps}
					status="sending"
					screenshot="data:image/png;base64,FAKE"
				/>
			);
			expect(screen.getByRole("button", { name: "feedback.removeScreenshot" })).toBeDisabled();
		});
	});

	describe("character counter class", () => {
		it("uses error class when remaining is below 50", () => {
			render(<FeedbackMessageStep {...defaultProps} remaining={49} />);
			const counter = document.getElementById("feedback-counter")!;
			expect(counter).toHaveClass("text-error");
		});

		it("uses muted class when remaining is exactly 50", () => {
			render(<FeedbackMessageStep {...defaultProps} remaining={50} />);
			const counter = document.getElementById("feedback-counter")!;
			expect(counter).toHaveClass("text-gray-400");
		});

		it("uses muted class when remaining is above 50", () => {
			render(<FeedbackMessageStep {...defaultProps} remaining={500} />);
			const counter = document.getElementById("feedback-counter")!;
			expect(counter).toHaveClass("text-gray-400");
		});
	});

	describe("textarea focus / blur border", () => {
		it("sets border to the category color on focus", () => {
			render(<FeedbackMessageStep {...defaultProps} status="idle" selectedCat={CATEGORIES[0]} />);
			const textarea = screen.getByRole("textbox");
			fireEvent.focus(textarea);
			// CATEGORIES[0] (bug) color = #f87171 → rgb(248, 113, 113)
			expect(textarea.style.borderColor).toBe("rgb(248, 113, 113)");
		});

		it("resets border to default on blur when status is idle", () => {
			render(<FeedbackMessageStep {...defaultProps} status="idle" />);
			const textarea = screen.getByRole("textbox");
			fireEvent.focus(textarea);
			fireEvent.blur(textarea);
			// #2d3748 → rgb(45, 55, 72)
			expect(textarea.style.borderColor).toBe("rgb(45, 55, 72)");
		});

		it("keeps error border color on blur when status is error", () => {
			render(<FeedbackMessageStep {...defaultProps} status="error" />);
			const textarea = screen.getByRole("textbox");
			fireEvent.focus(textarea);
			fireEvent.blur(textarea);
			// #f87171 → rgb(248, 113, 113)
			expect(textarea.style.borderColor).toBe("rgb(248, 113, 113)");
		});
	});
});
