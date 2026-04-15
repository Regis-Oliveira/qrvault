import { Download, Pencil, Trash2 } from "lucide-react";
import QRCodeStyling from "qr-code-styling";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { StorageBar } from "@/components/StorageBar";
import { useQRVault } from "@/hooks/useQRVault";
import { useStorageQuota } from "@/hooks/useStorageQuota";
import { buildQROptions } from "@/lib/qrOptions";
import { blobToDataUrl, loadLogoBlob } from "@/lib/qrStorage";
import type { DownloadFormat, QRConfig, SavedQRMeta } from "@/types/qr";

const DOWNLOAD_FORMATS: { format: DownloadFormat; label: string }[] = [
	{ format: "png", label: "PNG" },
	{ format: "svg", label: "SVG" },
	{ format: "jpeg", label: "JPG" }
];

export function QRCodesPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { items, loading, remove } = useQRVault();
	const { info: storageInfo } = useStorageQuota();
	const [activeCategory, setActiveCategory] = useState<string>("all");
	const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
	const [downloadingId, setDownloadingId] = useState<string | null>(null);

	// Derive category list from saved items
	const categories = ["all", ...new Set(items.map((i) => i.category).filter(Boolean))].sort(
		(a, b) => (a === "all" ? -1 : b === "all" ? 1 : a.localeCompare(b))
	);

	const visible =
		activeCategory === "all" ? items : items.filter((i) => i.category === activeCategory);

	async function handleDownload(meta: SavedQRMeta, format: DownloadFormat) {
		setDownloadingId(meta.id);
		try {
			const logoUrl = await loadLogoBlob(meta.id);
			const fullConfig: QRConfig = { ...meta.config, logoDataUrl: logoUrl };
			const instance = new QRCodeStyling(buildQROptions(fullConfig));
			await instance.download({
				name: `qrvault-${meta.title.replace(/\s+/g, "-").toLowerCase()}`,
				extension: format
			});
			if (logoUrl) URL.revokeObjectURL(logoUrl);
		} finally {
			setDownloadingId(null);
		}
	}

	async function handleEdit(meta: SavedQRMeta) {
		let logoDataUrl: string | undefined;
		const objectUrl = await loadLogoBlob(meta.id);
		if (objectUrl) {
			try {
				const response = await fetch(objectUrl);
				const blob = await response.blob();
				logoDataUrl = await blobToDataUrl(blob);
			} catch {
				// proceed without logo
			} finally {
				URL.revokeObjectURL(objectUrl);
			}
		}
		const fullConfig: QRConfig = { ...meta.config, logoDataUrl };
		navigate("/", {
			state: {
				editConfig: fullConfig,
				editId: meta.id,
				editTitle: meta.title,
				editDescription: meta.description,
				editCategory: meta.category
			}
		});
	}

	async function handleDelete(id: string) {
		await remove(id);
		setConfirmDeleteId(null);
	}

	return (
		<div className="min-h-dvh bg-background text-gray-100 font-sans flex flex-col">
			<Header />

			<main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
				{/* Page title */}
				<div className="mb-6">
					<h1
						className="font-extrabold tracking-tight mb-1"
						style={{ fontSize: "clamp(1.25rem, 3vw, 1.75rem)", color: "#e2e8f0" }}
					>
						{t("vault.title")}
					</h1>
					<p className="text-sm" style={{ color: "#a0aec0" }}>
						{t("vault.subtitle")}
					</p>
				</div>

				{/* Storage bar */}
				<div className="mb-6">
					<StorageBar storageInfo={storageInfo} />
				</div>

				{loading ? null : items.length === 0 ? (
					/* Empty state */
					<div
						className="flex flex-col items-center justify-center gap-4 rounded-2xl py-20 text-center"
						style={{ border: "1px dashed #2d3748" }}
					>
						<span style={{ fontSize: "3rem" }}>📂</span>
						<div>
							<p className="font-semibold text-sm mb-1" style={{ color: "#e2e8f0" }}>
								{t("vault.empty")}
							</p>
							<p className="text-xs" style={{ color: "#8896a8" }}>
								{t("vault.emptyHint")}
							</p>
						</div>
						<button
							type="button"
							onClick={() => navigate("/")}
							className="mt-2 px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-opacity hover:opacity-80"
							style={{ background: "#06b6d4", color: "#07080d" }}
						>
							{t("vault.createFirst")}
						</button>
					</div>
				) : (
					<>
						{/* Category filter tabs */}
						{categories.length > 1 && (
							<div className="flex gap-2 flex-wrap mb-5">
								{categories.map((cat) => (
									<button
										key={cat}
										type="button"
										onClick={() => setActiveCategory(cat)}
										className="px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all"
										style={{
											background: activeCategory === cat ? "#06b6d4" : "rgba(6,182,212,0.08)",
											color: activeCategory === cat ? "#07080d" : "#06b6d4",
											border: `1px solid ${activeCategory === cat ? "#06b6d4" : "rgba(6,182,212,0.3)"}`
										}}
									>
										{cat === "all" ? t("vault.filterAll") : cat}
									</button>
								))}
							</div>
						)}

						{/* QR card list */}
						<div className="flex flex-col gap-3">
							{visible.map((meta) => (
								<QRCard
									key={meta.id}
									meta={meta}
									isDownloading={downloadingId === meta.id}
									isConfirmingDelete={confirmDeleteId === meta.id}
									onDownload={handleDownload}
									onEdit={handleEdit}
									onDeleteRequest={() => setConfirmDeleteId(meta.id)}
									onDeleteConfirm={() => handleDelete(meta.id)}
									onDeleteCancel={() => setConfirmDeleteId(null)}
								/>
							))}
						</div>
					</>
				)}
			</main>

			<Footer />
		</div>
	);
}

interface QRCardProps {
	meta: SavedQRMeta;
	isDownloading: boolean;
	isConfirmingDelete: boolean;
	onDownload: (meta: SavedQRMeta, format: DownloadFormat) => void;
	onEdit: (meta: SavedQRMeta) => void;
	onDeleteRequest: () => void;
	onDeleteConfirm: () => void;
	onDeleteCancel: () => void;
}

function QRCard({
	meta,
	isDownloading,
	isConfirmingDelete,
	onDownload,
	onEdit,
	onDeleteRequest,
	onDeleteConfirm,
	onDeleteCancel
}: QRCardProps) {
	const { t } = useTranslation();
	const [downloadOpen, setDownloadOpen] = useState(false);

	const date = new Date(meta.createdAt).toLocaleDateString(undefined, {
		year: "numeric",
		month: "short",
		day: "numeric"
	});

	return (
		<div
			className="flex flex-col rounded-xl p-4 gap-3"
			style={{ background: "#0d1117", border: "1px solid #2d3748" }}
		>
			{/* Top row: thumbnail + info + actions */}
			<div className="flex items-start gap-4">
				{/* Thumbnail */}
				<div
					className="shrink-0 rounded-lg overflow-hidden"
					style={{
						width: "72px",
						height: "72px",
						background: meta.thumbnailDataUrl ? "transparent" : "#161b22",
						border: "1px solid #2d3748",
						display: "flex",
						alignItems: "center",
						justifyContent: "center"
					}}
				>
					{meta.thumbnailDataUrl ? (
						<img
							src={meta.thumbnailDataUrl}
							alt={meta.title}
							style={{ width: "100%", height: "100%", objectFit: "cover" }}
						/>
					) : (
						<span style={{ fontSize: "1.5rem" }}>⬛</span>
					)}
				</div>

				{/* Info + actions */}
				<div className="flex-1 min-w-0 flex items-start justify-between gap-2">
					{/* Left: title + category/date */}
					<div className="min-w-0 flex-1">
						<p className="font-semibold text-sm truncate" style={{ color: "#e2e8f0" }}>
							{meta.title}
						</p>
						<div className="flex items-center gap-2 mt-1.5 flex-wrap">
							{meta.category && (
								<span
									className="inline-block text-xs px-2 py-0.5 rounded-full"
									style={{
										background: "rgba(6,182,212,0.1)",
										color: "#06b6d4",
										border: "1px solid rgba(6,182,212,0.2)"
									}}
								>
									{meta.category}
								</span>
							)}
							<span className="text-xs" style={{ color: "#8896a8" }}>
								{date}
							</span>
						</div>
					</div>

					{/* Actions */}
					{isConfirmingDelete ? (
						<div className="flex flex-col items-end gap-1.5 shrink-0">
							<span className="text-xs" style={{ color: "#f87171" }}>
								{t("vault.deleteConfirm")}
							</span>
							<div className="flex gap-1.5 w-full">
								<button
									type="button"
									onClick={onDeleteConfirm}
									className="flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
									style={{
										background: "rgba(248,113,113,0.15)",
										color: "#f87171",
										border: "1px solid rgba(248,113,113,0.3)"
									}}
								>
									{t("vault.confirmYes")}
								</button>
								<button
									type="button"
									onClick={onDeleteCancel}
									className="flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
									style={{
										background: "transparent",
										color: "#a0aec0",
										border: "1px solid #2d3748"
									}}
								>
									{t("vault.confirmNo")}
								</button>
							</div>
						</div>
					) : (
						<div className="flex flex-col gap-1.5 shrink-0">
							{/* Download dropdown */}
							<div className="relative">
								<button
									type="button"
									disabled={isDownloading}
									onClick={() => setDownloadOpen((v) => !v)}
									aria-label={t("vault.downloadBtn")}
									className="w-full flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-opacity hover:opacity-80 disabled:opacity-50"
									style={{ background: "#161b22", color: "#e2e8f0", border: "1px solid #2d3748" }}
								>
									<Download size={11} aria-hidden="true" />
									{isDownloading ? "…" : t("vault.downloadBtn")}
								</button>
								{downloadOpen && (
									<div
										className="absolute right-0 mt-1 rounded-lg overflow-hidden z-20"
										style={{
											background: "#0d1117",
											border: "1px solid #2d3748",
											minWidth: "90px",
											boxShadow: "0 8px 24px rgba(0,0,0,0.5)"
										}}
									>
										{DOWNLOAD_FORMATS.map(({ format, label }) => (
											<button
												key={format}
												type="button"
												onClick={() => {
													setDownloadOpen(false);
													onDownload(meta, format);
												}}
												className="w-full text-left px-3 py-2 text-xs cursor-pointer transition-colors hover:bg-white/5"
												style={{ color: "#e2e8f0" }}
											>
												{label}
											</button>
										))}
									</div>
								)}
							</div>

							{/* Edit + Delete side by side, matching download width */}
							<div className="flex gap-1.5">
								<button
									type="button"
									onClick={() => onEdit(meta)}
									aria-label={t("a11y.editQR", { title: meta.title })}
									className="flex flex-1 items-center justify-center rounded-lg cursor-pointer transition-opacity hover:opacity-80"
									style={{
										height: "32px",
										background: "#161b22",
										color: "#a0aec0",
										border: "1px solid #2d3748"
									}}
								>
									<Pencil size={13} aria-hidden="true" />
								</button>
								<button
									type="button"
									onClick={onDeleteRequest}
									aria-label={t("a11y.deleteQR", { title: meta.title })}
									className="flex flex-1 items-center justify-center rounded-lg cursor-pointer transition-opacity hover:opacity-80"
									style={{
										height: "32px",
										background: "rgba(248,113,113,0.08)",
										color: "#f87171",
										border: "1px solid rgba(248,113,113,0.2)"
									}}
								>
									<Trash2 size={13} aria-hidden="true" />
								</button>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Description: full width below thumbnail + actions row */}
			{meta.description && (
				<p className="text-xs break-words" style={{ color: "#a0aec0" }}>
					{meta.description}
				</p>
			)}
		</div>
	);
}
