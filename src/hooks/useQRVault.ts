import { useCallback, useEffect, useState } from "react";
import { deleteQR, loadAllQRs, loadLogoBlob, saveQR, updateQR } from "@/lib/qrStorage";
import type { SavedQRMeta } from "@/types/qr";

export function useQRVault() {
	const [items, setItems] = useState<SavedQRMeta[]>([]);
	const [loading, setLoading] = useState(true);

	const reload = useCallback(async () => {
		setLoading(true);
		try {
			const all = await loadAllQRs();
			setItems(all);
		} finally {
			setLoading(false);
		}
	}, []);

	const save = useCallback(async (meta: SavedQRMeta, logoBlob?: Blob): Promise<void> => {
		await saveQR(meta, logoBlob);
		setItems((prev) => [meta, ...prev.filter((i) => i.id !== meta.id)]);
	}, []);

	const update = useCallback(async (meta: SavedQRMeta, logoBlob?: Blob): Promise<void> => {
		await updateQR(meta, logoBlob);
		setItems((prev) => prev.map((i) => (i.id === meta.id ? meta : i)));
	}, []);

	const remove = useCallback(async (id: string): Promise<void> => {
		await deleteQR(id);
		setItems((prev) => prev.filter((i) => i.id !== id));
	}, []);

	const getLogoUrl = useCallback(async (id: string): Promise<string | undefined> => {
		return loadLogoBlob(id);
	}, []);

	useEffect(() => {
		void reload();
	}, [reload]);

	return { items, loading, save, update, remove, getLogoUrl, reload };
}
