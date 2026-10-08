import {
	defaultRainSettings,
	getVisualPatchThickness,
	getVisualThickness,
	normalizeRainSettings
} from './settings';
import { expect, it } from 'vitest';

it('clamps unsafe saved settings and restores invalid values to defaults', () => {
	const settings = normalizeRainSettings({ gravity: -20, tagsPerSecond: 1000, flutter: NaN });
	expect(settings.gravity).toBe(0);
	expect(settings.tagsPerSecond).toBe(100);
	expect(settings.flutter).toBe(defaultRainSettings.flutter);
	expect(settings.cameraZoom).toBe(3);
	expect(normalizeRainSettings({ cameraZoom: 0 }).cameraZoom).toBe(0.25);
	expect(normalizeRainSettings({ cameraZoom: 20 }).cameraZoom).toBe(3);
	expect(normalizeRainSettings({}).cleanupIntervalSeconds).toBe(30);
	expect(normalizeRainSettings({}).floorRemovalSeconds).toBe(2);
	expect(normalizeRainSettings({ floorRemovalSeconds: -1 }).floorRemovalSeconds).toBe(0.1);
	expect(normalizeRainSettings({ floorRemovalSeconds: 100 }).floorRemovalSeconds).toBe(60);
	expect(normalizeRainSettings({ cleanupIntervalSeconds: -1 }).cleanupIntervalSeconds).toBe(0);
	expect(normalizeRainSettings({ cleanupIntervalSeconds: 10000 }).cleanupIntervalSeconds).toBe(
		7200
	);
});

it('migrates minute preferences and adopts the 30-second default', () => {
	expect(normalizeRainSettings({ gustIntervalSeconds: 45 }).cleanupIntervalSeconds).toBe(45);
	expect(
		normalizeRainSettings({ gustIntervalSeconds: 45, cleanupIntervalSeconds: 20 })
			.cleanupIntervalSeconds
	).toBe(20);
	expect(normalizeRainSettings({ gustIntervalMinutes: 1 }).cleanupIntervalSeconds).toBe(30);
	expect(normalizeRainSettings({ gustIntervalMinutes: 0.1 }).cleanupIntervalSeconds).toBe(6);
	expect(normalizeRainSettings({ gustIntervalMinutes: 0 }).cleanupIntervalSeconds).toBe(0);
	expect(
		normalizeRainSettings({ gustIntervalMinutes: 2, cleanupIntervalSeconds: 30 })
			.cleanupIntervalSeconds
	).toBe(30);
	expect(normalizeRainSettings({ gustIntervalMinutes: 1 })).not.toHaveProperty(
		'gustIntervalMinutes'
	);
});

it('migrates saved preferences with default spread and clamps invalid spread values', () => {
	expect(normalizeRainSettings({ tagsPerSecond: 4 })).toMatchObject({
		dropSpreadX: 1,
		dropSpreadY: 1,
		tagsPerSecond: 4
	});
	expect(normalizeRainSettings({ dropSpreadX: -1, dropSpreadY: 100 })).toMatchObject({
		dropSpreadX: 0,
		dropSpreadY: 10
	});
	expect(normalizeRainSettings({ dropSpreadX: NaN, dropSpreadY: Infinity })).toMatchObject({
		dropSpreadX: 1,
		dropSpreadY: 1
	});
});

it('keeps physical stock thickness separate from its illustration scale', () => {
	const settings = { ...defaultRainSettings, thicknessInches: 0.0026, thicknessScale: 5 };
	expect(getVisualThickness(settings)).toBeCloseTo(getVisualThickness(defaultRainSettings), 10);
	expect(getVisualPatchThickness(defaultRainSettings)).toBeCloseTo((0.0008 / 2.625) * 10, 10);
	expect(getVisualPatchThickness(settings)).toBeCloseTo(
		getVisualPatchThickness(defaultRainSettings) / 2,
		10
	);
});

it('ignores the obsolete size setting in previously saved preferences', () => {
	const saved = { ...defaultRainSettings, sizeScale: 2 };
	expect(normalizeRainSettings(saved)).toEqual(defaultRainSettings);
	expect(normalizeRainSettings(saved)).not.toHaveProperty('sizeScale');
});
