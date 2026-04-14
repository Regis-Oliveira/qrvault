export type ContentType = "url" | "text" | "email" | "wifi";

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
