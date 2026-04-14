import { FocusScope } from "@radix-ui/react-focus-scope";
import { AnimatePresence, m } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FeedbackCategoryStep } from "./FeedbackCategoryStep";
import { FeedbackHeader } from "./FeedbackHeader";
import { FeedbackMessageStep } from "./FeedbackMessageStep";
import { FeedbackSuccessView } from "./FeedbackSuccessView";
import { FeedbackTriggerButton } from "./FeedbackTriggerButton";
import { ScreenshotPicker } from "./ScreenshotPicker";
import { CATEGORIES, type Category, MAX_CHARS, type Status, type Step } from "./types";

export function FeedbackWidget() {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);
	const [step, setStep] = useState<Step>("category");
	const [category, setCategory] = useState<Category | null>(null);
	const [message, setMessage] = useState("");
	const [status, setStatus] = useState<Status>("idle");
	const [errorMsg, setErrorMsg] = useState("");
	const [screenshot, setScreenshot] = useState<string | null>(null);
	const [pickerActive, setPickerActive] = useState(false);

	const remaining = MAX_CHARS - message.length;
	const canSubmit = message.trim().length > 0 && remaining >= 0 && status !== "sending";

	const placeholder = category
		? t(`feedback.placeholder${category.charAt(0).toUpperCase() + category.slice(1)}` as never)
		: t("feedback.placeholder");

	const handleSelectCategory = (cat: Category) => {
		setCategory(cat);
		setStep("message");
	};

	const handleBack = () => {
		setStep("category");
		setMessage("");
		setStatus("idle");
		setErrorMsg("");
		setScreenshot(null);
	};

	const handleMessageChange = (msg: string) => {
		setMessage(msg);
		if (status === "error") setStatus("idle");
	};

	const handleScreenshotRequest = () => {
		setPickerActive(true);
	};

	const handlePickerCapture = (dataUrl: string) => {
		setScreenshot(dataUrl);
		setPickerActive(false);
	};

	const handlePickerCancel = () => {
		setPickerActive(false);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!canSubmit || !category) return;

		setStatus("sending");
		setErrorMsg("");

		try {
			const res = await fetch("/api/feedback", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					message: message.trim(),
					category,
					screenshot: screenshot ?? undefined
				})
			});

			let data: { error?: string } = {};
			try {
				data = await res.json();
			} catch {
				// non-JSON body — treat as generic error
			}

			if (!res.ok) {
				throw new Error(data.error ?? t("feedback.errorGeneric"));
			}

			setStatus("success");
			setMessage("");
			setScreenshot(null);
			setTimeout(() => {
				setStatus("idle");
				setOpen(false);
			}, 3000);
		} catch (err) {
			setStatus("error");
			setErrorMsg(err instanceof Error ? err.message : t("feedback.errorGeneric"));
		}
	};

	const handleClose = () => {
		setOpen(false);
		setTimeout(() => {
			setStep("category");
			setCategory(null);
			setMessage("");
			setStatus("idle");
			setErrorMsg("");
			setScreenshot(null);
		}, 300);
	};

	const selectedCat = CATEGORIES.find((c) => c.id === category);

	return (
		<>
			{/* Screenshot picker renders as a portal — lives outside the widget div */}
			{pickerActive && (
				<ScreenshotPicker onCapture={handlePickerCapture} onCancel={handlePickerCancel} />
			)}

			<div className={`fixed bottom-6 left-6 z-40 ${pickerActive ? "invisible" : "visible"}`}>
				{/* Panel */}
				<AnimatePresence>
					{open && (
						<m.div
							key="panel"
							id="feedback-panel"
							initial={{ opacity: 0, scale: 0.92, y: 8 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.92, y: 8 }}
							transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
							className="absolute bottom-15 left-0 w-75 bg-surface border border-border rounded-2xl overflow-hidden"
							style={{
								boxShadow: "0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(6,182,212,0.1)"
							}}
						>
							<FocusScope
								trapped={!pickerActive}
								loop
								style={{ display: "contents" }}
								role="dialog"
								aria-modal="true"
								aria-label={t("feedback.title")}
							>
								<FeedbackHeader
									step={step}
									selectedCat={selectedCat}
									onBack={handleBack}
									onClose={handleClose}
								/>

								<div className="p-4">
									{status === "success" ? (
										<FeedbackSuccessView />
									) : step === "category" ? (
										<FeedbackCategoryStep onSelect={handleSelectCategory} />
									) : (
										<FeedbackMessageStep
											message={message}
											onMessageChange={handleMessageChange}
											status={status}
											errorMsg={errorMsg}
											selectedCat={selectedCat}
											placeholder={placeholder}
											remaining={remaining}
											canSubmit={canSubmit}
											onSubmit={handleSubmit}
											screenshot={screenshot}
											onScreenshotRequest={handleScreenshotRequest}
											onScreenshotRemove={() => setScreenshot(null)}
										/>
									)}
								</div>
							</FocusScope>
						</m.div>
					)}
				</AnimatePresence>

				<FeedbackTriggerButton open={open} onClick={() => (open ? handleClose() : setOpen(true))} />
			</div>
		</>
	);
}
