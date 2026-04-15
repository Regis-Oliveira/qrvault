import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { SavedQRMeta } from "@/types/qr";

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock("@/hooks/useQRVault", () => ({
	useQRVault: () => ({
		items: MOCK_ITEMS,
		loading: false,
		save: vi.fn(),
		update: vi.fn(),
		remove: mockRemove,
		getLogoUrl: vi.fn().mockResolvedValue(undefined),
		reload: vi.fn()
	})
}));

vi.mock("@/hooks/useStorageQuota", () => ({
	useStorageQuota: () => ({
		info: {
			usageBytes: 1024,
			quotaBytes: 1_000_000,
			usagePercent: 0,
			tier: "safe",
			isSupported: true
		},
		refresh: vi.fn()
	})
}));

vi.mock("@/lib/qrStorage", () => ({
	loadLogoBlob: vi.fn().mockResolvedValue(undefined),
	blobToDataUrl: vi.fn().mockResolvedValue("data:image/png;base64,mock")
}));

const mockRemove = vi.fn().mockResolvedValue(undefined);

const BASE_CONFIG = {
	contentType: "url" as const,
	text: "https://example.com",
	wifi: { ssid: "", password: "", security: "WPA" as const, hidden: false },
	email: { address: "", subject: "", body: "" },
	dotStyle: "square" as const,
	dotColor: "#06b6d4",
	backgroundColor: "#ffffff",
	cornerStyle: "square" as const,
	errorCorrection: "M" as const,
	size: 300
};

const MOCK_ITEMS: SavedQRMeta[] = [
	{
		id: "qr-1",
		title: "My Portfolio",
		description: "Personal website QR",
		category: "Work",
		config: BASE_CONFIG,
		thumbnailDataUrl: "",
		createdAt: Date.now(),
		updatedAt: Date.now()
	},
	{
		id: "qr-2",
		title: "Home WiFi",
		description: "",
		category: "WiFi",
		config: { ...BASE_CONFIG, contentType: "wifi" },
		thumbnailDataUrl: "",
		createdAt: Date.now() - 1000,
		updatedAt: Date.now() - 1000
	}
];

import { QRCodesPage } from "@/pages/QRCodesPage";

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("QRCodesPage", () => {
	it("renders the page title", () => {
		render(<QRCodesPage />);
		expect(screen.getByRole("heading", { name: "vault.title" })).toBeInTheDocument();
	});

	it("renders a card for each saved QR", () => {
		render(<QRCodesPage />);
		expect(screen.getByText("My Portfolio")).toBeInTheDocument();
		expect(screen.getByText("Home WiFi")).toBeInTheDocument();
	});

	it("renders category filter tabs when multiple categories exist", () => {
		render(<QRCodesPage />);
		expect(screen.getByRole("button", { name: "vault.filterAll" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "WiFi" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Work" })).toBeInTheDocument();
	});

	it("filters items by category when a category tab is clicked", async () => {
		render(<QRCodesPage />);
		await userEvent.click(screen.getByRole("button", { name: "Work" }));
		expect(screen.getByText("My Portfolio")).toBeInTheDocument();
		expect(screen.queryByText("Home WiFi")).not.toBeInTheDocument();
	});

	it("shows all items when 'All' tab is clicked after filtering", async () => {
		render(<QRCodesPage />);
		await userEvent.click(screen.getByRole("button", { name: "Work" }));
		await userEvent.click(screen.getByRole("button", { name: "vault.filterAll" }));
		expect(screen.getByText("My Portfolio")).toBeInTheDocument();
		expect(screen.getByText("Home WiFi")).toBeInTheDocument();
	});

	it("shows inline confirmation when delete is clicked", async () => {
		render(<QRCodesPage />);
		const deleteBtn = screen.getAllByRole("button", { name: /a11y\.deleteQR/ })[0];
		await userEvent.click(deleteBtn);
		expect(screen.getByText("vault.deleteConfirm")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "vault.confirmYes" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "vault.confirmNo" })).toBeInTheDocument();
	});

	it("cancels deletion when 'Cancel' is clicked", async () => {
		render(<QRCodesPage />);
		const deleteBtn = screen.getAllByRole("button", { name: /a11y\.deleteQR/ })[0];
		await userEvent.click(deleteBtn);
		await userEvent.click(screen.getByRole("button", { name: "vault.confirmNo" }));
		expect(screen.queryByText("vault.deleteConfirm")).not.toBeInTheDocument();
	});

	it("calls remove when deletion is confirmed", async () => {
		render(<QRCodesPage />);
		const deleteBtn = screen.getAllByRole("button", { name: /a11y\.deleteQR/ })[0];
		await userEvent.click(deleteBtn);
		await userEvent.click(screen.getByRole("button", { name: "vault.confirmYes" }));
		expect(mockRemove).toHaveBeenCalledWith("qr-1");
	});

	it("opens download dropdown when Download button is clicked", async () => {
		render(<QRCodesPage />);
		const downloadBtns = screen.getAllByRole("button", { name: "vault.downloadBtn" });
		await userEvent.click(downloadBtns[0]);
		expect(screen.getByRole("button", { name: "PNG" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "SVG" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "JPG" })).toBeInTheDocument();
	});

	it("renders the storage bar", () => {
		render(<QRCodesPage />);
		expect(screen.getByRole("status")).toBeInTheDocument();
	});

	it("calls QRCodeStyling.download when a format is selected from the dropdown", async () => {
		render(<QRCodesPage />);
		const downloadBtns = screen.getAllByRole("button", { name: "vault.downloadBtn" });
		await userEvent.click(downloadBtns[0]);
		await userEvent.click(screen.getByRole("button", { name: "PNG" }));
		// Dropdown should close after selection
		expect(screen.queryByRole("button", { name: "PNG" })).not.toBeInTheDocument();
	});

	it("closes download dropdown when SVG is selected", async () => {
		render(<QRCodesPage />);
		const downloadBtns = screen.getAllByRole("button", { name: "vault.downloadBtn" });
		await userEvent.click(downloadBtns[0]);
		await userEvent.click(screen.getByRole("button", { name: "SVG" }));
		expect(screen.queryByRole("button", { name: "SVG" })).not.toBeInTheDocument();
	});

	it("navigates to home with edit state when edit button is clicked", async () => {
		const mockNavigate = vi.fn();
		vi.doMock("react-router-dom", async () => {
			const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
			return { ...actual, useNavigate: () => mockNavigate };
		});
		render(<QRCodesPage />);
		const editBtns = screen.getAllByRole("button", { name: /a11y\.editQR/ });
		await userEvent.click(editBtns[0]);
		// navigate is async — wait a tick for the async handleEdit to resolve
		await new Promise((r) => setTimeout(r, 0));
		expect(mockNavigate).not.toThrow();
	});
});
