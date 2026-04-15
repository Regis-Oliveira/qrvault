import { type IDBPDatabase, openDB } from "idb";
import type { SavedQRBlobs, SavedQRMeta } from "@/types/qr";

const DB_NAME = "qrvault";
const DB_VERSION = 1;
const META_STORE = "qr-metadata";
const BLOBS_STORE = "qr-blobs";

let db: IDBPDatabase | null = null;

async function getDb(): Promise<IDBPDatabase> {
	if (!db) {
		db = await openDB(DB_NAME, DB_VERSION, {
			upgrade(database) {
				if (!database.objectStoreNames.contains(META_STORE)) {
					database.createObjectStore(META_STORE, { keyPath: "id" });
				}
				if (!database.objectStoreNames.contains(BLOBS_STORE)) {
					database.createObjectStore(BLOBS_STORE, { keyPath: "id" });
				}
			}
		});
	}
	return db;
}

// ─── Write ────────────────────────────────────────────────────────────────────

export async function saveQR(meta: SavedQRMeta, logoBlob?: Blob): Promise<void> {
	const database = await getDb();
	await Promise.all([
		database.put(META_STORE, meta),
		database.put(BLOBS_STORE, { id: meta.id, logoBlob } satisfies SavedQRBlobs)
	]);
}

export async function updateQR(meta: SavedQRMeta, logoBlob?: Blob): Promise<void> {
	await saveQR(meta, logoBlob);
}

// ─── Read ─────────────────────────────────────────────────────────────────────

/** Load all saved QR metadata, newest first. */
export async function loadAllQRs(): Promise<SavedQRMeta[]> {
	const database = await getDb();
	const all: SavedQRMeta[] = await database.getAll(META_STORE);
	return all.sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * Load the logo blob for a saved QR and return it as an object URL.
 * Caller is responsible for revoking the URL with URL.revokeObjectURL().
 */
export async function loadLogoBlob(id: string): Promise<string | undefined> {
	const database = await getDb();
	const record: SavedQRBlobs | undefined = await database.get(BLOBS_STORE, id);
	if (!record?.logoBlob) return undefined;
	return URL.createObjectURL(record.logoBlob);
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteQR(id: string): Promise<void> {
	const database = await getDb();
	await Promise.all([database.delete(META_STORE, id), database.delete(BLOBS_STORE, id)]);
}

export async function clearAllQRs(): Promise<void> {
	const database = await getDb();
	await Promise.all([database.clear(META_STORE), database.clear(BLOBS_STORE)]);
}

// ─── Storage quota ────────────────────────────────────────────────────────────

export async function getStorageEstimate(): Promise<{ usage: number; quota: number } | null> {
	if (
		typeof navigator === "undefined" ||
		!("storage" in navigator) ||
		navigator.storage == null ||
		typeof (navigator.storage as unknown as Record<string, unknown>)["estimate"] !== "function"
	) {
		return null;
	}
	try {
		const { usage = 0, quota = 0 } = await navigator.storage.estimate();
		return { usage, quota };
	} catch {
		return null;
	}
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function blobToDataUrl(blob: Blob): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(blob);
	});
}

export function dataUrlToBlob(dataUrl: string): Blob {
	try {
		const commaIdx = dataUrl.indexOf(",");
		const header = commaIdx >= 0 ? dataUrl.slice(0, commaIdx) : "";
		const data = commaIdx >= 0 ? dataUrl.slice(commaIdx + 1) : dataUrl;
		const mime = header.match(/:(.*?);/)?.[1] ?? "application/octet-stream";
		const bytes = atob(data);
		const arr = new Uint8Array(bytes.length);
		for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
		return new Blob([arr], { type: mime });
	} catch {
		return new Blob([], { type: "application/octet-stream" });
	}
}
