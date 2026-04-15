import QRCodeStyling from "qr-code-styling";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { isConfigEmpty } from "@/lib/qrContent";
import { buildQROptions } from "@/lib/qrOptions";
import type { QRConfig } from "@/types/qr";

interface Props {
	config: QRConfig;
	instanceRef?: React.Ref<QRCodeStyling | null>;
}

export function QRPreview({ config, instanceRef }: Props) {
	const { t } = useTranslation();
	const containerRef = useRef<HTMLDivElement>(null);
	const qrRef = useRef<QRCodeStyling | null>(null);
	const empty = isConfigEmpty(config);

	// Instantiate once on mount and expose the instance to the parent via instanceRef.
	// useImperativeHandle cannot be used here because it runs in the layout phase,
	// before this useEffect fires — so the ref factory would capture qrRef.current = null.
	// Instead we assign the parent ref directly after the instance is created.
	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional mount-only effect
	useEffect(() => {
		if (!containerRef.current) return;
		qrRef.current = new QRCodeStyling(buildQROptions(config));
		qrRef.current.append(containerRef.current);
		if (instanceRef) {
			if (typeof instanceRef === "function") {
				instanceRef(qrRef.current);
			} else {
				(instanceRef as React.MutableRefObject<QRCodeStyling | null>).current = qrRef.current;
			}
		}
	}, []);

	// Update on config changes (debounce handled by parent for text fields)
	useEffect(() => {
		qrRef.current?.update(buildQROptions(config));
	}, [config]);

	return (
		<div className="flex flex-col items-center gap-3">
			<div
				className="relative rounded-xl overflow-hidden"
				style={{ boxShadow: "0 0 0 1px #2d3748, 0 8px 32px rgba(0,0,0,0.5)" }}
			>
				<div
					ref={containerRef}
					aria-label={t("a11y.qrPreview")}
					role="img"
					className="block [line-height:0]"
				/>
				{empty && (
					<div
						className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none backdrop-blur-[2px]"
						style={{ backgroundColor: "rgba(13, 17, 23, 0.85)" }}
					>
						<span className="text-[2rem]">⬛</span>
						<p className="text-gray-400 text-[13px] text-center px-4">{t("preview.empty")}</p>
					</div>
				)}
			</div>
			{!empty && <p className="text-gray-400 text-xs">{t("preview.scanHint")}</p>}
		</div>
	);
}
