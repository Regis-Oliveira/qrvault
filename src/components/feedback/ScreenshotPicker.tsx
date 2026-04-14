import { Check, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

type Phase = "selecting" | "adjusting";
type HandleDir = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "move";

interface Rect {
	x: number;
	y: number;
	w: number;
	h: number;
}

interface Point {
	x: number;
	y: number;
}

interface Props {
	onCapture: (dataUrl: string) => void;
	onCancel: () => void;
}

const MIN_SIZE = 20;
const HANDLE_SIZE = 9;
const MAX_OUTPUT_DIM = 1200;

const HANDLE_DEFS: {
	dir: HandleDir;
	cursor: string;
	getPos: (r: Rect) => Point;
}[] = [
	{ dir: "nw", cursor: "nw-resize", getPos: (r) => ({ x: r.x, y: r.y }) },
	{ dir: "n", cursor: "n-resize", getPos: (r) => ({ x: r.x + r.w / 2, y: r.y }) },
	{ dir: "ne", cursor: "ne-resize", getPos: (r) => ({ x: r.x + r.w, y: r.y }) },
	{ dir: "e", cursor: "e-resize", getPos: (r) => ({ x: r.x + r.w, y: r.y + r.h / 2 }) },
	{ dir: "se", cursor: "se-resize", getPos: (r) => ({ x: r.x + r.w, y: r.y + r.h }) },
	{ dir: "s", cursor: "s-resize", getPos: (r) => ({ x: r.x + r.w / 2, y: r.y + r.h }) },
	{ dir: "sw", cursor: "sw-resize", getPos: (r) => ({ x: r.x, y: r.y + r.h }) },
	{ dir: "w", cursor: "w-resize", getPos: (r) => ({ x: r.x, y: r.y + r.h / 2 }) }
];

function applyHandle(dir: HandleDir, base: Rect, dx: number, dy: number): Rect {
	let { x, y, w, h } = base;
	const movesLeft = dir === "w" || dir === "nw" || dir === "sw";
	const movesRight = dir === "e" || dir === "ne" || dir === "se";
	const movesTop = dir === "n" || dir === "nw" || dir === "ne";
	const movesBottom = dir === "s" || dir === "se" || dir === "sw";

	if (dir === "move") {
		x = Math.max(0, Math.min(window.innerWidth - base.w, base.x + dx));
		y = Math.max(0, Math.min(window.innerHeight - base.h, base.y + dy));
		return { x, y, w, h };
	}
	if (movesRight) w = Math.max(MIN_SIZE, Math.min(window.innerWidth - x, base.w + dx));
	if (movesBottom) h = Math.max(MIN_SIZE, Math.min(window.innerHeight - y, base.h + dy));
	if (movesLeft) {
		const nx = base.x + dx;
		const nw = base.w - dx;
		if (nw >= MIN_SIZE && nx >= 0) {
			x = nx;
			w = nw;
		} else if (nx < 0) {
			x = 0;
			w = base.x + base.w;
		} else {
			x = base.x + base.w - MIN_SIZE;
			w = MIN_SIZE;
		}
	}
	if (movesTop) {
		const ny = base.y + dy;
		const nh = base.h - dy;
		if (nh >= MIN_SIZE && ny >= 0) {
			y = ny;
			h = nh;
		} else if (ny < 0) {
			y = 0;
			h = base.y + base.h;
		} else {
			y = base.y + base.h - MIN_SIZE;
			h = MIN_SIZE;
		}
	}
	return { x, y, w, h };
}

export function ScreenshotPicker({ onCapture, onCancel }: Props) {
	const { t } = useTranslation();
	const [phase, setPhase] = useState<Phase>("selecting");
	const [rect, setRect] = useState<Rect>({ x: 0, y: 0, w: 0, h: 0 });
	const [isCapturing, setIsCapturing] = useState(false);

	const dragStart = useRef<Point | null>(null);
	const activeHandle = useRef<HandleDir | null>(null);
	const rectAtDragStart = useRef<Rect>({ x: 0, y: 0, w: 0, h: 0 });
	const rafId = useRef<number>(0);

	useEffect(() => {
		const onMove = (e: MouseEvent) => {
			if (!dragStart.current) return;
			cancelAnimationFrame(rafId.current);
			const cx = e.clientX;
			const cy = e.clientY;
			rafId.current = requestAnimationFrame(() => {
				if (!dragStart.current) return;
				const dx = cx - dragStart.current.x;
				const dy = cy - dragStart.current.y;
				if (phase === "selecting") {
					const x1 = dragStart.current.x;
					const y1 = dragStart.current.y;
					setRect({
						x: Math.min(x1, cx),
						y: Math.min(y1, cy),
						w: Math.abs(cx - x1),
						h: Math.abs(cy - y1)
					});
				} else if (activeHandle.current) {
					setRect(applyHandle(activeHandle.current, rectAtDragStart.current, dx, dy));
				}
			});
		};
		const onUp = (e: MouseEvent) => {
			cancelAnimationFrame(rafId.current);
			if (!dragStart.current) return;
			if (phase === "selecting") {
				const x1 = dragStart.current.x;
				const y1 = dragStart.current.y;
				const finalRect = {
					x: Math.min(x1, e.clientX),
					y: Math.min(y1, e.clientY),
					w: Math.abs(e.clientX - x1),
					h: Math.abs(e.clientY - y1)
				};
				if (finalRect.w >= MIN_SIZE && finalRect.h >= MIN_SIZE) {
					setRect(finalRect);
					setPhase("adjusting");
				}
			}
			dragStart.current = null;
			activeHandle.current = null;
		};
		window.addEventListener("mousemove", onMove);
		window.addEventListener("mouseup", onUp);
		return () => {
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("mouseup", onUp);
			cancelAnimationFrame(rafId.current);
		};
	}, [phase]);

	const startSelectionDrag = useCallback((e: React.MouseEvent) => {
		e.preventDefault();
		dragStart.current = { x: e.clientX, y: e.clientY };
	}, []);

	const startHandleDrag = useCallback(
		(e: React.MouseEvent, dir: HandleDir) => {
			e.preventDefault();
			e.stopPropagation();
			activeHandle.current = dir;
			dragStart.current = { x: e.clientX, y: e.clientY };
			rectAtDragStart.current = rect;
		},
		[rect]
	);

	const startMoveDrag = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			activeHandle.current = "move";
			dragStart.current = { x: e.clientX, y: e.clientY };
			rectAtDragStart.current = rect;
		},
		[rect]
	);

	const handleCapture = useCallback(async () => {
		setIsCapturing(true);
		// Hide the overlay before html2canvas reads computed styles so it is
		// excluded from the capture. ignoreElements alone is not reliable for
		// deeply-nested fixed children.
		const overlayEl = document.getElementById("screenshot-picker-overlay");
		if (overlayEl) overlayEl.style.visibility = "hidden";
		try {
			const dpr = window.devicePixelRatio || 1;
			const scrollX = window.scrollX;
			const scrollY = window.scrollY;
			const html2canvas = (await import("html2canvas")).default;
			const canvas = await html2canvas(document.body, {
				useCORS: true,
				scale: dpr,
				windowWidth: window.innerWidth,
				windowHeight: window.innerHeight,
				foreignObjectRendering: true,
				logging: false
			});

			// rect coords are in viewport (CSS px) space; add scroll offset to get
			// document coords, then scale by dpr to get canvas pixel coords.
			let cropX = Math.round((rect.x + scrollX) * dpr);
			let cropY = Math.round((rect.y + scrollY) * dpr);
			let cropW = Math.round(rect.w * dpr);
			let cropH = Math.round(rect.h * dpr);

			cropX = Math.max(0, Math.min(canvas.width - 1, cropX));
			cropY = Math.max(0, Math.min(canvas.height - 1, cropY));
			cropW = Math.min(cropW, canvas.width - cropX);
			cropH = Math.min(cropH, canvas.height - cropY);

			const cropped = document.createElement("canvas");
			cropped.width = cropW;
			cropped.height = cropH;
			cropped.getContext("2d")!.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

			let finalCanvas = cropped;
			if (cropW > MAX_OUTPUT_DIM || cropH > MAX_OUTPUT_DIM) {
				const scale = Math.min(MAX_OUTPUT_DIM / cropW, MAX_OUTPUT_DIM / cropH);
				const resized = document.createElement("canvas");
				resized.width = Math.round(cropW * scale);
				resized.height = Math.round(cropH * scale);
				resized.getContext("2d")!.drawImage(cropped, 0, 0, resized.width, resized.height);
				finalCanvas = resized;
			}

			onCapture(finalCanvas.toDataURL("image/jpeg", 0.82));
		} finally {
			if (overlayEl) overlayEl.style.visibility = "";
			setIsCapturing(false);
		}
	}, [rect, onCapture]);

	// Toolbar position: prefer below, fall back to above when near viewport bottom
	const toolbarBelow = rect.y + rect.h + 56 < window.innerHeight;
	const toolbarTop = toolbarBelow ? rect.y + rect.h + 10 : rect.y - 46;
	const toolbarLeft = Math.max(8, Math.min(window.innerWidth - 180, rect.x + rect.w / 2 - 88));

	const content = (
		<div id="screenshot-picker-overlay" className="fixed inset-0 z-[9999]">
			{phase === "selecting" ? (
				/* ── Phase 1: drag to draw selection ── */
				<div
					onMouseDown={startSelectionDrag}
					className="absolute inset-0 cursor-crosshair select-none"
					style={{ background: "rgba(0,0,0,0.48)" }}
				>
					{/* Instruction banner */}
					<div
						className="absolute top-5 left-1/2 -translate-x-1/2 rounded-lg px-[18px] py-2 text-gray-100 text-[13px] font-medium pointer-events-none whitespace-nowrap"
						style={{
							background: "rgba(13,17,23,0.92)",
							border: "1px solid rgba(6,182,212,0.45)",
							boxShadow: "0 4px 16px rgba(0,0,0,0.4)"
						}}
					>
						{t("feedback.screenshotInstruction")}
					</div>

					{/* Live selection preview while dragging */}
					{rect.w > 0 && rect.h > 0 && (
						<div
							className="absolute pointer-events-none box-border"
							style={{
								left: rect.x,
								top: rect.y,
								width: rect.w,
								height: rect.h,
								border: "2px solid #06b6d4",
								background: "rgba(6,182,212,0.08)"
							}}
						/>
					)}

					{/* Cancel */}
					<button
						type="button"
						onMouseDown={(e) => {
							e.stopPropagation();
							onCancel();
						}}
						className="absolute top-5 right-5 flex items-center gap-[5px] rounded-lg px-3 py-1.5 text-error text-[12px] cursor-pointer"
						style={{
							background: "rgba(13,17,23,0.92)",
							border: "1px solid rgba(248,113,113,0.35)"
						}}
					>
						<X size={12} aria-hidden="true" />
						{t("feedback.cancel")}
					</button>
				</div>
			) : (
				/* ── Phase 2: adjust the selection ── */
				<>
					{/* Four dark overlay strips */}
					<div
						className="absolute left-0 right-0 top-0 pointer-events-none"
						style={{ height: rect.y, background: "rgba(0,0,0,0.52)" }}
					/>
					<div
						className="absolute left-0 right-0 bottom-0 pointer-events-none"
						style={{ top: rect.y + rect.h, background: "rgba(0,0,0,0.52)" }}
					/>
					<div
						className="absolute top-0 pointer-events-none"
						style={{
							top: rect.y,
							left: 0,
							width: rect.x,
							height: rect.h,
							background: "rgba(0,0,0,0.52)"
						}}
					/>
					<div
						className="absolute pointer-events-none"
						style={{
							top: rect.y,
							left: rect.x + rect.w,
							right: 0,
							height: rect.h,
							background: "rgba(0,0,0,0.52)"
						}}
					/>

					{/* Selection border + move handle */}
					<div
						onMouseDown={startMoveDrag}
						className="absolute cursor-move box-border"
						style={{
							left: rect.x,
							top: rect.y,
							width: rect.w,
							height: rect.h,
							border: "2px solid #06b6d4",
							boxShadow: "0 0 0 1px rgba(6,182,212,0.3), inset 0 0 0 1px rgba(6,182,212,0.12)"
						}}
					/>

					{/* Resize handles */}
					{HANDLE_DEFS.map(({ dir, cursor, getPos }) => {
						const pos = getPos(rect);
						return (
							<div
								key={dir}
								onMouseDown={(e) => startHandleDrag(e, dir)}
								className="absolute rounded-sm z-[1]"
								style={{
									left: pos.x - HANDLE_SIZE / 2,
									top: pos.y - HANDLE_SIZE / 2,
									width: HANDLE_SIZE,
									height: HANDLE_SIZE,
									background: "#06b6d4",
									border: "1.5px solid rgba(255,255,255,0.85)",
									cursor
								}}
							/>
						);
					})}

					{/* Dimensions label */}
					<div
						className="absolute rounded px-[7px] py-[2px] text-gray-300 text-[11px] pointer-events-none select-none"
						style={{
							left: rect.x + 6,
							top: rect.y + 6,
							background: "rgba(13,17,23,0.82)",
							border: "1px solid rgba(6,182,212,0.3)"
						}}
					>
						{Math.round(rect.w)} × {Math.round(rect.h)}
					</div>

					{/* Confirm / Cancel toolbar */}
					<div
						className="absolute flex gap-2 rounded-[10px] px-2.5 py-1.5 select-none"
						style={{
							left: toolbarLeft,
							top: toolbarTop,
							background: "rgba(13,17,23,0.96)",
							border: "1px solid #2d3748",
							boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
						}}
					>
						<button
							type="button"
							onClick={onCancel}
							className="flex items-center gap-1 px-[11px] py-[5px] rounded-[6px] bg-transparent text-error text-[12px] cursor-pointer"
							style={{ border: "1px solid rgba(248,113,113,0.3)" }}
						>
							<X size={12} aria-hidden="true" />
							{t("feedback.cancel")}
						</button>
						<button
							type="button"
							onClick={handleCapture}
							disabled={isCapturing}
							className={`flex items-center gap-1 px-[11px] py-[5px] rounded-[6px] border-none text-white text-[12px] font-semibold transition-colors duration-150 ${
								isCapturing ? "cursor-wait bg-cyan-900" : "cursor-pointer bg-primary"
							}`}
						>
							<Check size={12} aria-hidden="true" />
							{isCapturing ? t("feedback.capturing") : t("feedback.captureBtn")}
						</button>
					</div>
				</>
			)}
		</div>
	);

	return createPortal(content, document.body);
}
