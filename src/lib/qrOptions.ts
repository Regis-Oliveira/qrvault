import type QRCodeStyling from "qr-code-styling";
import { buildQRData } from "@/lib/qrContent";
import type { QRConfig } from "@/types/qr";

/**
 * Builds the options object for QRCodeStyling from a QRConfig.
 * Shared between QRPreview (live rendering) and QRCodesPage (on-demand downloads).
 */
export function buildQROptions(config: QRConfig): ConstructorParameters<typeof QRCodeStyling>[0] {
	return {
		width: config.size,
		height: config.size,
		data: buildQRData(config) || "https://qrvault.app",
		qrOptions: {
			errorCorrectionLevel: config.errorCorrection
		},
		dotsOptions: {
			type: config.dotStyle,
			color: config.dotColor
		},
		cornersSquareOptions: {
			type:
				config.cornerStyle === "square"
					? "square"
					: config.cornerStyle === "dot"
						? "dot"
						: "extra-rounded"
		},
		backgroundOptions: {
			color: config.backgroundColor
		},
		image: config.logoDataUrl ?? "",
		imageOptions: {
			crossOrigin: "anonymous",
			margin: 4,
			imageSize: 0.3
		}
	};
}
