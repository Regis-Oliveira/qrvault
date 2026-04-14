import { Bug, Lightbulb, MessageSquare } from "lucide-react";
import type { ComponentType } from "react";

export type Category = "bug" | "suggestion" | "general";
export type Step = "category" | "message";
export type Status = "idle" | "sending" | "success" | "error";

export const MAX_CHARS = 1000;

export interface CategoryConfig {
	id: Category;
	Icon: ComponentType<{ size?: number }>;
	color: string;
	bg: string;
	border: string;
}

export const CATEGORIES: CategoryConfig[] = [
	{
		id: "bug",
		Icon: Bug,
		color: "#f87171",
		bg: "rgba(248, 113, 113, 0.08)",
		border: "rgba(248, 113, 113, 0.25)"
	},
	{
		id: "suggestion",
		Icon: Lightbulb,
		color: "#fbbf24",
		bg: "rgba(251, 191, 36, 0.08)",
		border: "rgba(251, 191, 36, 0.25)"
	},
	{
		id: "general",
		Icon: MessageSquare,
		color: "#06b6d4",
		bg: "rgba(6, 182, 212, 0.08)",
		border: "rgba(6, 182, 212, 0.25)"
	}
];
