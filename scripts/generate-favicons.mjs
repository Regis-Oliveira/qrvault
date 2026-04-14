import sharp from "sharp"
import { readFileSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")
const svgPath = resolve(root, "public/favicon.svg")
const svg = readFileSync(svgPath)

const sizes = [
	{ file: "favicon-32.png", size: 32 },
	{ file: "favicon-192.png", size: 192 },
	{ file: "apple-touch-icon.png", size: 180 },
]

for (const { file, size } of sizes) {
	const out = resolve(root, "public", file)
	await sharp(svg).resize(size, size).png().toFile(out)
	console.log(`✓ public/${file} (${size}×${size})`)
}
