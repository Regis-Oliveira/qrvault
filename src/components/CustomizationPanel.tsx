import { memo, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { CornerStyle, DotStyle, ErrorCorrectionLevel, QRConfig } from "@/types/qr";

const MAX_LOGO_BYTES = 200 * 1024; // 200 KB

interface Props {
	config: QRConfig;
	onUpdate: <K extends keyof QRConfig>(key: K, value: QRConfig[K]) => void;
}

const labelClass = "block text-gray-300 text-xs mb-1.5";

const selectClass =
	"w-full bg-surface border border-border rounded-lg text-gray-100 text-sm px-3 py-2 outline-none cursor-pointer";

const DOT_STYLES: DotStyle[] = [
	"square",
	"dots",
	"rounded",
	"extra-rounded",
	"classy",
	"classy-rounded"
];

const DOT_STYLE_LABEL_KEYS: Record<
	DotStyle,
	| "dotStyles.square"
	| "dotStyles.dots"
	| "dotStyles.rounded"
	| "dotStyles.extraRounded"
	| "dotStyles.classy"
	| "dotStyles.classyRounded"
> = {
	square: "dotStyles.square",
	dots: "dotStyles.dots",
	rounded: "dotStyles.rounded",
	"extra-rounded": "dotStyles.extraRounded",
	classy: "dotStyles.classy",
	"classy-rounded": "dotStyles.classyRounded"
};

const CORNER_STYLES: CornerStyle[] = ["square", "dot", "extra-rounded"];

const CORNER_STYLE_LABEL_KEYS: Record<
	CornerStyle,
	"cornerStyles.square" | "cornerStyles.dot" | "cornerStyles.extraRounded"
> = {
	square: "cornerStyles.square",
	dot: "cornerStyles.dot",
	"extra-rounded": "cornerStyles.extraRounded"
};

const ERROR_LEVELS: ErrorCorrectionLevel[] = ["L", "M", "Q", "H"];

function CustomizationPanelComponent({ config, onUpdate }: Props) {
	const { t } = useTranslation();
	const logoInputRef = useRef<HTMLInputElement>(null);

	const handleLogoUpload = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) return;
			if (file.size > MAX_LOGO_BYTES) {
				alert(t("customization.logoHint"));
				return;
			}
			const reader = new FileReader();
			reader.onload = (ev) => {
				onUpdate("logoDataUrl", ev.target?.result as string);
			};
			reader.readAsDataURL(file);
			// Reset so same file can be re-selected
			e.target.value = "";
		},
		[onUpdate, t]
	);

	const handleLogoRemove = useCallback(() => {
		onUpdate("logoDataUrl", undefined);
	}, [onUpdate]);

	return (
		<div className="flex flex-col gap-5">
			{/* Dot style */}
			<div>
				<label htmlFor="dot-style" className={labelClass}>
					{t("customization.dotStyle")}
				</label>
				<select
					id="dot-style"
					value={config.dotStyle}
					onChange={(e) => onUpdate("dotStyle", e.target.value as DotStyle)}
					className={selectClass}
				>
					{DOT_STYLES.map((s) => (
						<option key={s} value={s}>
							{t(DOT_STYLE_LABEL_KEYS[s])}
						</option>
					))}
				</select>
			</div>

			{/* Corner style */}
			<div>
				<label htmlFor="corner-style" className={labelClass}>
					{t("customization.cornerStyle")}
				</label>
				<select
					id="corner-style"
					value={config.cornerStyle}
					onChange={(e) => onUpdate("cornerStyle", e.target.value as CornerStyle)}
					className={selectClass}
				>
					{CORNER_STYLES.map((s) => (
						<option key={s} value={s}>
							{t(CORNER_STYLE_LABEL_KEYS[s])}
						</option>
					))}
				</select>
			</div>

			{/* Colors */}
			<div className="grid grid-cols-2 gap-4">
				<div>
					<label htmlFor="dot-color" className={labelClass}>
						{t("customization.dotColor")}
					</label>
					<div className="flex items-center gap-2">
						<input
							id="dot-color"
							type="color"
							value={config.dotColor}
							onChange={(e) => onUpdate("dotColor", e.target.value)}
							className="w-10 h-10 rounded border border-border cursor-pointer bg-transparent p-0.5"
							aria-label={t("customization.dotColor")}
						/>
						<span className="text-gray-400 text-[13px] font-mono">{config.dotColor}</span>
					</div>
				</div>
				<div>
					<label htmlFor="bg-color" className={labelClass}>
						{t("customization.backgroundColor")}
					</label>
					<div className="flex items-center gap-2">
						<input
							id="bg-color"
							type="color"
							value={config.backgroundColor}
							onChange={(e) => onUpdate("backgroundColor", e.target.value)}
							className="w-10 h-10 rounded border border-border cursor-pointer bg-transparent p-0.5"
							aria-label={t("customization.backgroundColor")}
						/>
						<span className="text-gray-400 text-[13px] font-mono">{config.backgroundColor}</span>
					</div>
				</div>
			</div>

			{/* Error correction */}
			<div>
				<label htmlFor="error-correction" className={labelClass}>
					{t("customization.errorCorrection")}
				</label>
				<select
					id="error-correction"
					value={config.errorCorrection}
					onChange={(e) => onUpdate("errorCorrection", e.target.value as ErrorCorrectionLevel)}
					className={selectClass}
				>
					{ERROR_LEVELS.map((l) => (
						<option key={l} value={l}>
							{t(`errorLevels.${l}`)}
						</option>
					))}
				</select>
			</div>

			{/* Size */}
			<div>
				<div className="flex justify-between items-center mb-1.5">
					<label htmlFor="qr-size" className="text-gray-300 text-xs">
						{t("customization.size")}
					</label>
					<span className="text-primary text-[13px] font-mono">{config.size}px</span>
				</div>
				<input
					id="qr-size"
					type="range"
					min={128}
					max={512}
					step={8}
					value={config.size}
					onChange={(e) => onUpdate("size", Number(e.target.value))}
					className="w-full cursor-pointer"
					style={{ accentColor: "#06b6d4" }}
					aria-label={t("customization.size")}
				/>
				<div className="flex justify-between text-gray-400 text-[11px] mt-1">
					<span>128px</span>
					<span>512px</span>
				</div>
			</div>

			{/* Logo */}
			<div>
				<p className={labelClass}>{t("customization.logo")}</p>
				<div className="flex gap-2 items-center">
					<button
						type="button"
						onClick={() => logoInputRef.current?.click()}
						aria-label={t("a11y.uploadLogoAriaLabel")}
						className="bg-surface-raised border border-border rounded-lg text-gray-100 text-[13px] px-3.5 py-2 cursor-pointer transition-colors duration-150"
					>
						{t("customization.logoUpload")}
					</button>
					{config.logoDataUrl && (
						<>
							<img
								src={config.logoDataUrl}
								alt="Logo preview"
								className="w-8 h-8 rounded object-contain border border-border"
							/>
							<button
								type="button"
								onClick={handleLogoRemove}
								aria-label={t("a11y.removeLogoAriaLabel")}
								className="bg-transparent border-none text-error text-[13px] cursor-pointer px-2 py-1"
							>
								{t("customization.logoRemove")}
							</button>
						</>
					)}
				</div>
				<p className="text-gray-400 text-[11px] mt-1.5">{t("customization.logoHint")}</p>
				<input
					ref={logoInputRef}
					type="file"
					accept="image/png,image/svg+xml,image/jpeg,image/webp"
					onChange={handleLogoUpload}
					className="hidden"
					aria-label={t("a11y.uploadLogoAriaLabel")}
				/>
			</div>
		</div>
	);
}

export const CustomizationPanel = memo(CustomizationPanelComponent);
