import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const LOCALE_LOADERS: Record<string, () => Promise<unknown>> = {
	en: () => import("./locales/en"),
	"pt-BR": () => import("./locales/pt-BR"),
	es: () => import("./locales/es"),
	fr: () => import("./locales/fr"),
	pl: () => import("./locales/pl")
};

const savedLang = localStorage.getItem("qrvault-lang");
const browserLang = navigator.language;

function detectLanguage(): string {
	if (savedLang) return savedLang;
	if (browserLang.startsWith("pt")) return "pt-BR";
	if (browserLang.startsWith("es")) return "es";
	if (browserLang.startsWith("fr")) return "fr";
	if (browserLang.startsWith("pl")) return "pl";
	return "en";
}

const activeLang = detectLanguage();
const activeLocale = ((await LOCALE_LOADERS[activeLang]?.()) ?? (await LOCALE_LOADERS.en())) as {
	default: { translation: Record<string, unknown> };
};

i18n.use(initReactI18next).init({
	resources: {
		[activeLang]: activeLocale.default
	},
	lng: activeLang,
	fallbackLng: "en",
	interpolation: {
		escapeValue: false
	}
});

export default i18n;

export async function setLanguage(lang: string): Promise<void> {
	if (!i18n.hasResourceBundle(lang, "translation")) {
		const loader = LOCALE_LOADERS[lang] ?? LOCALE_LOADERS.en;
		const mod = (await loader()) as { default: { translation: Record<string, unknown> } };
		i18n.addResourceBundle(lang, "translation", mod.default.translation);
	}
	await i18n.changeLanguage(lang);
	localStorage.setItem("qrvault-lang", lang);
}

export const SUPPORTED_LANGUAGES = [
	{ code: "en", label: "English", flag: "🇺🇸", shortLabel: "EN" },
	{ code: "pt-BR", label: "Português", flag: "🇧🇷", shortLabel: "PT" },
	{ code: "es", label: "Español", flag: "🇪🇸", shortLabel: "ES" },
	{ code: "fr", label: "Français", flag: "🇫🇷", shortLabel: "FR" },
	{ code: "pl", label: "Polski", flag: "🇵🇱", shortLabel: "PL" }
];
