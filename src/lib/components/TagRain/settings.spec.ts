import { defaultRainSettings, getVisualThickness, normalizeRainSettings } from './settings';
import { expect, it } from 'vitest';

it('clamps unsafe saved settings and restores invalid values to defaults', () => {
	const settings = normalizeRainSettings({ gravity: -20, tagsPerSecond: 1000, flutter: NaN });
	expect(settings.gravity).toBe(0);
	expect(settings.tagsPerSecond).toBe(100);
	expect(settings.flutter).toBe(defaultRainSettings.flutter);
});

it('keeps physical stock thickness separate from its illustration scale', () => {
	const settings = { ...defaultRainSettings, thicknessInches: 0.0026, thicknessScale: 25 };
	expect(getVisualThickness(settings)).toBeCloseTo(getVisualThickness(defaultRainSettings), 10);
});
