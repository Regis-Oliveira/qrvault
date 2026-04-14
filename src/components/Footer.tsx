import { Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Logo } from "./Logo";

export function Footer() {
	const { t } = useTranslation();

	return (
		<footer
			className="w-full py-8"
			style={{ borderTop: "1px solid #1e2a38", background: "#0d1117" }}
		>
			<div className="w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
				<div className="flex flex-col sm:flex-row items-center justify-between gap-5">
					{/* Brand */}
					<div className="flex flex-col items-center sm:items-start gap-1">
						<div className="flex items-center gap-2">
							<Logo size={20} />
							<span className="text-sm font-semibold bg-clip-text text-transparent bg-linear-to-br from-cyan-300 via-cyan-400 to-cyan-600">
								QRVault
							</span>
						</div>
						<span className="text-xs" style={{ color: "#8896a8" }}>
							by ROC Desenvolvimento de Software Ltda
						</span>
					</div>

					{/* Privacy notice */}
					<div
						className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium"
						style={{
							background: "#0d1117",
							color: "#a0aec0",
							border: "1px solid #1e2a38"
						}}
					>
						<Shield size={12} aria-hidden="true" />
						{t("footer.privacy")}
					</div>

					{/* Rights */}
					<div className="text-center sm:text-right">
						<p className="text-xs" style={{ color: "#8896a8" }}>
							{t("footer.madeWith")}
							<br />
							<span>{t("footer.rights")}</span>
						</p>
						<p className="text-xs mt-1" style={{ color: "#a0aec0" }}>
							© {new Date().getFullYear()} ROC Desenvolvimento de Software Ltda
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
