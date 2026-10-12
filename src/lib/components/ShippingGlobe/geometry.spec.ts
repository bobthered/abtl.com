import { expect, test } from 'vitest';
import { continentPoints, globePosition } from './geometry';
import land from './land.json';

test('densifies land tenfold with bounded, nonuniform offsets on the globe', () => {
	expect(continentPoints).toHaveLength(land.length * 10);
	expect(new Set(continentPoints.map((point) => point.join(','))).size).toBe(
		continentPoints.length
	);
	continentPoints.forEach(([latitude, longitude], index) => {
		const [sourceLatitude, sourceLongitude] = land[Math.floor(index / 10)];
		expect(Math.abs(latitude - sourceLatitude)).toBeLessThanOrEqual(1.2);
		expect(Math.abs(longitude - sourceLongitude)).toBeLessThanOrEqual(12);
		const position = globePosition(latitude, longitude, 1.002);
		expect(Math.hypot(...position)).toBeCloseTo(1.002, 10);
	});
});
