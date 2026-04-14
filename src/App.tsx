import { domAnimation, LazyMotion } from "framer-motion";
import QRCodeStyling from "qr-code-styling";
import { lazy, Suspense, useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ContentInput } from "@/components/ContentInput";
import { CustomizationPanel } from "@/components/CustomizationPanel";
import { DownloadPanel } from "@/components/DownloadPanel";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { QRPreview } from "@/components/QRPreview";
import { useQRConfig } from "@/hooks/useQRConfig";
import { isConfigEmpty } from "@/lib/qrContent";
import type { ContentType, EmailConfig, WifiConfig } from "@/types/qr";

const AccordionFAQ = lazy(() =>
	import("@/components/AccordionFAQ").then((m) => ({ default: m.AccordionFAQ }))
);
const FeedbackWidget = lazy(() =>
	import("@/components/feedback/FeedbackWidget").then((m) => ({ default: m.FeedbackWidget }))
);

type Panel = "customize" | "download";

function App() {
	const { t } = useTranslation();
	const { config, update, reset } = useQRConfig();
	const [activePanel, setActivePanel] = useState<Panel>("customize");
	const qrInstanceRef = useRef<QRCodeStyling | null>(null);
	const isEmpty = isConfigEmpty(config);

	const handleTextChange = useCallback((value: string) => update("text", value), [update]);
	const handleContentTypeChange = useCallback(
		(type: ContentType) => update("contentType", type),
		[update]
	);
	const handleWifiChange = useCallback((wifi: WifiConfig) => update("wifi", wifi), [update]);
	const handleEmailChange = useCallback((email: EmailConfig) => update("email", email), [update]);

	return (
		<div className="min-h-dvh bg-background text-gray-100 font-sans">
			<Header />

			{/* Hero */}
			<div className="text-center px-6 pt-10 pb-6 max-w-3xl mx-auto">
				<h1
					className="font-extrabold tracking-tighter leading-[1.15] mb-3"
					style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)" }}
				>
					{t("hero.title")}
				</h1>
				<div className="inline-flex items-center gap-1.5 bg-[rgba(6,182,212,0.1)] border border-[rgba(6,182,212,0.25)] rounded-full px-3.5 py-1 mb-4 text-xs text-primary-light">
					🔒 {t("hero.badge")}
				</div>
				<p className="text-gray-300 text-[15px] leading-relaxed">{t("hero.subtitle")}</p>
				{/* Pills */}
				<div className="flex flex-wrap gap-2 justify-center mt-5">
					{(
						[
							"customColors",
							"logoEmbedding",
							"dotStyles",
							"multipleFormats",
							"private",
							"realtime"
						] as const
					).map((pill) => (
						<span
							key={pill}
							className="bg-surface-raised border border-border rounded-full text-gray-300 text-xs px-3 py-1"
						>
							{t(`hero.pills.${pill}`)}
						</span>
					))}
				</div>
			</div>

			{/* Main two-column layout */}
			<main className="qrv-main-grid max-w-4xl mx-auto px-4 pb-12">
				{/* Left column: input + panel */}
				<div className="flex flex-col gap-4">
					{/* Content input */}
					<section className="bg-surface border border-border rounded-xl p-5">
						<ContentInput
							config={config}
							onTextChange={handleTextChange}
							onContentTypeChange={handleContentTypeChange}
							onWifiChange={handleWifiChange}
							onEmailChange={handleEmailChange}
						/>
					</section>

					{/* Customize / Download panel */}
					<section className="bg-surface border border-border rounded-xl overflow-hidden">
						{/* Tab switcher */}
						<div className="flex gap-1 p-2 border-b border-border">
							<button
								type="button"
								onClick={() => setActivePanel("customize")}
								className={`flex-1 py-2 rounded text-[13px] border-none cursor-pointer transition-colors duration-150 ${
									activePanel === "customize"
										? "bg-surface-raised text-gray-100 font-semibold"
										: "bg-transparent text-gray-400 font-normal"
								}`}
							>
								{t("customization.title")}
							</button>
							<button
								type="button"
								onClick={() => setActivePanel("download")}
								className={`flex-1 py-2 rounded text-[13px] border-none cursor-pointer transition-colors duration-150 ${
									activePanel === "download"
										? "bg-surface-raised text-gray-100 font-semibold"
										: "bg-transparent text-gray-400 font-normal"
								}`}
							>
								{t("download.title")} / {t("share.title")}
							</button>
						</div>

						<div className="p-5">
							{activePanel === "customize" ? (
								<CustomizationPanel config={config} onUpdate={update} />
							) : (
								<DownloadPanel qrInstance={qrInstanceRef} disabled={isEmpty} />
							)}
						</div>
					</section>
				</div>

				{/* Right column: QR preview (sticky on desktop, top on mobile) */}
				<aside className="qrv-preview-col sticky top-6 bg-surface border border-border rounded-xl p-6 flex flex-col items-center gap-4 min-w-fit">
					<p className="text-primary-light text-xs uppercase tracking-[0.08em] font-semibold">
						{t("brand.name")}
					</p>
					<QRPreview config={config} instanceRef={qrInstanceRef} />
					{/* Reset — destructive action, placed below the QR output where it's clearly secondary */}
					<div className="w-full pt-2 border-t border-border">
						<button
							type="button"
							onClick={reset}
							className="w-full py-2 rounded-lg text-[13px] cursor-pointer font-medium transition-colors duration-150"
							style={{
								background: "rgba(248,113,113,0.08)",
								border: "1px solid rgba(248,113,113,0.3)",
								color: "#f87171"
							}}
						>
							{t("action.reset")}
						</button>
					</div>
				</aside>
			</main>

			{/* FAQ section */}
			<div className="max-w-4xl mx-auto px-4 border-t border-border">
				<AccordionFAQ />
			</div>

			<FeedbackWidget />

			<Footer />
		</div>
	);
}

export default function Root() {
	return (
		<LazyMotion features={domAnimation}>
			<Suspense fallback={null}>
				<App />
			</Suspense>
		</LazyMotion>
	);
}
