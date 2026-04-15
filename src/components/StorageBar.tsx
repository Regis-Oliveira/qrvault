import { AlertTriangle, Ban, HardDrive } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { StorageInfo, StorageTier } from "@/hooks/useStorageQuota";
import { formatBytes } from "@/lib/utils";

interface StorageBarProps {
	storageInfo: StorageInfo;
}

interface TierStyle {
	fill: string;
	text: string;
	dimText: string;
	border: string;
	bg: string;
}

const TIER_STYLE: Record<StorageTier, TierStyle> = {
	safe: {
		fill: "#06b6d4",
		text: "#67e8f9",
		dimText: "#22d3ee",
		border: "#164e63",
		bg: "transparent"
	},
	warning: {
		fill: "#fbbf24",
		text: "#fbbf24",
		dimText: "#ca8a04",
		border: "#78350f",
		bg: "rgba(251,191,36,0.04)"
	},
	critical: {
		fill: "#f97316",
		text: "#fb923c",
		dimText: "#ea580c",
		border: "#7c2d12",
		bg: "rgba(249,115,22,0.05)"
	},
	blocked: {
		fill: "#ef4444",
		text: "#f87171",
		dimText: "#ef4444",
		border: "#7f1d1d",
		bg: "rgba(239,68,68,0.05)"
	}
};

export function StorageBar({ storageInfo }: StorageBarProps) {
	const { t } = useTranslation();
	const { usageBytes, quotaBytes, usagePercent, tier, isSupported } = storageInfo;

	if (!isSupported) return null;

	const styles = TIER_STYLE[tier];
	const isConstrained = tier !== "safe";

	const TierIcon =
		tier === "blocked"
			? Ban
			: tier === "critical" || tier === "warning"
				? AlertTriangle
				: HardDrive;

	return (
		<div
			className="w-full rounded-xl transition-all duration-300"
			style={{
				border: `1px solid ${isConstrained ? styles.border : "#1e2a38"}`,
				background: isConstrained ? styles.bg : "transparent",
				padding: isConstrained ? "12px 16px" : "8px 16px"
			}}
			role="status"
			aria-label={t("storage.ariaLabel", { percent: String(usagePercent) })}
		>
			<div className="flex items-center gap-3">
				<TierIcon size={13} style={{ color: styles.text, flexShrink: 0 }} aria-hidden="true" />

				<div
					className="flex-1 rounded-full overflow-hidden"
					style={{ background: "#0d1117", height: "5px" }}
				>
					<div
						className="h-full rounded-full transition-all duration-500"
						style={{
							width: `${Math.min(usagePercent, 100)}%`,
							background: styles.fill
						}}
					/>
				</div>

				<span className="text-xs tabular-nums shrink-0" style={{ color: styles.text }}>
					{formatBytes(usageBytes, 1)}{" "}
					<span style={{ color: styles.dimText }}>
						/ {formatBytes(quotaBytes, 1)} · {usagePercent}%
					</span>
				</span>
			</div>

			{isConstrained && (
				<p className="text-xs mt-2 leading-snug" style={{ color: styles.text }}>
					{tier === "blocked"
						? t("storage.blocked")
						: tier === "critical"
							? t("storage.critical")
							: t("storage.warning")}
				</p>
			)}
		</div>
	);
}
