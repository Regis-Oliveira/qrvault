/**
 * Tests for lib/qrStorage.ts — the IndexedDB persistence layer for saved QR codes.
 * idb is replaced with an in-memory fake so every function can be exercised
 * without a real browser IDB implementation.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { SavedQRMeta } from "@/types/qr";

// ── In-memory IDB fake ────────────────────────────────────────────────────────

const storeData = vi.hoisted(() => ({
	meta: new Map<string, unknown>(),
	blobs: new Map<string, unknown>()
}));

vi.mock("idb", () => ({
	openDB: vi.fn(async () => ({
		async put(store: string, value: unknown) {
			const v = value as { id: string };
			if (store === "qr-metadata") storeData.meta.set(v.id, value);
			else if (store === "qr-blobs") storeData.blobs.set(v.id, value);
		},
		async get(store: string, id: string) {
			if (store === "qr-metadata") return storeData.meta.get(id);
			if (store === "qr-blobs") return storeData.blobs.get(id);
			return undefined;
		},
		async getAll(store: string) {
			if (store === "qr-metadata") return [...storeData.meta.values()];
			if (store === "qr-blobs") return [...storeData.blobs.values()];
			return [];
		},
		async delete(store: string, id: string) {
			if (store === "qr-metadata") storeData.meta.delete(id);
			else if (store === "qr-blobs") storeData.blobs.delete(id);
		},
		async clear(store: string) {
			if (store === "qr-metadata") storeData.meta.clear();
			else if (store === "qr-blobs") storeData.blobs.clear();
		},
		objectStoreNames: { contains: () => false },
		createObjectStore: vi.fn()
	}))
}));

import {
	blobToDataUrl,
	clearAllQRs,
	dataUrlToBlob,
	deleteQR,
	getStorageEstimate,
	loadAllQRs,
	loadLogoBlob,
	saveQR,
	updateQR
} from "@/lib/qrStorage";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeMeta(id: string, overrides: Partial<SavedQRMeta> = {}): SavedQRMeta {
	return {
		id,
		title: `QR ${id}`,
		description: "",
		category: "URL",
		config: {
			contentType: "url",
			text: "https://example.com",
			wifi: { ssid: "", password: "", security: "WPA", hidden: false },
			email: { address: "", subject: "", body: "" },
			dotStyle: "square",
			dotColor: "#06b6d4",
			backgroundColor: "#ffffff",
			cornerStyle: "square",
			errorCorrection: "M",
			size: 300
		},
		thumbnailDataUrl: "data:image/png;base64,thumb",
		createdAt: Date.now(),
		updatedAt: Date.now(),
		...overrides
	};
}

beforeEach(() => {
	storeData.meta.clear();
	storeData.blobs.clear();
});

afterEach(() => {
	vi.restoreAllMocks();
});

// ── saveQR / loadAllQRs ───────────────────────────────────────────────────────

describe("saveQR + loadAllQRs", () => {
	it("saves a QR and loads it back", async () => {
		const meta = makeMeta("qr-1");
		await saveQR(meta);
		const result = await loadAllQRs();
		expect(result).toHaveLength(1);
		expect(result[0].id).toBe("qr-1");
	});

	it("returns all saved QRs", async () => {
		await saveQR(makeMeta("a"));
		await saveQR(makeMeta("b"));
		const result = await loadAllQRs();
		expect(result).toHaveLength(2);
	});

	it("returns an empty array when nothing is saved", async () => {
		const result = await loadAllQRs();
		expect(result).toEqual([]);
	});

	it("sorts results newest first", async () => {
		await saveQR(makeMeta("old", { createdAt: 1000 }));
		await saveQR(makeMeta("new", { createdAt: 9000 }));
		const result = await loadAllQRs();
		expect(result[0].id).toBe("new");
		expect(result[1].id).toBe("old");
	});
});

// ── updateQR ─────────────────────────────────────────────────────────────────

describe("updateQR", () => {
	it("overwrites the existing metadata", async () => {
		await saveQR(makeMeta("qr-1", { title: "Original" }));
		await updateQR(makeMeta("qr-1", { title: "Updated" }));
		const result = await loadAllQRs();
		expect(result).toHaveLength(1);
		expect(result[0].title).toBe("Updated");
	});
});

// ── loadLogoBlob ──────────────────────────────────────────────────────────────

describe("loadLogoBlob", () => {
	it("returns an object URL when a logo blob exists", async () => {
		const meta = makeMeta("qr-1");
		const logo = new Blob(["logo"], { type: "image/png" });
		await saveQR(meta, logo);
		const url = await loadLogoBlob("qr-1");
		expect(url).toBe("blob:mock-url");
	});

	it("returns undefined when no logo blob exists", async () => {
		await saveQR(makeMeta("qr-1"));
		const url = await loadLogoBlob("qr-1");
		expect(url).toBeUndefined();
	});

	it("returns undefined for a non-existent QR", async () => {
		const url = await loadLogoBlob("missing");
		expect(url).toBeUndefined();
	});
});

// ── deleteQR ──────────────────────────────────────────────────────────────────

describe("deleteQR", () => {
	it("removes the QR from both stores", async () => {
		await saveQR(makeMeta("qr-1"), new Blob(["logo"]));
		await deleteQR("qr-1");
		const result = await loadAllQRs();
		expect(result).toHaveLength(0);
		expect(await loadLogoBlob("qr-1")).toBeUndefined();
	});

	it("does not throw when deleting a non-existent QR", async () => {
		await expect(deleteQR("ghost")).resolves.toBeUndefined();
	});

	it("does not remove other QRs", async () => {
		await saveQR(makeMeta("a"));
		await saveQR(makeMeta("b"));
		await deleteQR("a");
		const result = await loadAllQRs();
		expect(result).toHaveLength(1);
		expect(result[0].id).toBe("b");
	});
});

// ── clearAllQRs ───────────────────────────────────────────────────────────────

describe("clearAllQRs", () => {
	it("removes all QR records", async () => {
		await saveQR(makeMeta("a"));
		await saveQR(makeMeta("b"));
		await clearAllQRs();
		expect(await loadAllQRs()).toHaveLength(0);
	});

	it("does not throw on empty stores", async () => {
		await expect(clearAllQRs()).resolves.toBeUndefined();
	});
});

// ── getStorageEstimate ────────────────────────────────────────────────────────

describe("getStorageEstimate", () => {
	it("returns usage and quota when navigator.storage is available", async () => {
		Object.defineProperty(navigator, "storage", {
			value: { estimate: vi.fn().mockResolvedValue({ usage: 1024, quota: 500_000 }) },
			configurable: true
		});
		const result = await getStorageEstimate();
		expect(result).toEqual({ usage: 1024, quota: 500_000 });
	});

	it("returns null when navigator.storage.estimate throws", async () => {
		Object.defineProperty(navigator, "storage", {
			value: { estimate: vi.fn().mockRejectedValue(new Error("denied")) },
			configurable: true
		});
		const result = await getStorageEstimate();
		expect(result).toBeNull();
	});

	it("returns null when navigator.storage is null", async () => {
		Object.defineProperty(navigator, "storage", { value: null, configurable: true });
		const result = await getStorageEstimate();
		expect(result).toBeNull();
	});
});

// ── blobToDataUrl ─────────────────────────────────────────────────────────────

describe("blobToDataUrl", () => {
	it("converts a Blob to a data URL string", async () => {
		const blob = new Blob(["hello"], { type: "text/plain" });
		const url = await blobToDataUrl(blob);
		expect(typeof url).toBe("string");
		expect(url.startsWith("data:")).toBe(true);
	});
});

// ── dataUrlToBlob ─────────────────────────────────────────────────────────────

describe("dataUrlToBlob", () => {
	it("converts a valid data URL to a Blob", () => {
		const dataUrl = "data:image/png;base64,iVBORw0KGgo=";
		const blob = dataUrlToBlob(dataUrl);
		expect(blob).toBeInstanceOf(Blob);
		expect(blob.type).toBe("image/png");
	});

	it("returns an empty Blob for an invalid data URL", () => {
		const blob = dataUrlToBlob("not-a-data-url");
		expect(blob).toBeInstanceOf(Blob);
	});
});
