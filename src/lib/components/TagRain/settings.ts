import { productionProjection } from '#lib/productionMetric.js';

export const tagDimensionsInches = { height: 5.25, thickness: 0.0013, width: 2.625 };
export const patchThicknessInches = 0.0008;
export const tagsPerSecond =
	productionProjection.target /
	((productionProjection.endsAt - productionProjection.startsAt) / 1000);
export const settingControls = [
	{
		key: 'tagsPerSecond',
		label: 'Tags / second',
		min: 0,
		max: 100,
		step: 0.1,
		decimals: 2,
		unit: ''
	},
	{
		key: 'cameraZoom',
		label: 'Camera zoom',
		min: 0.25,
		max: 3,
		step: 0.05,
		decimals: 2,
		unit: 'x'
	},
	{ key: 'gravity', label: 'Gravity', min: 0, max: 30, step: 0.1, decimals: 1, unit: '' },
	{
		key: 'cleanupIntervalSeconds',
		label: 'Floor release interval',
		min: 0,
		max: 7200,
		step: 1,
		decimals: 0,
		unit: ' sec'
	},
	{
		key: 'floorRemovalSeconds',
		label: 'Floor removal period',
		min: 0.1,
		max: 60,
		step: 0.1,
		decimals: 1,
		unit: ' sec'
	},
	{
		key: 'bendStiffness',
		label: 'Bending stiffness',
		min: 1,
		max: 120,
		step: 1,
		decimals: 0,
		unit: ''
	},
	{
		key: 'thicknessInches',
		label: 'Stock thickness',
		min: 0.0001,
		max: 0.05,
		step: 0.0001,
		decimals: 4,
		unit: ' in'
	},
	{
		key: 'thicknessScale',
		label: 'Visual thickness scale',
		min: 1,
		max: 200,
		step: 1,
		decimals: 0,
		unit: 'x'
	},
	{ key: 'flutter', label: 'Flutter', min: 0, max: 5, step: 0.1, decimals: 1, unit: 'x' },
	{ key: 'airDrag', label: 'Air resistance', min: 0, max: 5, step: 0.1, decimals: 1, unit: 'x' },
	{ key: 'bounce', label: 'Bounce', min: 0, max: 1, step: 0.01, decimals: 2, unit: '' }
] as const;
export type TagRainSettings = Record<(typeof settingControls)[number]['key'], number>;
export const defaultRainSettings: TagRainSettings = {
	airDrag: 1,
	bendStiffness: 20,
	bounce: 0,
	cameraZoom: 3,
	flutter: 1,
	floorRemovalSeconds: 2,
	gravity: 3.2,
	cleanupIntervalSeconds: 30,
	tagsPerSecond,
	thicknessInches: tagDimensionsInches.thickness,
	thicknessScale: 10
};
export const normalizeRainSettings = (
	input: Partial<TagRainSettings> & { gustIntervalMinutes?: number; gustIntervalSeconds?: number }
): TagRainSettings => {
	const result = { ...defaultRainSettings };
	// Preserve saved gust timing when migrating to floor releases.
	if (input.cleanupIntervalSeconds === undefined && Number.isFinite(input.gustIntervalSeconds))
		result.cleanupIntervalSeconds = Math.min(7200, Math.max(0, input.gustIntervalSeconds!));
	const legacyInterval = input.gustIntervalMinutes;
	if (
		input.cleanupIntervalSeconds === undefined &&
		input.gustIntervalSeconds === undefined &&
		typeof legacyInterval === 'number' &&
		Number.isFinite(legacyInterval) &&
		legacyInterval !== 1
	)
		result.cleanupIntervalSeconds = Math.min(7200, Math.max(0, legacyInterval * 60));
	for (const control of settingControls) {
		const value = input[control.key];
		if (typeof value === 'number' && Number.isFinite(value))
			result[control.key] = Math.min(control.max, Math.max(control.min, value));
	}
	return result;
};
export const getVisualThickness = (settings: TagRainSettings) =>
	(settings.thicknessInches / tagDimensionsInches.width) * settings.thicknessScale;
export const getVisualPatchThickness = (settings: TagRainSettings) =>
	(patchThicknessInches / tagDimensionsInches.width) * settings.thicknessScale;
