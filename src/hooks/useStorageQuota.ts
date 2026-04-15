import { useCallback, useEffect, useState } from "react";
import { getStorageEstimate } from "@/lib/qrStorage";

export type StorageTier = "safe" | "warning" | "critical" | "blocked";

export interface StorageInfo {
	usageBytes: number;
	quotaBytes: number;
	usagePercent: number;
	tier: StorageTier;
	isSupported: boolean;
}

const THRESHOLD_WARNING = 50;
const THRESHOLD_CRITICAL = 75;
const THRESHOLD_BLOCKED = 90;

function computeTier(percent: number): StorageTier {
	if (percent >= THRESHOLD_BLOCKED) return "blocked";
	if (percent >= THRESHOLD_CRITICAL) return "critical";
	if (percent >= THRESHOLD_WARNING) return "warning";
	return "safe";
}

const INITIAL: StorageInfo = {
	usageBytes: 0,
	quotaBytes: 0,
	usagePercent: 0,
	tier: "safe",
	isSupported: false
};

export function useStorageQuota() {
	const [info, setInfo] = useState<StorageInfo>(INITIAL);

	const refresh = useCallback(async () => {
		const estimate = await getStorageEstimate();
		if (!estimate) return;
		const { usage, quota } = estimate;
		const percent = quota > 0 ? Math.round((usage / quota) * 100) : 0;
		setInfo({
			usageBytes: usage,
			quotaBytes: quota,
			usagePercent: percent,
			tier: computeTier(percent),
			isSupported: true
		});
	}, []);

	useEffect(() => {
		void refresh();
	}, [refresh]);

	return { info, refresh };
}
