import { useCallback, useState } from "react";
import type { QRConfig } from "@/types/qr";

const DEFAULT_CONFIG: QRConfig = {
	contentType: "url",
	text: "",
	wifi: { ssid: "", password: "", security: "WPA", hidden: false },
	email: { address: "", subject: "", body: "" },
	dotStyle: "square",
	dotColor: "#06b6d4",
	backgroundColor: "#ffffff",
	cornerStyle: "square",
	errorCorrection: "M",
	size: 300,
	logoDataUrl: undefined
};

export function useQRConfig() {
	const [config, setConfig] = useState<QRConfig>(DEFAULT_CONFIG);

	const update = useCallback(<K extends keyof QRConfig>(key: K, value: QRConfig[K]) => {
		setConfig((prev) => ({ ...prev, [key]: value }));
	}, []);

	const reset = useCallback(() => setConfig(DEFAULT_CONFIG), []);

	return { config, update, reset };
}
