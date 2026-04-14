import { AnimatePresence, m } from "framer-motion";
import { MessageSquare, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
	open: boolean;
	onClick: () => void;
}

export function FeedbackTriggerButton({ open, onClick }: Props) {
	const { t } = useTranslation();
	return (
		<m.button
			type="button"
			onClick={onClick}
			aria-label={t("feedback.title")}
			aria-expanded={open}
			aria-controls="feedback-panel"
			whileHover={{ scale: 1.08 }}
			whileTap={{ scale: 0.93 }}
			className="w-12 h-12 rounded-full text-white cursor-pointer flex items-center justify-center"
			style={
				open
					? {
							background: "#1a1a2e",
							border: "1.5px solid #06b6d4",
							boxShadow: "0 4px 16px rgba(8,145,178,0.45)"
						}
					: {
							background: "linear-gradient(135deg, #06b6d4, #0891b2)",
							boxShadow: "0 4px 16px rgba(8,145,178,0.45)"
						}
			}
		>
			<AnimatePresence mode="wait" initial={false}>
				{open ? (
					<m.span
						key="close"
						initial={{ rotate: -90, opacity: 0 }}
						animate={{ rotate: 0, opacity: 1 }}
						exit={{ rotate: 90, opacity: 0 }}
						transition={{ duration: 0.15 }}
						className="flex"
					>
						<X size={20} />
					</m.span>
				) : (
					<m.span
						key="open"
						initial={{ rotate: 90, opacity: 0 }}
						animate={{ rotate: 0, opacity: 1 }}
						exit={{ rotate: -90, opacity: 0 }}
						transition={{ duration: 0.15 }}
						className="flex"
					>
						<MessageSquare size={20} />
					</m.span>
				)}
			</AnimatePresence>
		</m.button>
	);
}
