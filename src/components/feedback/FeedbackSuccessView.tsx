import { m } from "framer-motion";
import { useTranslation } from "react-i18next";

export function FeedbackSuccessView() {
	const { t } = useTranslation();
	return (
		<m.div
			role="status"
			aria-live="polite"
			initial={{ opacity: 0, y: 6 }}
			animate={{ opacity: 1, y: 0 }}
			className="text-center py-5"
		>
			<p className="text-[28px] mb-2">🎉</p>
			<p className="text-success text-[13px] font-semibold mb-1">{t("feedback.successTitle")}</p>
			<p className="text-gray-400 text-[12px]">{t("feedback.successBody")}</p>
		</m.div>
	);
}
