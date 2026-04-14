import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";
import "@/i18n";
import "@/index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

inject();
injectSpeedInsights();

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

createRoot(root).render(
	<StrictMode>
		<App />
	</StrictMode>
);
