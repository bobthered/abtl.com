import land from './land.json';
import { shippingLocations } from './shippingLocations';

export const globePosition = (latitude: number, longitude: number, radius = 1) => {
	const lat = (latitude * Math.PI) / 180;
	const lon = (longitude * Math.PI) / 180;
	return [
		radius * Math.cos(lat) * Math.sin(lon),
		radius * Math.sin(lat),
		radius * Math.cos(lat) * Math.cos(lon)
	] as const;
};

// Fixed seeded jitter fills each original land sample's neighborhood without
// changing on re-renders or introducing per-frame randomization work.
export const continentPoints = land.flatMap(([latitude, longitude], index) => {
	let seed = Math.imul(index + 1, 0x9e3779b9) >>> 0;
	const random = () => {
		seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
		return seed / 4294967296;
	};
	const longitudeScale = Math.max(0.1, Math.cos((latitude * Math.PI) / 180));
	return Array.from({ length: 10 }, () => [
		Math.max(-89.9, Math.min(89.9, latitude + (random() - 0.5) * 2.4)),
		longitude + ((random() - 0.5) * 2.4) / longitudeScale
	]);
});

// A small SSR/no-WebGL illustration uses the same geography as the animated globe.
export const globeFallbackPath = continentPoints
	.flatMap(([lat, lon]) => {
		const [x, y, z] = globePosition(lat, lon + 65);
		if (z < 0) return [];
		return [`M${(150 + x * 124).toFixed(1)},${(150 - y * 124).toFixed(1)}h.02a.08,.08 0 1,0 0,.01`];
	})
	.join('');

// The lightweight fallback marks a representative subset from the same actual report.
export const shipmentFallbackPath = shippingLocations
	.flatMap((location) => {
		const [x, y, z] = globePosition(location.latitude, location.longitude + 65);
		if (z < 0) return [];
		const radius = 1.5;
		return [
			`M${(150 + x * 126 - radius).toFixed(1)},${(150 - y * 126).toFixed(1)}a${radius},${radius} 0 1,0 ${radius * 2},0a${radius},${radius} 0 1,0 ${-radius * 2},0`
		];
	})
	.join('');
