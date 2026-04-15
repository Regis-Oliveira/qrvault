import QRCodeStyling from "qr-code-styling";
import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { SaveQRDialog } from "@/components/SaveQRDialog";
import { buildQRData } from "@/lib/qrContent";
import type { DownloadFormat, QRConfig } from "@/types/qr";

interface EditMeta {
	id: string;
	title: string;
	description: string;
	category: string;
}

interface Props {
	qrInstance: React.RefObject<QRCodeStyling | null>;
	disabled: boolean;
	config: QRConfig;
	editMeta?: EditMeta;
	onSaved?: () => void;
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

export function DownloadPanel({ qrInstance, disabled, config, editMeta, onSaved }: Props) {
	const { t } = useTranslation();
	const [downloading, setDownloading] = useState<DownloadFormat | null>(null);
	const [downloaded, setDownloaded] = useState<DownloadFormat | null>(null);
	const [copied, setCopied] = useState(false);
	const [sharing, setSharing] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [saveState, setSaveState] = useState<"idle" | "saved" | "updated">("idle");

	const canShareImage = useMemo(() => {
		if (typeof navigator === "undefined" || typeof navigator.canShare !== "function") return false;
		try {
			return navigator.canShare({ files: [new File([], "t.png", { type: "image/png" })] });
		} catch {
			return false;
		}
	}, []);

	const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const downloadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleDownload = useCallback(
		async (format: DownloadFormat) => {
			if (!qrInstance.current || disabled) return;
			setDownloading(format);
			try {
				await qrInstance.current.download({ name: "qrvault-qr", extension: format });
				setDownloaded(format);
				if (downloadTimeoutRef.current) clearTimeout(downloadTimeoutRef.current);
				downloadTimeoutRef.current = setTimeout(() => setDownloaded(null), 2000);
			} finally {
				setDownloading(null);
			}
		},
		[qrInstance, disabled]
	);

	const handleShareImage = useCallback(async () => {
		if (!qrInstance.current || disabled) return;
		setSharing(true);
		try {
			const raw = await qrInstance.current.getRawData("png");
			if (!(raw instanceof Blob)) return;
			const file = new File([raw], "qrvault-qr.png", { type: "image/png" });
			await navigator.share({ files: [file], title: "QR Code" });
		} catch {
			// user cancelled or share not supported — no-op
		} finally {
			setSharing(false);
		}
	}, [qrInstance, disabled]);

	const handleCopyContent = useCallback(async () => {
		const content = buildQRData(config);
		if (!content) return;
		try {
			await navigator.clipboard.writeText(content);
			setCopied(true);
			if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
			copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
		} catch {
			// clipboard not available
		}
	}, [config]);

	const handleSaved = useCallback(
		(isUpdate: boolean) => {
			setSaveState(isUpdate ? "updated" : "saved");
			if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
			saveTimeoutRef.current = setTimeout(() => setSaveState("idle"), 2000);
			onSaved?.();
		},
		[onSaved]
	);

	const btnBase = `flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
		disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer"
	}`;

	const saveBtnLabel =
		saveState === "saved"
			? `✓ ${t("save.saved")}`
			: saveState === "updated"
				? `✓ ${t("save.updated")}`
				: editMeta
					? t("save.updateBtn")
					: t("save.button");

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
							className={`${btnBase} bg-surface-raised flex-1 min-w-20 border ${
								downloaded === format
									? "border-success text-success"
									: downloading === format
										? "border-border text-gray-400"
										: "border-border text-gray-100"
							}`}
						>
							{downloading === format
								? "…"
								: downloaded === format
									? `✓ ${t(labelKey)}`
									: t(labelKey)}
						</button>
					))}
				</div>
			</div>

			{/* Save to vault */}
			<div>
				<p className="text-gray-300 text-xs mb-2 uppercase tracking-[0.05em]">
					{t("save.sectionTitle")}
				</p>
				<button
					type="button"
					disabled={disabled}
					onClick={() => setDialogOpen(true)}
					aria-label={editMeta ? t("save.updateBtn") : t("save.button")}
					className={`${btnBase} w-full border ${
						saveState !== "idle"
							? "border-success text-success bg-surface-raised"
							: "bg-surface-raised border-border text-gray-100"
					}`}
					style={
						saveState === "idle" ? { borderColor: "rgba(6,182,212,0.4)", color: "#06b6d4" } : {}
					}
				>
					{saveBtnLabel}
				</button>
			</div>

			{/* Share */}
			<div>
				<p className="text-gray-300 text-xs mb-2 uppercase tracking-[0.05em]">{t("share.title")}</p>
				<div className="flex gap-2 flex-wrap">
					{canShareImage && (
						<button
							type="button"
							disabled={disabled || sharing}
							onClick={handleShareImage}
							aria-label={t("a11y.shareImage")}
							className={`${btnBase} bg-surface-raised flex-1 border border-border text-gray-100`}
						>
							{sharing ? t("share.sharing") : t("share.shareImage")}
						</button>
					)}
					<button
						type="button"
						disabled={disabled}
						onClick={handleCopyContent}
						aria-label={t("a11y.copyContent")}
						className={`${btnBase} bg-surface-raised flex-1 border ${
							copied ? "border-success text-success" : "border-border text-gray-100"
						}`}
					>
						{copied ? t("share.copied") : t("share.copy")}
					</button>
				</div>
			</div>

			<SaveQRDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				qrInstance={qrInstance}
				config={config}
				editMeta={editMeta}
				onSaved={handleSaved}
			/>
		</div>
	);
}
