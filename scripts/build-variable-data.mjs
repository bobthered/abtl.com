import bwipjs from 'bwip-js';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

// Build-time artwork only. No encoder is shipped to the browser.
const directory = new URL('../src/lib/assets/variable-data/', import.meta.url);
const examples = JSON.parse(
	await readFile(
		new URL('../src/lib/components/VariableData/examples.json', import.meta.url),
		'utf8'
	)
);
await mkdir(directory, { recursive: true });
for (const example of examples) {
	for (const [name, bcid] of [
		['barcode', 'code128'],
		['qr', 'qrcode']
	]) {
		const svg = bwipjs.toSVG({
			bcid,
			text: example.id,
			scale: 2,
			padding: name === 'qr' ? 4 : 10,
			...(name === 'barcode' ? { height: 10 } : {}),
			backgroundcolor: 'ffffff'
		});
		await writeFile(new URL(`${example.id}-${name}.svg`, directory), svg);
		if (example === examples[0] && name === 'qr') {
			// Reuse the encoded modules as themeable SVG primitives in the bento tile.
			const path = svg.match(/<path d="([^"]+)"/)?.[1];
			const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1];
			if (!path || !viewBox)
				throw new Error('QR encoder did not produce the expected SVG geometry');
			await writeFile(
				new URL('qr-modules.json', directory),
				JSON.stringify({ path, viewBox }, null, '\t') + '\n'
			);
		}
	}
}
