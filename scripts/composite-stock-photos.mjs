import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = new URL('../', import.meta.url);
const directory = new URL('src/lib/assets/tags/photos/', root);
const manifest = JSON.parse(await readFile(new URL('composites.json', directory), 'utf8'));
const palette = await readFile(new URL('src/routes/layout.css', root), 'utf8');
const paperSvg = await readFile(new URL('src/lib/assets/tag-shape.svg', root), 'utf8');
const patchSvg = await readFile(new URL('src/lib/assets/tag-patch.svg', root), 'utf8');
const stockSource = await readFile(
	new URL('src/lib/components/BentoSection/stockColors.ts', root),
	'utf8'
);

const extractPath = (svg) => {
	const path = svg.match(/<path\b[^>]*\bd="([^"]+)"/);
	assert.ok(path, 'The original SVG must contain its production path.');
	return path[1];
};

const paperPath = extractPath(paperSvg);
const patchPath = extractPath(patchSvg);
const stockIds = [
	...stockSource.split('export const stockColorGroups')[0].matchAll(/id: '([^']+)'/g)
].map((match) => match[1]);
assert.deepEqual(
	manifest.map((example) => example.id).sort(),
	stockIds.sort(),
	'Every stock must have exactly one composite.'
);
assert.match(paperSvg, /viewBox="0 0 237 474"/);
assert.match(patchSvg, /viewBox="0 0 48 57"/);
// Register the two supplied hole centers without rescaling or editing either path.
assert.ok(Math.abs(23.5975 + 94.1475 - 117.745) < 0.000001);
assert.ok(Math.abs(35.5338 + 0.057 - 35.5908) < 0.000001);

const width = 960;
const height = 720;
const transparent = { r: 0, g: 0, b: 0, alpha: 0 };
const rasterize = (body) =>
	sharp(
		Buffer.from(
			`<svg xmlns="http://www.w3.org/2000/svg" width="560" height="1120" viewBox="0 0 237 474">${body}</svg>`
		)
	)
		.png()
		.toBuffer();

for (const [index, example] of manifest.entries()) {
	const color = palette.match(new RegExp(`--color-tag-${example.id}:\\s*(#[0-9a-fA-F]{6})`))?.[1];
	assert.ok(color, `Missing stock token: ${example.id}`);
	const paper = await rasterize(`<path d="${paperPath}" fill="${color}" fill-rule="evenodd"/>`);
	const patch = await rasterize(
		`<path transform="translate(94.1475 0.057)" d="${patchPath}" fill="#AE621A" fill-rule="evenodd"/>`
	);
	// A subpixel contact shadow gives the .0008-inch patch a paper edge, not an eyelet rim.
	const patchShadow = await sharp(patch)
		.tint('#322419')
		.blur(0.3)
		.affine([1, 0, 0, 1], { odx: 0.35, ody: 0.5, background: transparent })
		.png()
		.toBuffer();
	const { data, info } = await sharp(paper)
		.composite([{ input: patchShadow }, { input: patch }])
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });
	// Deterministic grain/light affect RGB only. The exact SVG silhouette and hole alpha survive.
	let seed = index + 1;
	for (let y = 0; y < info.height; y += 1) {
		for (let x = 0; x < info.width; x += 1) {
			seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
			const grain = (seed / 4294967296 - 0.5) * 3;
			const light = 1 - 0.035 * (x / info.width) - 0.025 * (y / info.height);
			const offset = (y * info.width + x) * 4;
			for (let channel = 0; channel < 3; channel += 1) {
				data[offset + channel] = Math.min(255, Math.max(0, data[offset + channel] * light + grain));
			}
		}
	}
	const face = await sharp(data, { raw: info })
		.resize(280, 560)
		.rotate(example.rotation, { background: transparent })
		.png()
		.toBuffer();
	const faceInfo = await sharp(face).metadata();
	const left = Math.round((width - faceInfo.width) / 2);
	const top = Math.round((height - faceInfo.height) / 2);
	const shadow = await sharp(face).extractChannel('alpha').linear(0.32).raw().toBuffer();
	const shadowInfo = await sharp(face).metadata();
	const contactShadow = await sharp({
		create: {
			width: shadowInfo.width,
			height: shadowInfo.height,
			channels: 3,
			background: '#211b17'
		}
	})
		.joinChannel(shadow, {
			raw: { width: shadowInfo.width, height: shadowInfo.height, channels: 1 }
		})
		.extend({ top: 12, bottom: 12, left: 12, right: 12, background: transparent })
		.blur(2)
		.png()
		.toBuffer();
	const result = await sharp(fileURLToPath(new URL(`backgrounds/${example.scene}.webp`, directory)))
		.resize(width, height, { fit: 'cover' })
		.composite([
			{ input: contactShadow, left: left - 10, top: top - 9 },
			{ input: face, left, top }
		])
		.webp({ quality: 88 })
		.toBuffer();
	await writeFile(new URL(`${example.file}.webp`, directory), result);
}

console.log(`Rebuilt ${manifest.length} exact SVG composites at ${width} x ${height}.`);
