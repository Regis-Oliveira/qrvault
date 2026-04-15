import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ContentType, EmailConfig, QRConfig, WifiConfig } from "@/types/qr";

interface Props {
	config: QRConfig;
	onTextChange: (value: string) => void;
	onContentTypeChange: (type: ContentType) => void;
	onWifiChange: (wifi: WifiConfig) => void;
	onEmailChange: (email: EmailConfig) => void;
}

const TABS: ContentType[] = ["url", "text", "email", "wifi"];

const inputClass =
	"w-full bg-surface border border-border rounded-lg text-gray-100 text-sm px-3 py-2.5 outline-none transition-colors duration-150";

const labelClass = "block text-gray-300 text-xs mb-1.5";

const URL_REGEX = /^https?:\/\/.+/i;

function validateUrl(value: string): boolean {
	return value === "" || URL_REGEX.test(value);
}

function ContentInputComponent({
	config,
	onTextChange,
	onContentTypeChange,
	onWifiChange,
	onEmailChange
}: Props) {
	const { t } = useTranslation();
	// Local text state for debouncing
	const [localText, setLocalText] = useState(config.text);
	const [urlError, setUrlError] = useState(false);
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Sync if parent resets
	useEffect(() => {
		setLocalText(config.text);
		setUrlError(false);
	}, [config.text]);

	const handleTextChange = useCallback(
		(value: string) => {
			setLocalText(value);
			if (debounceRef.current) clearTimeout(debounceRef.current);
			debounceRef.current = setTimeout(() => {
				onTextChange(value);
			}, 300);
		},
		[onTextChange]
	);

	const handleUrlChange = useCallback(
		(value: string) => {
			setLocalText(value);
			setUrlError(!validateUrl(value));
			if (debounceRef.current) clearTimeout(debounceRef.current);
			debounceRef.current = setTimeout(() => {
				onTextChange(value);
			}, 300);
		},
		[onTextChange]
	);

	useEffect(() => {
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, []);

	return (
		<div className="flex flex-col gap-4">
			{/* Tab row */}
			<div
				className="flex gap-1 bg-surface p-1 rounded-[0.625rem] border border-border"
				role="tablist"
				aria-label={t("contentType.label")}
			>
				{TABS.map((tab) => {
					const active = config.contentType === tab;
					return (
						<button
							key={tab}
							type="button"
							role="tab"
							aria-selected={active}
							onClick={() => onContentTypeChange(tab)}
							className={`flex-1 py-1.5 px-2 rounded text-[13px] cursor-pointer border-none transition-colors duration-150 ${
								active
									? "bg-primary text-background font-semibold"
									: "bg-transparent text-gray-300 font-normal"
							}`}
						>
							{t(`contentType.${tab}`)}
						</button>
					);
				})}
			</div>

			{/* URL */}
			{config.contentType === "url" && (
				<div>
					<label htmlFor="qr-url-input" className={labelClass}>
						{t("url.label")}
					</label>
					<input
						id="qr-url-input"
						type="url"
						value={localText}
						onChange={(e) => handleUrlChange(e.target.value)}
						placeholder={t("url.placeholder")}
						autoFocus
						className={inputClass}
						style={urlError ? { borderColor: "#f87171" } : undefined}
					/>
					{urlError && (
						<p className="text-xs mt-1.5" style={{ color: "#f87171" }}>
							{t("url.error")}
						</p>
					)}
				</div>
			)}

			{/* Text */}
			{config.contentType === "text" && (
				<div>
					<label htmlFor="qr-text-input" className={labelClass}>
						{t("input.label")}
					</label>
					<textarea
						id="qr-text-input"
						rows={3}
						value={localText}
						onChange={(e) => handleTextChange(e.target.value)}
						placeholder={t("input.placeholder")}
						autoFocus
						className={`${inputClass} resize-y min-h-20 [font-family:inherit]`}
					/>
				</div>
			)}

			{/* Email */}
			{config.contentType === "email" && (
				<div className="flex flex-col gap-3">
					<div>
						<label htmlFor="email-address" className={labelClass}>
							{t("email.address")}
						</label>
						<input
							id="email-address"
							type="email"
							value={config.email.address}
							onChange={(e) => onEmailChange({ ...config.email, address: e.target.value })}
							placeholder="hello@example.com"
							className={inputClass}
						/>
					</div>
					<div>
						<label htmlFor="email-subject" className={labelClass}>
							{t("email.subject")}
						</label>
						<input
							id="email-subject"
							type="text"
							value={config.email.subject}
							onChange={(e) => onEmailChange({ ...config.email, subject: e.target.value })}
							className={inputClass}
						/>
					</div>
					<div>
						<label htmlFor="email-body" className={labelClass}>
							{t("email.body")}
						</label>
						<textarea
							id="email-body"
							rows={2}
							value={config.email.body}
							onChange={(e) => onEmailChange({ ...config.email, body: e.target.value })}
							className={`${inputClass} resize-y [font-family:inherit]`}
						/>
					</div>
				</div>
			)}

			{/* WiFi */}
			{config.contentType === "wifi" && (
				<div className="flex flex-col gap-3">
					<div>
						<label htmlFor="wifi-ssid" className={labelClass}>
							{t("wifi.ssid")}
						</label>
						<input
							id="wifi-ssid"
							type="text"
							value={config.wifi.ssid}
							onChange={(e) => onWifiChange({ ...config.wifi, ssid: e.target.value })}
							className={inputClass}
						/>
					</div>
					<div>
						<label htmlFor="wifi-security" className={labelClass}>
							{t("wifi.security")}
						</label>
						<select
							id="wifi-security"
							value={config.wifi.security}
							onChange={(e) =>
								onWifiChange({
									...config.wifi,
									security: e.target.value as "WPA" | "WEP" | "nopass"
								})
							}
							className={`${inputClass} cursor-pointer`}
						>
							<option value="WPA">{t("wifi.securityWpa")}</option>
							<option value="WEP">{t("wifi.securityWep")}</option>
							<option value="nopass">{t("wifi.securityNone")}</option>
						</select>
					</div>
					{config.wifi.security !== "nopass" && (
						<div>
							<label htmlFor="wifi-password" className={labelClass}>
								{t("wifi.password")}
							</label>
							<input
								id="wifi-password"
								type="password"
								value={config.wifi.password}
								onChange={(e) => onWifiChange({ ...config.wifi, password: e.target.value })}
								className={inputClass}
							/>
						</div>
					)}
					<label className="flex items-center gap-2 cursor-pointer text-gray-300 text-sm">
						<input
							type="checkbox"
							checked={config.wifi.hidden}
							onChange={(e) => onWifiChange({ ...config.wifi, hidden: e.target.checked })}
							className="w-4 h-4"
							style={{ accentColor: "#06b6d4" }}
						/>
						{t("wifi.hidden")}
					</label>
				</div>
			)}
		</div>
	);
}

export const ContentInput = memo(ContentInputComponent);
