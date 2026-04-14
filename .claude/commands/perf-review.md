Review the current codebase for front-end performance issues using the checklist below. For each item, check the actual source files — do not assume. Report findings as: ✅ OK, ⚠️ Warning, or ❌ Issue, with a specific file:line reference and a concrete fix for every ⚠️ and ❌.

---

## LOADING

- [ ] **Bundle splitting** — Are large third-party libs (qr-code-styling, framer-motion, radix, i18n) in separate Vite chunks? Check `vite.config.ts` `manualChunks`.
- [ ] **Lazy loading** — Are non-critical components (customization panel, share dialog) loaded with `React.lazy` + `Suspense`? Heavy imports should not block first paint.
- [ ] **Script placement** — Is `<script type="module">` in `index.html` the only script, and does it use Vite's module entry? No render-blocking scripts.
- [ ] **Font loading** — If a custom font is used, does it have `font-display: swap` and a `<link rel="preload">`?
- [ ] **CSS in head** — Is `index.css` imported at the top of `main.tsx`? Tailwind output must not arrive after JS paint.

## CACHING

- [ ] **Content hash filenames** — Does the Vite build output use `[hash]` in asset filenames (default)? Check `dist/assets/` naming.
- [ ] **Stable vendor chunks** — Vendor chunks (react, radix, qr-code-styling) should not change hash when app code changes. Verify `manualChunks` groups them correctly.

## RENDERING

- [ ] **Debounced QR updates** — Is text input debounced before triggering `qrInstance.update()`? Target: 300ms. Generating on every keystroke causes frame drops.
- [ ] **QR instance stability** — Is `QRCodeStyling` instantiated once (in a `useRef`) and updated via `.update()`, not recreated on each render?
- [ ] **No layout-triggering animations** — Are all Framer Motion / CSS animations using only `transform` and `opacity`? Flag any animation of `width`, `height`, `top`, `left`, `margin`, or `padding`.
- [ ] **Event delegation** — For lists of buttons (download options, dot style picker), is there a single parent handler or one per item? Prefer delegation or stable callbacks with `useCallback`.
- [ ] **Memoization** — Are expensive derived values (encoded QR content string, color validation) wrapped in `useMemo`? Are stable callbacks wrapped in `useCallback` where passed as props?
- [ ] **No unnecessary re-renders** — Do child components (QRPreview, CustomizationPanel) receive only the props they need, not the whole config object spread? Use prop drilling or context selectively.

## ASSETS

- [ ] **Logo upload cap** — Is uploaded logo validated at ≤200KB client-side before being passed to QRCodeStyling? Large logos bloat the QR image data URL.
- [ ] **SVG icons** — Are all icons from `lucide-react` (tree-shakeable)? No full icon library imports.
- [ ] **No base64 blobs in state** — Is the logo stored as a data URL string (acceptable) rather than a raw ArrayBuffer or Blob kept in React state across renders?

## FRAME BUDGET (60fps = 16.66ms/frame, practical target <10ms)

- [ ] **No synchronous heavy ops on main thread** — QR encoding itself runs inside qr-code-styling synchronously. Is it called only on debounced input and option changes, not on scroll/resize/pointer events?
- [ ] **RequestAnimationFrame for visual updates** — If any direct DOM measurement or canvas drawing is done outside qr-code-styling, is it wrapped in `requestAnimationFrame`?
- [ ] **No layout thrashing** — Are DOM reads (getBoundingClientRect, offsetWidth) and writes batched separately? Never interleave read/write in a loop.

## AUDIT TOOLS

Run these and address any red/orange findings before shipping:

```bash
# Lighthouse via CLI (requires Chrome)
npx lighthouse http://localhost:5173 --view

# Bundle analysis
npx vite-bundle-visualizer

# Check chunk sizes after build
npm run build && ls -lh dist/assets/
```

Target Lighthouse scores: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95.

---

After reviewing, summarise:
1. Total ❌ issues found and files affected
2. Top 3 highest-impact fixes
3. Any items that are N/A for this project and why
