import { ChevronLeft, MessageSquare, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { CategoryConfig, Step } from "./types";

interface Props {
	step: Step;
	selectedCat: CategoryConfig | undefined;
	onBack: () => void;
	onClose: () => void;
}

export function FeedbackHeader({ step, selectedCat, onBack, onClose }: Props) {
	const { t } = useTranslation();
	return (
		<div className="flex items-center justify-between px-4 py-[14px] border-b border-border bg-surface-raised">
			<div className="flex items-center gap-2">
				{step === "message" && (
					<button
						type="button"
						onClick={onBack}
						aria-label={t("feedback.back")}
						className="bg-transparent border-none text-gray-400 cursor-pointer pr-0 pl-0 py-0.5 flex items-center"
					>
						<ChevronLeft size={15} aria-hidden="true" />
					</button>
				)}
				{selectedCat && step === "message" ? (
					<span className="flex" style={{ color: selectedCat.color }}>
						<selectedCat.Icon size={15} />
					</span>
				) : (
					<MessageSquare size={15} className="text-primary" aria-hidden="true" />
				)}
				<span className="text-gray-100 text-[13px] font-semibold">{t("feedback.title")}</span>
			</div>
			<button
				type="button"
				onClick={onClose}
				aria-label={t("feedback.close")}
				className="bg-transparent border-none text-gray-400 cursor-pointer p-1 flex items-center"
			>
				<X size={15} aria-hidden="true" />
			</button>
		</div>
	);
}
