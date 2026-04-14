# QRVault — Claude Code Guide

## Stack

- React 19 + Vite + TypeScript (strict)
- Styling: Tailwind v4 utility classes + inline `style` objects for palette-specific values
- Animations: Framer Motion (mocked as plain HTML in tests)
- i18n: react-i18next — translation keys live in `src/i18n/locales/{en,pt-BR,es,fr,pl}.ts`
- Component primitives: Radix UI (tooltip, dialog, select, tabs, etc.)
- Icons: lucide-react
- QR generation: `qr-code-styling` — wraps QRCodeStyling class, append to a ref container
- Testing: Vitest + @testing-library/react + @testing-library/user-event + jsdom
- Linter/formatter: Biome (tabs, no trailing commas)

## Colour palette

All values come from `src/index.css` `@theme`. Use these in inline styles:

| Token | Value | Usage |
|---|---|---|
| background | `#07080d` | page bg |
| surface | `#0d1117` | card bg |
| surface-raised | `#161b22` | elevated elements |
| border | `#2d3748` | default borders |
| text-primary | `#e2e8f0` | headings / body |
| text-secondary | `#a0aec0` | secondary text |
| text-muted | `#8896a8` | placeholder / hints |
| primary | `#06b6d4` | cyan accent |
| primary-light | `#22d3ee` | section labels |
| success | `#34d399` | done state |
| error | `#f87171` | error state |

## Feature development workflow

For every new feature, follow this order without skipping steps:

1. **Implement** — write the feature code
2. **Tests** — write tests that cover the new behaviour
3. **Full pipeline** — run all of the following and fix every error before marking done:
   ```
   npx tsc --noEmit       # zero TypeScript errors
   npm run test:run       # all tests green
   npm run build          # clean production build
   npm run lint           # Biome: zero errors, zero warnings
   ```
4. If `lint` reports fixable issues, run `npm run lint:fix` first, then re-run `lint`.

Never ship with red tests, TypeScript errors, build failures, or Biome violations.

## Adding i18n strings

Every user-visible string goes through `t("some.key")`. Add the key to **all five locales** in the same commit:
`src/i18n/locales/en.ts`, `pt-BR.ts`, `es.ts`, `fr.ts`, `pl.ts`.

The i18n mock in tests returns the raw key string (e.g. `t("download.png")` → `"download.png"`), so use the key string as the expected value in assertions.

## Test conventions

- Setup file: `src/__tests__/setup.ts` — mocks framer-motion, react-i18next, i18n module, and qr-code-styling
- `qr-code-styling` is mocked as a class with `append`, `update`, `download`, and `getRawData` vi.fn() stubs
- Framer Motion is mocked as plain HTML elements; `AnimatePresence` renders children directly
- Use `vi.fn()` with explicit types: `vi.fn<(format: string) => void>()`
- For Radix UI components that use `setTimeout` internally (e.g. Tooltip), use `vi.useFakeTimers()` + `act(() => vi.runAllTimers())`

## Key architectural decisions

- **QR instance lifecycle**: One `QRCodeStyling` instance is created per mount of `QRPreview`. Call `.update(options)` when config changes — do NOT destroy and re-create the instance on every render.
- **Content encoding**: Each content type (URL, text, email, WiFi) has its own encoder function in `src/lib/qrContent.ts` that builds the final string passed to QRCodeStyling. Never build the encoded string inside a component.
- **Logo handling**: Logo is stored as a data URL string in state. Pass it as `image` to QRCodeStyling options. On remove, set to `undefined`.
- **Download format**: Use `qrInstance.download({ name: "qrvault-qr", extension: format })` — do NOT use canvas toDataURL or getRawData manually for downloads.
- **No server, no IndexedDB**: QRVault is session-only. QR state lives in React state only — no persistence needed since regeneration is instant.
- **Tooltip component**: Use `<Tooltip>` from `src/components/Tooltip.tsx` (Radix-based, palette-matched) for all icon-only buttons. Keep `aria-label` on the button itself for screen readers.

## Performance baseline (see `/perf-review` skill)

- Animate only `transform` and `opacity` — never `width`, `height`, `top`, `left`
- QR re-render is debounced 300ms on text input to avoid generating on every keystroke
- `qr-code-styling` is in its own Vite chunk (`vendor-qr`) to avoid blocking the initial paint
- No images larger than what's displayed — logo upload is capped at 200KB client-side
