import { describe, expect, it } from 'vitest';
import sharp from 'sharp';
import {
	projectTerrain,
	surroundingPoints,
	terrainOpacity,
	terrainPaths,
	terrainPoints,
	terrainScale
} from '../../../../scripts/lib/terrain.js';

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
		// Relief should be obvious, not merely a subpixel displacement.
		expect(flat.y - peak.y).toBeGreaterThan(100);
	});

	it('fits all New York points while culling the far hemisphere', () => {
		for (const rotation of [-18, 0, 90, 180]) {
			const scale = terrainScale(rotation);
			for (const point of terrainPoints) {
				const projected = projectTerrain(point, rotation, scale);
				expect(projected.x).toBeGreaterThanOrEqual(24 - 1e-8);
				expect(projected.x).toBeLessThanOrEqual(696 + 1e-8);
				expect(projected.y).toBeGreaterThanOrEqual(36 - 1e-8);
				expect(projected.y).toBeLessThanOrEqual(484 + 1e-8);
			}
		}
		expect(surroundingPoints.some((point) => !projectTerrain(point, 0).isVisible)).toBe(true);
	});

	it('fades monotonically with geographic distance and vanishes before the regional seam', () => {
		const opacity = (x: number) => terrainOpacity({ x, y: 0, elevation: 0, radius: 1 });
		expect(opacity(0)).toBeCloseTo(1);
		expect(opacity(100)).toBeGreaterThan(opacity(300));
		expect(opacity(300)).toBeGreaterThan(opacity(500));
		expect(opacity(600)).toBe(0);
	});
	it('batches both colors into deterministic distance-opacity paths', () => {
		const paths = terrainPaths(-18);
		expect(paths.some((layer) => layer.isNewYork)).toBe(true);
		expect(paths.some((layer) => !layer.isNewYork)).toBe(true);
		expect(Math.min(...paths.map((layer) => layer.opacity))).toBeLessThan(0.05);
		expect(Math.max(...paths.map((layer) => layer.opacity))).toBeGreaterThan(0.8);
		expect(terrainPaths(-18)).toEqual(paths);
	});
});

it.each(['world', 'new-york'])(
	'%s point asset is completely transparent around every edge',
	async (name) => {
		const { data, info } = await sharp(`static/images/about/terrain-${name}.svg`)
			.ensureAlpha()
			.raw()
			.toBuffer({ resolveWithObject: true });
		let edgeAlpha = 0;
		let centerAlpha = 0;
		for (let y = 0; y < info.height; y++) {
			for (let x = 0; x < info.width; x++) {
				const alpha = data[(y * info.width + x) * info.channels + 3];
				if (x < 12 || x >= info.width - 12 || y < 12 || y >= info.height - 12)
					edgeAlpha = Math.max(edgeAlpha, alpha);
				else centerAlpha = Math.max(centerAlpha, alpha);
			}
		}
		expect(edgeAlpha).toBe(0);
		expect(centerAlpha).toBeGreaterThan(100);
	}
);
