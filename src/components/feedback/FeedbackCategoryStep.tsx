import { AnimatePresence, m } from "framer-motion";
import { useTranslation } from "react-i18next";
import { CATEGORIES, type Category } from "./types";

interface Props {
	onSelect: (cat: Category) => void;
}

export function FeedbackCategoryStep({ onSelect }: Props) {
	const { t } = useTranslation();
	return (
		<AnimatePresence mode="wait">
			<m.div
				key="category-step"
				initial={{ opacity: 0, x: -10 }}
				animate={{ opacity: 1, x: 0 }}
				exit={{ opacity: 0, x: -10 }}
				transition={{ duration: 0.15 }}
			>
				<p className="text-gray-300 text-[12px] mb-3 leading-normal">
					{t("feedback.chooseCategory")}
				</p>
				<div className="flex flex-col gap-2">
					{CATEGORIES.map((cat) => (
						<button
							key={cat.id}
							type="button"
							onClick={() => onSelect(cat.id)}
							className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] cursor-pointer text-left transition-opacity duration-150 hover:opacity-80"
							style={{
								border: `1px solid ${cat.border}`,
								background: cat.bg
							}}
						>
							<span className="flex shrink-0" style={{ color: cat.color }}>
								<cat.Icon size={18} />
							</span>
							<span>
								<span className="block text-gray-100 text-[13px] font-semibold">
									{t(
										`feedback.category${cat.id.charAt(0).toUpperCase() + cat.id.slice(1)}` as never
									)}
								</span>
								<span className="block text-gray-400 text-[11px] mt-px">
									{t(
										`feedback.category${cat.id.charAt(0).toUpperCase() + cat.id.slice(1)}Desc` as never
									)}
								</span>
							</span>
						</button>
					))}
				</div>
			</m.div>
		</AnimatePresence>
	);
}
