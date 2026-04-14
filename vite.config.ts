import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		// When vercel dev applies the vercel.json rewrite rule (destination: /index.html),
		// it loads index.html through Vite's module pipeline instead of the HTML
		// middleware. Without this, vite:import-analysis tries to parse the raw HTML
		// (including <script type="application/ld+json"> blocks) as JavaScript and fails.
		// Returning valid empty JS here lets the module pipeline succeed, while the
		// indexHtmlMiddleware still serves the real HTML to the browser independently.
		{
			name: "html-module-passthrough",
			apply: "serve",
			transform(_code: string, id: string) {
				if (id.endsWith(".html")) {
					return { code: "export default {}", map: null }
				}
			},
		},
		react(),
		tailwindcss(),
	],
	optimizeDeps: {
		include: ["html2canvas"]
	},
	server: {
		proxy: {
			// Proxy /api/* to vercel dev (port 3000) during local development.
			// Run `vercel dev` in a separate terminal, then `npm run dev` as usual.
			"/api": "http://localhost:3000"
		}
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src")
		}
	},
	build: {
		chunkSizeWarningLimit: 600,
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
						return "vendor-react";
					}
					if (id.includes("node_modules/framer-motion/")) {
						return "vendor-motion";
					}
					if (id.includes("node_modules/@radix-ui/")) {
						return "vendor-radix";
					}
					if (id.includes("node_modules/i18next/") || id.includes("node_modules/react-i18next/")) {
						return "vendor-i18n";
					}
					if (id.includes("node_modules/qr-code-styling/")) {
						return "vendor-qr";
					}
				}
			}
		}
	}
});
