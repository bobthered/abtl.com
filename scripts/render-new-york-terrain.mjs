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
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 520" width="720" height="520">${paths}</svg>\n`;
	const name = isNewYork ? 'new-york' : 'world';
	await writeFile(`static/images/about/terrain-${name}.svg`, svg);
	console.log(`${name}: ${Buffer.byteLength(svg)} bytes`);
}
