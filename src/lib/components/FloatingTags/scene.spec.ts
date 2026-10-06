import { createTags } from './scene';
import { describe, expect, it } from 'vitest';

describe('floating tag distribution', () => {
	it('spreads additional tags across the viewport instead of repeated anchors', () => {
		const tags = createTags(90).slice(9);
		const positions = tags.map((tag) => tag.position!);
		expect(new Set(positions.map(([x, y]) => `${x},${y}`)).size).toBe(tags.length);
		const regions = new Set(
			positions.map(([x, y]) => `${Math.floor(x / 25)},${Math.floor(y / 25)}`)
		);
		expect(regions.size).toBe(16);
		expect(new Set(tags.map((tag) => tag.color)).size).toBeGreaterThan(10);
	});

	it('preserves existing tags when the count increases and across repeated renders', () => {
		const initial = createTags(36);
		expect(createTags(360).slice(0, 36)).toEqual(initial);
		expect(createTags(36)).toEqual(initial);
		expect(new Set(createTags(360).map((tag) => tag.id)).size).toBe(360);
	});
});
