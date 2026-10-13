import { mkdir, writeFile } from 'node:fs/promises';
import { terrainPaths } from './lib/terrain.ts';

// Run only when artwork changes. Never compile raw elevation data or rebuild paths in Vite/SSR.
const layers = terrainPaths(-18);
await mkdir('static/images/about', { recursive: true });
for (const isNewYork of [false, true]) {
	const paths = layers
		.filter((layer) => layer.isNewYork === isNewYork)
		.map((layer) => `<path fill="white" opacity="${layer.opacity}" d="${layer.path}"/>`)
		.join('');
	// Continuous elliptical fade reaches zero 16 SVG units inside every viewport edge.
	// Keep this on the point layers only; the Caledonia marker and captions stay crisp.
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 520" width="720" height="520"><defs><radialGradient id="edge" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1" gradientTransform="translate(360 260) scale(344 244)"><stop offset="0.6" stop-color="white"/><stop offset="0.8" stop-color="#aaaaaa"/><stop offset="1" stop-color="black"/></radialGradient><mask id="edge-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="720" height="520"><rect width="720" height="520" fill="url(#edge)"/></mask></defs><g mask="url(#edge-mask)">${paths}</g></svg>\n`;
	const name = isNewYork ? 'new-york' : 'world';
	await writeFile(`static/images/about/terrain-${name}.svg`, svg);
	console.log(`${name}: ${Buffer.byteLength(svg)} bytes`);
}
