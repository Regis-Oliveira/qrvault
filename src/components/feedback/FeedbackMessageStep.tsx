import { AnimatePresence, m } from "framer-motion";
import { Camera, Send, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { CategoryConfig, Status } from "./types";

interface Props {
	message: string;
	onMessageChange: (msg: string) => void;
	status: Status;
	errorMsg: string;
	selectedCat: CategoryConfig | undefined;
	placeholder: string;
	remaining: number;
	canSubmit: boolean;
	onSubmit: (e: React.FormEvent) => void;
	screenshot: string | null;
	onScreenshotRequest: () => void;
	onScreenshotRemove: () => void;
}

export function FeedbackMessageStep({
	message,
	onMessageChange,
	status,
	errorMsg,
	selectedCat,
	placeholder,
	remaining,
	canSubmit,
	onSubmit,
	screenshot,
	onScreenshotRequest,
	onScreenshotRemove
}: Props) {
	const { t } = useTranslation();
	const isSending = status === "sending";

	return (
		<AnimatePresence mode="wait">
			<m.div
				key="message-step"
				initial={{ opacity: 0, x: 10 }}
				animate={{ opacity: 1, x: 0 }}
				exit={{ opacity: 0, x: 10 }}
				transition={{ duration: 0.15 }}
			>
				<form onSubmit={onSubmit}>
					<textarea
						value={message}
						onChange={(e) => onMessageChange(e.target.value)}
						placeholder={placeholder}
						aria-label={placeholder}
						aria-describedby="feedback-counter feedback-error"
						maxLength={1000}
						rows={4}
						autoFocus
						className="w-full bg-background rounded-lg px-3 py-2.5 text-gray-100 text-[13px] resize-none outline-none [font-family:inherit] leading-normal box-border transition-colors duration-150"
						style={{
							border: `1px solid ${status === "error" ? "#f87171" : "#2d3748"}`
						}}
						onFocus={(e) => (e.currentTarget.style.borderColor = selectedCat?.color ?? "#06b6d4")}
						onBlur={(e) =>
							(e.currentTarget.style.borderColor = status === "error" ? "#f87171" : "#2d3748")
						}
						disabled={isSending}
					/>

					{/* Screenshot row */}
					<div className="flex items-center gap-2 mt-2">
						{screenshot ? (
							/* Thumbnail + remove */
							<div className="relative shrink-0 rounded-[6px] overflow-hidden border border-border [line-height:0]">
								<img
									src={screenshot}
									alt={t("feedback.screenshotPreviewAlt")}
									className="block w-14 h-10 object-cover"
								/>
								<button
									type="button"
									onClick={onScreenshotRemove}
									disabled={isSending}
									aria-label={t("feedback.removeScreenshot")}
									className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full border-none bg-[rgba(0,0,0,0.72)] text-gray-100 cursor-pointer flex items-center justify-center p-0"
								>
									<X size={9} aria-hidden="true" />
								</button>
							</div>
						) : (
							/* Add screenshot button */
							<button
								type="button"
								onClick={onScreenshotRequest}
								disabled={isSending}
								title={t("feedback.addScreenshot")}
								className={`flex items-center gap-[5px] px-2.5 py-[5px] rounded-[6px] border border-border bg-transparent text-gray-400 text-[11px] shrink-0 transition-colors duration-150 ${
									isSending
										? "cursor-not-allowed"
										: "cursor-pointer hover:border-primary hover:text-primary"
								}`}
							>
								<Camera size={12} aria-hidden="true" />
								{t("feedback.addScreenshot")}
							</button>
						)}

						{/* Spacer then error + counter */}
						<div className="flex-1 flex justify-between items-center min-w-0">
							<span
								id="feedback-error"
								role="alert"
								aria-live="assertive"
								className="text-error text-[11px]"
							>
								{status === "error" ? errorMsg : ""}
							</span>
							<span
								id="feedback-counter"
								aria-live="polite"
								aria-atomic="true"
								className={`text-[11px] ml-auto shrink-0 ${remaining < 50 ? "text-error" : "text-gray-400"}`}
							>
								{t("a11y.feedbackCharCount", {
									remaining: String(remaining)
								})}
							</span>
						</div>
					</div>

					<button
						type="submit"
						disabled={!canSubmit}
						className={`mt-3 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg border-none text-[13px] font-semibold transition-all duration-150 ${
							canSubmit
								? "text-white cursor-pointer"
								: "text-gray-500 cursor-not-allowed bg-surface-raised"
						}`}
						style={
							canSubmit
								? {
										background: `linear-gradient(135deg, ${selectedCat?.color ?? "#06b6d4"}, #0891b2)`
									}
								: undefined
						}
					>
						{isSending ? (
							<>
								<m.span
									animate={{ rotate: 360 }}
									transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
									className="flex"
									aria-hidden="true"
								>
									<Send size={13} />
								</m.span>
								{t("feedback.sending")}
							</>
						) : (
							<>
								<Send size={13} aria-hidden="true" />
								{t("feedback.send")}
							</>
						)}
					</button>
				</form>
			</m.div>
		</AnimatePresence>
	);
}
