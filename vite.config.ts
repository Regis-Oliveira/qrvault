import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react(), tailwindcss()],
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
