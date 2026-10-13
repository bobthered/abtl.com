import terrain from '../_data/new-york-terrain.json';

export type TerrainPoint = { x: number; y: number; elevation: number; radius: number };

const latitudeScale = 111.32;
const longitudeScale = latitudeScale * Math.cos((terrain.origin[1] * Math.PI) / 180);
const mapPoint = ([longitude, latitude, elevation]: number[], index: number): TerrainPoint => ({
	x: (longitude - terrain.origin[0]) * longitudeScale,
	y: (terrain.origin[1] - latitude) * latitudeScale,
	elevation: elevation - terrain.origin[2],
	radius: 0.46 + ((Math.imul(index + 1, 2654435761) >>> 0) / 4294967296) * 0.24
});
export const terrainPoints = terrain.points.map(mapPoint);
export const surroundingPoints = terrain.surroundings.map(mapPoint);

// Project a complete spherical Earth, looking toward Caledonia with a modest tilt.
// Data outside the detailed regional terrain uses sea-level radius, as on the shipping globe.
export const projectTerrain = (point: TerrainPoint, rotation: number, scale = 1) => {
	const latitude = ((terrain.origin[1] - point.y / latitudeScale) * Math.PI) / 180;
	const longitude = ((point.x / longitudeScale) * Math.PI) / 180;
	const centerLatitude = (terrain.origin[1] * Math.PI) / 180;
	const radius = 6371 + point.elevation * 0.03;
	const east = radius * Math.cos(latitude) * Math.sin(longitude);
	const north =
		radius *
		(Math.sin(latitude) * Math.cos(centerLatitude) -
			Math.cos(latitude) * Math.cos(longitude) * Math.sin(centerLatitude));
	const toward =
		radius *
		(Math.sin(latitude) * Math.sin(centerLatitude) +
			Math.cos(latitude) * Math.cos(longitude) * Math.cos(centerLatitude));
	const angle = (rotation * Math.PI) / 180;
	const x = east * Math.cos(angle) - north * Math.sin(angle);
	const vertical = east * Math.sin(angle) + north * Math.cos(angle);
	const tilt = (35 * Math.PI) / 180;
	const depth = toward * Math.cos(tilt) - vertical * Math.sin(tilt);
	return {
		x: 360 + x * scale,
		y: 260 + (-vertical * Math.cos(tilt) - (toward - 6371) * Math.sin(tilt)) * scale,
		depth,
		isVisible: depth > 0,
		radius: point.radius
	};
};

export const terrainScale = (rotation: number) => {
	let maxX = 1,
		maxY = 1;
	for (const point of terrainPoints) {
		const projected = projectTerrain(point, rotation);
		maxX = Math.max(maxX, Math.abs(projected.x - 360));
		maxY = Math.max(maxY, Math.abs(projected.y - 260));
	}
	return Math.min(336 / maxX, 224 / maxY);
};

// Great-circle distance keeps the fade geographic rather than tied to a screen rectangle.
export const terrainOpacity = (point: TerrainPoint) => {
	const latitude = ((terrain.origin[1] - point.y / latitudeScale) * Math.PI) / 180;
	const centerLatitude = (terrain.origin[1] * Math.PI) / 180;
	const longitude = ((point.x / longitudeScale) * Math.PI) / 180;
	const cosine =
		Math.sin(latitude) * Math.sin(centerLatitude) +
		Math.cos(latitude) * Math.cos(centerLatitude) * Math.cos(longitude);
	const distance = 6371 * Math.acos(Math.max(-1, Math.min(1, cosine)));
	const t = Math.min(1, distance / 550);
	return 1 - t * t * (3 - 2 * t);
};

export const terrainPaths = (rotation: number) => {
	const scale = terrainScale(rotation);
	// Quantize to 32 faint opacity steps to retain batching instead of one SVG node per dot.
	const buckets: string[][] = Array.from({ length: 64 }, () => []);
	const append = (points: TerrainPoint[], offset: number) => {
		for (const point of points) {
			const opacity = terrainOpacity(point);
			if (opacity < 0.015) continue;
			const { x, y, isVisible, radius } = projectTerrain(point, rotation, scale);
			if (!isVisible || x < -1 || x > 721 || y < -1 || y > 521) continue;
			const r = radius.toFixed(2);
			const bucket = Math.min(31, Math.floor(opacity * 32));
			buckets[offset + bucket].push(
				`M${(x - radius).toFixed(2)} ${y.toFixed(2)}a${r} ${r} 0 1 0 ${(radius * 2).toFixed(2)} 0a${r} ${r} 0 1 0 ${(-radius * 2).toFixed(2)} 0`
			);
		}
	};
	append(surroundingPoints, 0);
	append(terrainPoints, 32);
	return buckets
		.map((paths, index) => ({
			path: paths.join(''),
			opacity: (((index % 32) + 0.5) / 32) * 0.85,
			isNewYork: index >= 32
		}))
		.filter((layer) => layer.path.length > 0);
};
