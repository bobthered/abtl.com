import { mkdir, writeFile } from 'node:fs/promises';

// Public-domain Natural Earth 1:110m land polygons. Keep the runtime asset local.
const source =
	'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson';
const response = await fetch(source);
if (!response.ok) throw new Error(`Land download failed: ${response.status}`);
const collection = await response.json();
const polygons = collection.features.flatMap(({ geometry }) =>
	geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates
);
const contains = ([x, y], ring) => {
	let isInside = false;
	for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
		const [xi, yi] = ring[i];
		const [xj, yj] = ring[j];
		if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) isInside = !isInside;
	}
	return isInside;
};
const points = [];
for (let latitude = -84; latitude <= 84; latitude += 2.4) {
	const step = 2.4 / Math.cos((latitude * Math.PI) / 180);
	for (let longitude = -180; longitude < 180; longitude += step) {
		if (
			polygons.some(
				([outer, ...holes]) =>
					contains([longitude, latitude], outer) &&
					!holes.some((hole) => contains([longitude, latitude], hole))
			)
		) {
			points.push([Number(latitude.toFixed(2)), Number(longitude.toFixed(2))]);
		}
	}
}
await mkdir('src/lib/components/ShippingGlobe', { recursive: true });
await writeFile('src/lib/components/ShippingGlobe/land.json', JSON.stringify(points) + '\n');
console.log(`Generated ${points.length} land dots.`);
