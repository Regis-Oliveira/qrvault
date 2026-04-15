export type ContentType = "url" | "text" | "email" | "wifi";

// ─── Saved QR vault types ─────────────────────────────────────────────────────

/** Lightweight record stored in the `qr-metadata` IDB store. No logo blob. */
export interface SavedQRMeta {
	id: string;
	title: string;
	description: string;
	category: string;
	/** Full QRConfig minus logoDataUrl — logo is stored separately in the blobs store. */
	config: Omit<QRConfig, "logoDataUrl">;
	/** Small PNG data URL (~200px) for table thumbnail previews. */
	thumbnailDataUrl: string;
	createdAt: number;
	updatedAt: number;
}

/** Logo blob stored in the `qr-blobs` IDB store. */
export interface SavedQRBlobs {
	id: string;
	logoBlob?: Blob;
}

export type DotStyle =
	| "square"
	| "dots"
	| "rounded"
	| "extra-rounded"
	| "classy"
	| "classy-rounded";

export type CornerStyle = "square" | "dot" | "extra-rounded";

export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export type DownloadFormat = "png" | "svg" | "jpeg";

export interface WifiConfig {
	ssid: string;
	password: string;
	security: "WPA" | "WEP" | "nopass";
	hidden: boolean;
}

export interface EmailConfig {
	address: string;
	subject: string;
	body: string;
}

export interface QRConfig {
	contentType: ContentType;
	text: string;
	wifi: WifiConfig;
	email: EmailConfig;
	dotStyle: DotStyle;
	dotColor: string;
	backgroundColor: string;
	cornerStyle: CornerStyle;
	errorCorrection: ErrorCorrectionLevel;
	size: number;
	logoDataUrl: string | undefined;
}
