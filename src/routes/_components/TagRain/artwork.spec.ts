import {
	chooseTagArtwork,
	createArtworkGeometry,
	createArtworkPairs,
	tagArtwork,
	tagArtworkPairs
} from './artwork';
import { createTagWorld } from './physics';
import { defaultRainSettings } from './settings';
import { expect, it } from 'vitest';

it('pairs the supplied designs by filename', () => {
	expect(tagArtworkPairs.length).toBeGreaterThan(0);
	for (const pair of tagArtworkPairs) {
		expect(pair.frontArtwork).toBeGreaterThanOrEqual(0);
		expect(pair.backArtwork).toBeGreaterThanOrEqual(0);
		expect(tagArtwork.fronts[pair.frontArtwork].split('/fronts/')[1]).toBe(
			tagArtwork.backs[pair.backArtwork].split('/backs/')[1]
		);
	}
});

it('chooses a whole pair even when fronts and backs have different file orders', () => {
	const fronts = ['a.svg', 'b.svg', 'c.svg'];
	const backs = ['c.svg', 'a.svg', 'b.svg'];
	const pairs = createArtworkPairs(fronts, backs);
	for (const [index, sample] of [0.1, 0.4, 0.8].entries()) {
		const selected = chooseTagArtwork(() => sample, pairs);
		expect(selected.frontArtwork).toBe(index);
		expect(fronts[selected.frontArtwork]).toBe(backs[selected.backArtwork]);
	}
});

it('leaves a missing matching side blank rather than borrowing unrelated artwork', () => {
	const pairs = createArtworkPairs(['front-only.svg'], ['back-only.svg']);
	expect(chooseTagArtwork(() => 0.1, pairs)).toEqual({ frontArtwork: -1, backArtwork: 0 });
	expect(chooseTagArtwork(() => 0.9, pairs)).toEqual({ frontArtwork: 0, backArtwork: -1 });
	expect(chooseTagArtwork(() => 0.5, [])).toEqual({ frontArtwork: -1, backArtwork: -1 });
});

it('retains each tag artwork selection through motion and resizing', async () => {
	const pairs = createArtworkPairs(['a.svg', 'b.svg', 'c.svg'], ['c.svg', 'a.svg', 'b.svg']);
	const simulation = await createTagWorld(12, 10.5, () => 0.7, defaultRainSettings, pairs);
	try {
		simulation.spawn();
		const tag = simulation.tags[0];
		expect(tag.frontArtwork).toBe(2);
		expect(tag.backArtwork).toBe(0);
		for (let index = 0; index < 60; index++) simulation.step();
		simulation.setWidth(8);
		expect(tag.frontArtwork).toBe(2);
		expect(tag.backArtwork).toBe(0);
	} finally {
		simulation.destroy();
	}
});

it('maps the supplied SVG viewBox to the clipped paper surface', () => {
	const geometry = createArtworkGeometry();
	try {
		const uv = geometry.getAttribute('uv');
		const u = Array.from({ length: uv.count }, (_, index) => uv.getX(index));
		const v = Array.from({ length: uv.count }, (_, index) => uv.getY(index));
		expect(Math.min(...u)).toBeCloseTo(0, 7);
		expect(Math.max(...u)).toBeCloseTo(236.749 / 237, 7);
		expect(Math.min(...v)).toBeCloseTo(1 - 473.751 / 474, 7);
		expect(Math.max(...v)).toBeCloseTo(1, 7);
	} finally {
		geometry.dispose();
	}
});
