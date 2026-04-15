import "@testing-library/jest-dom";
import { vi } from "vitest";

// ─── URL.createObjectURL (not in jsdom) ──────────────────────────────────────

URL.createObjectURL = vi.fn(() => "blob:mock-url");
URL.revokeObjectURL = vi.fn();

// ─── framer-motion — render as plain HTML elements ───────────────────────────

vi.mock("framer-motion", async () => {
	const React = await import("react");

	const makeMotion = (tag: string) =>
		React.forwardRef(
			({ children, ...rest }: React.HTMLAttributes<HTMLElement>, ref: React.Ref<HTMLElement>) => {
				const {
					initial: _i,
					animate: _a,
					exit: _e,
					transition: _tr,
					layout: _l,
					whileHover: _wh,
					whileTap: _wt,
					variants: _v,
					...domProps
				} = rest as Record<string, unknown>;
				return React.createElement(tag, { ...domProps, ref }, children);
			}
		);

	const motion = new Proxy({} as Record<string, unknown>, {
		get: (_t, prop: string) => makeMotion(prop)
	});

	const m = new Proxy({} as Record<string, unknown>, {
		get: (_t, prop: string) => makeMotion(prop)
	});

	return {
		motion,
		m,
		LazyMotion: ({ children }: { children: React.ReactNode }) => children,
		domAnimation: {},
		AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
		useMotionValue: () => ({ get: () => 0, set: vi.fn() }),
		useTransform: () => 0
	};
});

// ─── react-i18next ────────────────────────────────────────────────────────────

vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string, opts?: Record<string, unknown>) => {
			if (!opts) return key;
			return key.replace(/\{\{(\w+)\}\}/g, (_m, k) => String(opts[k] ?? k));
		},
		i18n: {
			language: "en",
			changeLanguage: vi.fn()
		}
	}),
	initReactI18next: { type: "3rdParty" as const, init: vi.fn() },
	Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey
}));

// ─── i18n module ─────────────────────────────────────────────────────────────

vi.mock("@/i18n", () => ({
	default: { changeLanguage: vi.fn() },
	setLanguage: vi.fn(),
	SUPPORTED_LANGUAGES: [
		{ code: "en", label: "English", flag: "🇺🇸", shortLabel: "EN" },
		{ code: "pt-BR", label: "Português", flag: "🇧🇷", shortLabel: "PT" },
		{ code: "es", label: "Español", flag: "🇪🇸", shortLabel: "ES" },
		{ code: "fr", label: "Français", flag: "🇫🇷", shortLabel: "FR" },
		{ code: "pl", label: "Polski", flag: "🇵🇱", shortLabel: "PL" }
	]
}));

// ─── react-router-dom ────────────────────────────────────────────────────────

vi.mock("react-router-dom", async () => {
	const React = await import("react");
	return {
		BrowserRouter: ({ children }: { children: React.ReactNode }) => children,
		MemoryRouter: ({ children }: { children: React.ReactNode }) => children,
		Routes: ({ children }: { children: React.ReactNode }) => children,
		Route: ({ element }: { element: React.ReactNode }) => element,
		Link: ({
			children,
			to,
			...props
		}: { children: React.ReactNode; to: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) =>
			React.createElement("a", { href: to, ...props }, children),
		useNavigate: () => vi.fn(),
		useLocation: () => ({ pathname: "/", state: null, search: "", hash: "", key: "default" })
	};
});

// ─── qr-code-styling (not available in jsdom) ────────────────────────────────

vi.mock("qr-code-styling", () => {
	class MockQRCodeStyling {
		append = vi.fn();
		update = vi.fn();
		download = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
		getRawData = vi.fn().mockResolvedValue(new Blob(["mock-qr"], { type: "image/png" }));
	}
	return { default: MockQRCodeStyling };
});
