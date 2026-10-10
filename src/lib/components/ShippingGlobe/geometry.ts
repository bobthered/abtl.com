import land from './land.json';

export const globePosition = (latitude: number, longitude: number, radius = 1) => {
	const lat = (latitude * Math.PI) / 180;
	const lon = (longitude * Math.PI) / 180;
	return [
		radius * Math.cos(lat) * Math.sin(lon),
		radius * Math.sin(lat),
		radius * Math.cos(lat) * Math.cos(lon)
	] as const;
};

// A small SSR/no-WebGL illustration uses the same geography as the animated globe.
export const globeFallbackPath = land
	.flatMap(([lat, lon]) => {
		const [x, y, z] = globePosition(lat, lon + 65);
		if (z < 0) return [];
		return [`M${(150 + x * 124).toFixed(1)},${(150 - y * 124).toFixed(1)}h.2a.8,.8 0 1,0 0,.1`];
	})
	.join('');
