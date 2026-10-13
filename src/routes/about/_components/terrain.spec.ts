import { describe, expect, it } from 'vitest';
import {
	projectTerrain,
	surroundingPoints,
	terrainPaths,
	terrainPoints,
	terrainScale
} from './terrain.js';

describe('New York terrain projection', () => {
	it('keeps Caledonia centered for every rotation', () => {
		for (const rotation of [-180, -45, 0, 45, 180]) {
			const projected = projectTerrain({ x: 0, y: 0, elevation: 0, radius: 1 }, rotation);
			expect(projected.x).toBe(360);
			expect(projected.y).toBe(260);
		}
	});
	it('uses geographic relief rather than a flat point plane', () => {
		expect(terrainPoints.length).toBeGreaterThan(10000);
		expect(Math.max(...terrainPoints.map((point) => point.elevation))).toBeGreaterThan(1000);
		const flat = projectTerrain({ x: 100, y: 100, elevation: 0, radius: 1 }, 0);
		const peak = projectTerrain({ x: 100, y: 100, elevation: 1000, radius: 1 }, 0);
		expect(peak.y).toBeLessThan(flat.y);
	});

	it('fits all New York points while culling the far hemisphere', () => {
		for (const rotation of [-18, 0, 90, 180]) {
			const scale = terrainScale(rotation);
			for (const point of terrainPoints) {
				const projected = projectTerrain(point, rotation, scale);
				expect(projected.x).toBeGreaterThanOrEqual(24);
				expect(projected.x).toBeLessThanOrEqual(696);
				expect(projected.y).toBeGreaterThanOrEqual(36);
				expect(projected.y).toBeLessThanOrEqual(484);
			}
		}
		expect(surroundingPoints.some((point) => !projectTerrain(point, 0).isVisible)).toBe(true);
	});
	it('batches world and New York into separate deterministic color paths', () => {
		const paths = terrainPaths(-18);
		expect(paths).toHaveLength(6);
		expect(paths.slice(0, 3).join('')).not.toBe('');
		expect(paths.slice(3).reduce((total, path) => total + (path.match(/M/g)?.length ?? 0), 0)).toBe(
			terrainPoints.length
		);
		expect(terrainPaths(-18)).toEqual(paths);
		expect(terrainPaths(0)).not.toEqual(paths);
	});
});
