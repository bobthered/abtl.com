import { mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

// Generate a local decorative point cloud from real geography/elevation, not procedural hills.
const boundarySource =
	'https://gisservices.its.ny.gov/arcgis/rest/services/NYS_Civil_Boundaries/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&maxAllowableOffset=0.005&f=geojson';
const landSource =
	'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_land.geojson';
const lakeSource =
	'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_lakes.geojson';
const download = async (url) => {
	const response = await fetch(url);
	if (!response.ok) throw new Error(`Download failed: ${response.status} ${url}`);
	return response;
};
const [boundary, land, lakes] = await Promise.all(
	[boundarySource, landSource, lakeSource].map(async (url) => (await download(url)).json())
);
const polygons = (collection) =>
	collection.features
		.flatMap(({ geometry }) =>
			geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates
		)
		.map((rings) => {
			const positions = rings.flat();
			return {
				rings,
				minX: Math.min(...positions.map((p) => p[0])),
				maxX: Math.max(...positions.map((p) => p[0])),
				minY: Math.min(...positions.map((p) => p[1])),
				maxY: Math.max(...positions.map((p) => p[1]))
			};
		})
		.filter((p) => p.maxX >= -85 && p.minX <= -68 && p.maxY >= 38 && p.minY <= 48);
const containsRing = (x, y, ring) => {
	let isInside = false;
	for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
		const [xi, yi] = ring[i],
			[xj, yj] = ring[j];
		if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) isInside = !isInside;
	}
	return isInside;
};
const contains = (x, y, items) =>
	items.some(
		(p) =>
			x >= p.minX &&
			x <= p.maxX &&
			y >= p.minY &&
			y <= p.maxY &&
			containsRing(x, y, p.rings[0]) &&
			!p.rings.slice(1).some((ring) => containsRing(x, y, ring))
	);
const ny = polygons(boundary),
	earth = polygons(land),
	water = polygons(lakes);
let seed = 1911;
const random = () => {
	seed = (Math.imul(1664525, seed) + 1013904223) >>> 0;
	return seed / 4294967296;
};
const points = [];
for (let latitude = 40.5; latitude < 45.05; latitude += 0.025) {
	for (let longitude = -79.78; longitude < -71.85; longitude += 0.034) {
		const lat = latitude + (random() - 0.5) * 0.024,
			lon = longitude + (random() - 0.5) * 0.033;
		if (contains(lon, lat, ny) && contains(lon, lat, earth) && !contains(lon, lat, water))
			points.push([lon, lat]);
	}
}
// Dense surrounding land maintains continuity at the New York zoom level.
const surroundings = [];
for (let latitude = 38; latitude < 48; latitude += 0.045) {
	for (let longitude = -85; longitude < -68; longitude += 0.061) {
		const lat = latitude + (random() - 0.5) * 0.044,
			lon = longitude + (random() - 0.5) * 0.06;
		if (!contains(lon, lat, ny) && contains(lon, lat, earth) && !contains(lon, lat, water))
			surroundings.push([lon, lat]);
	}
}
const tilePosition = (lon, lat) => [
	((lon + 180) / 360) * 256,
	((1 - Math.asinh(Math.tan((lat * Math.PI) / 180)) / Math.PI) / 2) * 256
];
const origin = [-77.8528, 42.9731];
const tiles = new Map();
for (const [lon, lat] of [...points, ...surroundings, origin]) {
	const [x, y] = tilePosition(lon, lat);
	tiles.set(`${Math.floor(x)}/${Math.floor(y)}`, null);
}
const keys = [...tiles.keys()];
for (let i = 0; i < keys.length; i += 4) {
	await Promise.all(
		keys.slice(i, i + 4).map(async (key) => {
			const response = await download(
				`https://elevation-tiles-prod.s3.amazonaws.com/terrarium/8/${key}.png`
			);
			const tile = await sharp(Buffer.from(await response.arrayBuffer()))
				.removeAlpha()
				.raw()
				.toBuffer({ resolveWithObject: true });
			tiles.set(key, tile);
		})
	);
}
const elevation = (lon, lat) => {
	const [x, y] = tilePosition(lon, lat),
		{ data, info } = tiles.get(`${Math.floor(x)}/${Math.floor(y)}`);
	const offset =
		(Math.min(255, Math.floor((y % 1) * 256)) * info.width +
			Math.min(255, Math.floor((x % 1) * 256))) *
		info.channels;
	return Math.round(data[offset] * 256 + data[offset + 1] + data[offset + 2] / 256 - 32768);
};
// The existing Natural Earth globe samples cover the rest of the planet.
const globalLand = JSON.parse(await readFile('src/lib/components/ShippingGlobe/land.json', 'utf8'));
const world = globalLand
	.filter(([lat, lon]) => !(lon >= -85 && lon <= -68 && lat >= 38 && lat <= 48))
	.flatMap(([lat, lon]) =>
		Array.from({ length: 10 }, () => [
			lon + ((random() - 0.5) * 2.4) / Math.max(0.1, Math.cos((lat * Math.PI) / 180)),
			Math.max(-89.9, Math.min(89.9, lat + (random() - 0.5) * 2.4)),
			0
		])
	);
const output = {
	origin: [...origin, elevation(...origin)],
	surroundings: [
		...surroundings.map(([lon, lat]) => [
			Number(lon.toFixed(5)),
			Number(lat.toFixed(5)),
			elevation(lon, lat)
		]),
		...world
	],
	points: points.map(([lon, lat]) => [
		Number(lon.toFixed(5)),
		Number(lat.toFixed(5)),
		elevation(lon, lat)
	])
};
if (output.points.length < 10000 || Math.max(...output.points.map((p) => p[2])) < 1200)
	throw new Error('Terrain validation failed');
await mkdir('scripts/data', { recursive: true });
await writeFile('scripts/data/new-york-terrain.json', JSON.stringify(output) + '\n');
console.log(
	`${points.length} terrain points from ${tiles.size} elevation tiles; Caledonia ${output.origin[2]}m`
);

await import('./render-new-york-terrain.mjs');
