import { m } from "framer-motion";
import {
	ChevronDown,
	FileImage,
	Lock,
	QrCode,
	ScanLine,
	Settings,
	Shield,
	Wifi
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const ICONS = [QrCode, Shield, Settings, Wifi, ScanLine, FileImage, Lock];

export function AccordionFAQ() {
	const { t } = useTranslation();
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	const items = t("faq.items", { returnObjects: true }) as unknown as Array<{
		question: string;
		answer: string;
	}>;

	const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? null : i));

	return (
		<section aria-labelledby="faq-title" className="w-full py-12">
			<div className="w-full max-w-[42rem] mx-auto">
				{/* Header */}
				<div className="text-center mb-10">
					<h2
						id="faq-title"
						className="font-bold mb-3 text-gray-100"
						style={{ fontSize: "clamp(1.25rem, 3vw, 1.75rem)" }}
					>
						{t("faq.title")}
					</h2>
					<p className="text-gray-300 text-[15px] leading-relaxed">{t("faq.subtitle")}</p>
				</div>

				{/* Accordion items */}
				<dl className="flex flex-col gap-3">
					{items.map((item, i) => {
						const Icon = ICONS[i] ?? Shield;
						const isOpen = openIndex === i;

						return (
							<div
								key={i}
								className={`rounded-xl transition-all duration-200 ${
									isOpen
										? "bg-surface-raised border border-primary"
										: "bg-surface border border-border"
								}`}
								style={{
									boxShadow: isOpen ? "0 0 24px rgba(6, 182, 212, 0.1)" : "none"
								}}
							>
								<dt>
									<button
										type="button"
										onClick={() => toggle(i)}
										aria-expanded={isOpen}
										aria-controls={`faq-answer-${i}`}
										id={`faq-question-${i}`}
										className="w-full flex items-center gap-4 px-6 py-[1.125rem] text-left cursor-pointer bg-transparent border-none min-h-14"
									>
										{/* Icon badge */}
										<span
											className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200 ${
												isOpen ? "bg-[rgba(6,182,212,0.18)]" : "bg-[rgba(6,182,212,0.07)]"
											}`}
											aria-hidden="true"
										>
											<Icon size={16} className={isOpen ? "text-primary-light" : "text-gray-400"} />
										</span>

										{/* Question */}
										<span
											className={`flex-1 text-sm font-medium leading-[1.4] ${
												isOpen ? "text-gray-100" : "text-gray-300"
											}`}
										>
											{item.question}
										</span>

										{/* Chevron */}
										<m.span
											animate={{ rotate: isOpen ? 180 : 0 }}
											transition={{ duration: 0.2, ease: "easeInOut" }}
											aria-hidden="true"
											className={`shrink-0 block ${isOpen ? "text-primary" : "text-gray-400"}`}
										>
											<ChevronDown size={18} />
										</m.span>
									</button>
								</dt>

								{/* Framer Motion height:"auto" — no CSS layout transition; compositor handles the clip */}
								<dd
									id={`faq-answer-${i}`}
									aria-labelledby={`faq-question-${i}`}
									style={{ margin: 0 }}
								>
									<m.div
										initial={false}
										animate={{ height: isOpen ? "auto" : 0 }}
										transition={{ duration: 0.25, ease: "easeInOut" }}
										style={{ overflow: "hidden" }}
									>
										<div
											style={{
												opacity: isOpen ? 1 : 0,
												transition: "opacity 0.2s ease-in-out"
											}}
										>
											<div className="h-px bg-border mx-6" />
											<p className="text-gray-300 text-sm leading-[1.7] px-6 pt-[1.125rem] pb-6 pl-[4.75rem]">
												{item.answer}
											</p>
										</div>
									</m.div>
								</dd>
							</div>
						);
					})}
				</dl>
			</div>
		</section>
	);
}
