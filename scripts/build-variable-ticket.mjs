import bwipjs from 'bwip-js';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

// Encode at build time: the browser only loads SVG assets.
const directory = new URL(
	'../src/routes/capabilities/[topic]/_components/VariableData/',
	import.meta.url
);
const records = JSON.parse(await readFile(new URL('ticketExamples.json', directory), 'utf8'));
await mkdir(new URL('artwork/', directory), { recursive: true });
for (const record of records) {
	for (const [name, bcid] of [
		['barcode', 'code128'],
		['qr', 'qrcode']
	]) {
		const svg = bwipjs.toSVG({
			bcid,
			text: `${record.number}/${record.reference}`,
			scale: 2,
			padding: name === 'qr' ? 4 : 10,
			...(name === 'barcode' ? { height: 10 } : {}),
			backgroundcolor: 'ffffff'
		});
		await writeFile(
			new URL(`artwork/${record.number}-${record.reference}-${name}.svg`, directory),
			svg
		);
	}

	for (let piece = 0; piece <= record.pieces; piece++) {
		const reference = piece ? `${record.reference}-${piece}` : record.reference;
		const svg = bwipjs.toSVG({
			bcid: 'datamatrix',
			text: `${record.number}/${reference}`,
			scale: 2,
			padding: 2,
			backgroundcolor: 'ffffff'
		});
		await writeFile(new URL(`artwork/${record.number}-${reference}.svg`, directory), svg);
	}
}
