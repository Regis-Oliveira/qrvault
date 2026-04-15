import { ChevronDown, Coffee, FolderOpen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { SUPPORTED_LANGUAGES, setLanguage } from "@/i18n";
import { BUY_ME_A_COFFEE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

export function Header() {
	const { t, i18n } = useTranslation();
	const currentLang = i18n.language;
	const [langOpen, setLangOpen] = useState(false);
	const langRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!langOpen) return;
		function handleOutside(e: MouseEvent) {
			if (langRef.current && !langRef.current.contains(e.target as Node)) {
				setLangOpen(false);
			}
		}
		function handleEscape(e: KeyboardEvent) {
			if (e.key === "Escape") setLangOpen(false);
		}
		document.addEventListener("mousedown", handleOutside);
		document.addEventListener("keydown", handleEscape);
		return () => {
			document.removeEventListener("mousedown", handleOutside);
			document.removeEventListener("keydown", handleEscape);
		};
	}, [langOpen]);

	const activeLang =
		SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) ?? SUPPORTED_LANGUAGES[0];

	return (
		<header
			className="sticky top-0 z-50 w-full"
			style={{
				background: "rgba(13, 17, 23, 0.90)",
				backdropFilter: "blur(16px)",
				WebkitBackdropFilter: "blur(16px)",
				borderBottom: "1px solid #1e2a38"
			}}
		>
			<div className="w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 h-16 flex items-center justify-between gap-4">
				{/* Logo + Brand */}
				<Link to="/" className="flex items-center gap-2.5 min-h-11" aria-label={t("brand.name")}>
					<Logo size={30} />
					<span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-br from-cyan-300 via-cyan-400 to-cyan-600">
						{t("brand.name")}
					</span>
				</Link>

				{/* Right side */}
				<nav className="flex items-center gap-2" aria-label="Main navigation">
					{/* Language switcher */}
					<div ref={langRef} className="relative">
						<button
							type="button"
							data-testid="lang-trigger"
							onClick={() => setLangOpen((v) => !v)}
							aria-haspopup="listbox"
							aria-expanded={langOpen}
							aria-label="Select language"
							className="flex items-center gap-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80 cursor-pointer"
							style={{
								background: "#0d1117",
								border: "1px solid #1e2a38",
								color: "#fff",
								minHeight: "44px"
							}}
						>
							<span aria-hidden="true">{activeLang.flag}</span>
							<span>{activeLang.shortLabel}</span>
							<ChevronDown
								size={12}
								aria-hidden="true"
								className={cn("transition-transform duration-200", langOpen && "rotate-180")}
							/>
						</button>

						{langOpen && (
							<ul
								data-testid="lang-dropdown"
								role="listbox"
								aria-label="Language options"
								className="absolute right-0 mt-1.5 rounded-lg overflow-hidden z-50"
								style={{
									background: "#0d1117",
									border: "1px solid #1e2a38",
									minWidth: "140px",
									boxShadow: "0 8px 24px rgba(0,0,0,0.5)"
								}}
							>
								{SUPPORTED_LANGUAGES.map((lang) => (
									<li key={lang.code} role="option" aria-selected={currentLang === lang.code}>
										<button
											type="button"
											onClick={() => {
												void setLanguage(lang.code);
												setLangOpen(false);
											}}
											className={cn(
												"w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold transition-colors cursor-pointer",
												currentLang === lang.code
													? "text-white"
													: "text-[#6b8ea8] hover:text-white hover:bg-white/5"
											)}
											style={{
												background:
													currentLang === lang.code ? "rgba(6,182,212,0.2)" : "transparent"
											}}
										>
											<span aria-hidden="true">{lang.flag}</span>
											<span>{lang.label}</span>
										</button>
									</li>
								))}
							</ul>
						)}
					</div>

					{/* My QR Codes */}
					<Link
						to="/qrcodes"
						aria-label={t("nav.myQRCodes")}
						className="flex items-center justify-center gap-1.5 sm:px-3 rounded-lg text-xs font-semibold transition-all hover:opacity-80 cursor-pointer"
						style={{
							background: "rgba(6,182,212,0.08)",
							border: "1px solid rgba(6,182,212,0.3)",
							color: "#06b6d4",
							minWidth: "44px",
							minHeight: "44px"
						}}
					>
						<FolderOpen size={12} aria-hidden="true" />
						<span className="hidden sm:inline">{t("nav.myQRCodes")}</span>
					</Link>

					{/* Buy me a coffee */}
					<a
						href={BUY_ME_A_COFFEE_URL}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={t("nav.buyMeCoffee")}
						className="flex items-center justify-center gap-1.5 sm:px-3 rounded-lg text-xs font-semibold transition-all hover:opacity-80 cursor-pointer"
						style={{
							background: "rgba(251, 191, 36, 0.10)",
							border: "1px solid rgba(251, 191, 36, 0.35)",
							color: "#fbbf24",
							minWidth: "44px",
							minHeight: "44px"
						}}
					>
						<Coffee size={12} aria-hidden="true" />
						<span className="hidden sm:inline">{t("nav.buyMeCoffee")}</span>
					</a>
				</nav>
			</div>
		</header>
	);
}
