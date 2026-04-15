import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import QRCodeStyling from "qr-code-styling";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { blobToDataUrl, dataUrlToBlob, loadAllQRs } from "@/lib/qrStorage";
import type { QRConfig, SavedQRMeta } from "@/types/qr";

/** Content-type → suggested default category */
const CONTENT_TYPE_CATEGORY: Record<string, string> = {
	url: "URL",
	text: "Text",
	email: "Email",
	wifi: "WiFi"
};

/** Built-in category suggestions (always shown in select). */
const DEFAULT_CATEGORIES = ["URL", "Text", "Email", "WiFi"];

const CUSTOM_VALUE = "__custom__";

interface EditMeta {
	id: string;
	title: string;
	description: string;
	category: string;
}

interface Props {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	qrInstance: React.RefObject<QRCodeStyling | null>;
	config: QRConfig;
	editMeta?: EditMeta;
	onSaved: (isUpdate: boolean) => void;
}

export function SaveQRDialog({ open, onOpenChange, qrInstance, config, editMeta, onSaved }: Props) {
	const { t } = useTranslation();

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState("");
	const [selectValue, setSelectValue] = useState("");
	const [customCategory, setCustomCategory] = useState("");
	const [saving, setSaving] = useState(false);
	const [titleError, setTitleError] = useState(false);
	const [userCategories, setUserCategories] = useState<string[]>([]);
	const [dialogEl, setDialogEl] = useState<HTMLDivElement | null>(null);
	const dialogRefCallback = useCallback((node: HTMLDivElement | null) => setDialogEl(node), []);

	// Seed form when dialog opens
	useEffect(() => {
		if (!open) return;
		let initialCategory: string;
		if (editMeta) {
			setTitle(editMeta.title);
			setDescription(editMeta.description);
			initialCategory = editMeta.category;
		} else {
			setTitle("");
			setDescription("");
			initialCategory = CONTENT_TYPE_CATEGORY[config.contentType] ?? "";
		}
		setCategory(initialCategory);
		setCustomCategory("");
		setTitleError(false);

		// Load user-created categories for select options
		loadAllQRs()
			.then((all) => {
				const unique = [...new Set(all.map((i) => i.category).filter((c) => c.length > 0))].sort();
				setUserCategories(unique);
				// Determine initial select value after categories are known
				const allCats = [...new Set([...DEFAULT_CATEGORIES, ...unique])];
				if (allCats.includes(initialCategory)) {
					setSelectValue(initialCategory);
				} else if (initialCategory) {
					setSelectValue(CUSTOM_VALUE);
					setCustomCategory(initialCategory);
				} else {
					setSelectValue("");
				}
			})
			.catch(() => {
				// category loading is best-effort; seed select from defaults only
				if (DEFAULT_CATEGORIES.includes(initialCategory)) {
					setSelectValue(initialCategory);
				} else if (initialCategory) {
					setSelectValue(CUSTOM_VALUE);
					setCustomCategory(initialCategory);
				} else {
					setSelectValue("");
				}
			});
	}, [open, editMeta, config.contentType]);

	const titleRef = useRef<HTMLInputElement>(null);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const trimmedTitle = title.trim();
		if (!trimmedTitle) {
			setTitleError(true);
			titleRef.current?.focus();
			return;
		}

		const resolvedCategory =
			selectValue === CUSTOM_VALUE ? customCategory.trim() : (selectValue || category).trim();

		setSaving(true);
		try {
			// Generate thumbnail from current QR instance (with timeout to prevent hang)
			let thumbnailDataUrl = "";
			if (qrInstance.current) {
				try {
					const raw = await Promise.race([
						qrInstance.current.getRawData("png"),
						new Promise<null>((resolve) => setTimeout(() => resolve(null), 4000))
					]);
					if (raw instanceof Blob) {
						thumbnailDataUrl = await blobToDataUrl(raw);
					} else if (typeof raw === "string") {
						thumbnailDataUrl = raw;
					}
				} catch {
					// thumbnail is best-effort
				}
			}

			// Extract logo blob from config (stored separately from metadata)
			let logoBlob: Blob | undefined;
			if (config.logoDataUrl) {
				if (config.logoDataUrl.startsWith("data:")) {
					logoBlob = dataUrlToBlob(config.logoDataUrl);
				} else if (config.logoDataUrl.startsWith("blob:")) {
					try {
						const resp = await fetch(config.logoDataUrl);
						logoBlob = await resp.blob();
					} catch {
						// logo fetch failed — proceed without logo
					}
				}
			}

			// Strip logoDataUrl from config before persisting to metadata store
			const { logoDataUrl: _logo, ...configWithoutLogo } = config;

			const now = Date.now();
			const id = editMeta?.id ?? crypto.randomUUID();

			const meta: SavedQRMeta = {
				id,
				title: trimmedTitle,
				description: description.trim(),
				category: resolvedCategory,
				config: configWithoutLogo,
				thumbnailDataUrl,
				createdAt: editMeta ? ((await getCreatedAt(id)) ?? now) : now,
				updatedAt: now
			};

			// Dynamically import to avoid circular deps in tests
			const { saveQR, updateQR } = await import("@/lib/qrStorage");
			if (editMeta) {
				await updateQR(meta, logoBlob);
			} else {
				await saveQR(meta, logoBlob);
			}

			onSaved(!!editMeta);
			onOpenChange(false);
		} finally {
			setSaving(false);
		}
	}

	// Merge default + user categories for Select options, deduplicated
	const allCategories = [...new Set([...DEFAULT_CATEGORIES, ...userCategories])].sort();

	const inputStyle: React.CSSProperties = {
		background: "#0d1117",
		border: "1px solid #2d3748",
		borderRadius: "8px",
		color: "#e2e8f0",
		padding: "8px 12px",
		fontSize: "14px",
		width: "100%",
		outline: "none"
	};

	const labelStyle: React.CSSProperties = {
		fontSize: "12px",
		color: "#a0aec0",
		marginBottom: "6px",
		display: "block"
	};

	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Portal>
				<Dialog.Overlay
					className="fixed inset-0 z-50"
					style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
				/>
				<Dialog.Content
					ref={dialogRefCallback}
					className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl p-6 shadow-2xl"
					style={{ background: "#0d1117", border: "1px solid #2d3748" }}
					aria-describedby={undefined}
				>
					<Dialog.Title className="text-base font-semibold mb-5" style={{ color: "#e2e8f0" }}>
						{editMeta ? t("save.dialogEdit") : t("save.dialogTitle")}
					</Dialog.Title>

					<form onSubmit={handleSubmit} noValidate>
						<div className="flex flex-col gap-4">
							{/* Title */}
							<div>
								<label htmlFor="qr-save-title" style={labelStyle}>
									{t("save.titleLabel")}
									<span style={{ color: "#f87171" }}> *</span>
								</label>
								<input
									ref={titleRef}
									id="qr-save-title"
									type="text"
									value={title}
									onChange={(e) => {
										setTitle(e.target.value);
										if (titleError) setTitleError(false);
									}}
									placeholder={t("save.titlePlaceholder")}
									maxLength={80}
									style={{
										...inputStyle,
										borderColor: titleError ? "#f87171" : "#2d3748"
									}}
									autoComplete="off"
								/>
								{titleError && (
									<p className="mt-1 text-xs" style={{ color: "#f87171" }}>
										{t("save.titleRequired")}
									</p>
								)}
							</div>

							{/* Category */}
							<div>
								<label style={labelStyle}>{t("save.categoryLabel")}</label>
								<Select.Root
									value={selectValue}
									onValueChange={(val) => {
										setSelectValue(val);
										if (val !== CUSTOM_VALUE) setCustomCategory("");
									}}
								>
									<Select.Trigger
										style={{
											...inputStyle,
											display: "flex",
											alignItems: "center",
											justifyContent: "space-between",
											cursor: "pointer"
										}}
									>
										<Select.Value placeholder={t("save.categoryPlaceholder")} />
										<Select.Icon>
											<ChevronDown size={14} color="#a0aec0" />
										</Select.Icon>
									</Select.Trigger>
									<Select.Portal container={dialogEl ?? undefined}>
										<Select.Content
											position="popper"
											sideOffset={4}
											style={{
												background: "#161b22",
												border: "1px solid #2d3748",
												borderRadius: "8px",
												padding: "4px",
												zIndex: 200,
												minWidth: "var(--radix-select-trigger-width)",
												maxHeight: "240px",
												overflowY: "auto"
											}}
										>
											<Select.Viewport>
												{allCategories.map((c) => (
													<Select.Item
														key={c}
														value={c}
														style={{
															display: "flex",
															alignItems: "center",
															gap: "8px",
															padding: "8px 12px",
															borderRadius: "6px",
															fontSize: "14px",
															color: "#e2e8f0",
															cursor: "pointer",
															outline: "none"
														}}
														className="hover:bg-surface-raised focus:bg-surface-raised"
													>
														<Select.ItemText>{c}</Select.ItemText>
														<Select.ItemIndicator style={{ marginLeft: "auto" }}>
															<Check size={12} color="#06b6d4" />
														</Select.ItemIndicator>
													</Select.Item>
												))}
												<Select.Item
													value={CUSTOM_VALUE}
													style={{
														display: "flex",
														alignItems: "center",
														gap: "8px",
														padding: "8px 12px",
														borderRadius: "6px",
														fontSize: "14px",
														color: "#06b6d4",
														cursor: "pointer",
														outline: "none",
														borderTop: "1px solid #2d3748",
														marginTop: "4px"
													}}
													className="hover:bg-surface-raised focus:bg-surface-raised"
												>
													<Select.ItemText>{t("save.categoryCustom")}</Select.ItemText>
													<Select.ItemIndicator style={{ marginLeft: "auto" }}>
														<Check size={12} color="#06b6d4" />
													</Select.ItemIndicator>
												</Select.Item>
											</Select.Viewport>
										</Select.Content>
									</Select.Portal>
								</Select.Root>
								{selectValue === CUSTOM_VALUE && (
									<input
										type="text"
										value={customCategory}
										onChange={(e) => setCustomCategory(e.target.value)}
										placeholder={t("save.categoryCustomPlaceholder")}
										maxLength={40}
										style={{ ...inputStyle, marginTop: "8px" }}
										autoComplete="off"
										// eslint-disable-next-line jsx-a11y/no-autofocus
										autoFocus
									/>
								)}
							</div>

							{/* Description */}
							<div>
								<label htmlFor="qr-save-description" style={labelStyle}>
									{t("save.descLabel")}
								</label>
								<textarea
									id="qr-save-description"
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									placeholder={t("save.descPlaceholder")}
									maxLength={200}
									rows={3}
									style={{
										...inputStyle,
										resize: "vertical",
										fontFamily: "inherit",
										minHeight: "72px"
									}}
								/>
							</div>
						</div>

						{/* Actions */}
						<div className="flex gap-2 mt-6 justify-end">
							<Dialog.Close asChild>
								<button
									type="button"
									className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-opacity hover:opacity-80"
									style={{
										background: "transparent",
										border: "1px solid #2d3748",
										color: "#a0aec0"
									}}
								>
									{t("save.cancel")}
								</button>
							</Dialog.Close>
							<button
								type="submit"
								disabled={saving}
								className="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
								style={{ background: "#06b6d4", color: "#07080d" }}
							>
								{saving ? "…" : editMeta ? t("save.update") : t("save.save")}
							</button>
						</div>
					</form>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

/** Fetch the existing createdAt timestamp for a QR being updated. */
async function getCreatedAt(id: string): Promise<number | undefined> {
	try {
		const { loadAllQRs } = await import("@/lib/qrStorage");
		const all = await loadAllQRs();
		return all.find((i) => i.id === id)?.createdAt;
	} catch {
		return undefined;
	}
}
