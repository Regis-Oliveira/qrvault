import QRCodeStyling from "qr-code-styling";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { DownloadFormat } from "@/types/qr";

interface Props {
	qrInstance: React.RefObject<QRCodeStyling | null>;
	disabled: boolean;
}

const FORMATS: {
	format: DownloadFormat;
	labelKey: "download.png" | "download.svg" | "download.jpg";
	a11yKey: "a11y.downloadPng" | "a11y.downloadSvg" | "a11y.downloadJpg";
}[] = [
	{ format: "png", labelKey: "download.png", a11yKey: "a11y.downloadPng" },
	{ format: "svg", labelKey: "download.svg", a11yKey: "a11y.downloadSvg" },
	{ format: "jpeg", labelKey: "download.jpg", a11yKey: "a11y.downloadJpg" }
];

export function DownloadPanel({ qrInstance, disabled }: Props) {
	const { t } = useTranslation();
	const [downloading, setDownloading] = useState<DownloadFormat | null>(null);
	const [copied, setCopied] = useState(false);
	const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleDownload = useCallback(
		async (format: DownloadFormat) => {
			if (!qrInstance.current || disabled) return;
			setDownloading(format);
			try {
				await qrInstance.current.download({ name: "qrvault-qr", extension: format });
			} finally {
				setDownloading(null);
			}
		},
		[qrInstance, disabled]
	);

	const handleShareWhatsApp = useCallback(() => {
		const url = window.location.href;
		window.open(`https://wa.me/?text=${encodeURIComponent(url)}`, "_blank", "noopener,noreferrer");
	}, []);

	const handleCopyLink = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(window.location.href);
			setCopied(true);
			if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
			copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
		} catch {
			// clipboard not available
		}
	}, []);

	const btnBase = `flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
		disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer"
	}`;

	return (
		<div className="flex flex-col gap-4">
			{/* Download */}
			<div>
				<p className="text-gray-300 text-xs mb-2 uppercase tracking-[0.05em]">
					{t("download.title")}
				</p>
				<div className="flex gap-2 flex-wrap">
					{FORMATS.map(({ format, labelKey, a11yKey }) => (
						<button
							key={format}
							type="button"
							disabled={disabled || downloading !== null}
							onClick={() => handleDownload(format)}
							aria-label={t(a11yKey)}
							className={`${btnBase} bg-surface-raised border border-border flex-1 min-w-20 ${
								downloading === format ? "text-gray-400" : "text-gray-100"
							}`}
						>
							{downloading === format ? "…" : t(labelKey)}
						</button>
					))}
				</div>
			</div>

			{/* Share */}
			<div>
				<p className="text-gray-300 text-xs mb-2 uppercase tracking-[0.05em]">{t("share.title")}</p>
				<div className="flex gap-2 flex-wrap">
					<button
						type="button"
						onClick={handleShareWhatsApp}
						aria-label={t("a11y.shareWhatsapp")}
						className={`${btnBase} flex-1`}
						style={{ backgroundColor: "#25d366", color: "#fff" }}
					>
						{t("share.whatsapp")}
					</button>
					<button
						type="button"
						onClick={handleCopyLink}
						aria-label={t("a11y.copyLink")}
						className={`${btnBase} bg-surface-raised flex-1 border ${
							copied ? "border-success text-success" : "border-border text-gray-100"
						}`}
					>
						{copied ? t("share.copied") : t("share.copy")}
					</button>
				</div>
			</div>
		</div>
	);
}
