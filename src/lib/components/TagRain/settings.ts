import { productionProjection } from '#lib/productionMetric.js';

export const tagDimensionsInches = { height: 5.25, thickness: 0.0013, width: 2.625 };
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
	{ key: 'sizeScale', label: 'Tag size', min: 0.25, max: 2, step: 0.05, decimals: 2, unit: 'x' },
	{ key: 'flutter', label: 'Flutter', min: 0, max: 5, step: 0.1, decimals: 1, unit: 'x' },
	{ key: 'airDrag', label: 'Air resistance', min: 0, max: 5, step: 0.1, decimals: 1, unit: 'x' },
	{ key: 'bounce', label: 'Bounce', min: 0, max: 1, step: 0.01, decimals: 2, unit: '' }
] as const;
export type TagRainSettings = Record<(typeof settingControls)[number]['key'], number>;
export const defaultRainSettings: TagRainSettings = {
	airDrag: 1,
	bounce: 0.02,
	cameraZoom: 1,
	flutter: 1,
	gravity: 3.2,
	sizeScale: 1,
	tagsPerSecond,
	thicknessInches: tagDimensionsInches.thickness,
	thicknessScale: 50
};
export const normalizeRainSettings = (input: Partial<TagRainSettings>): TagRainSettings => {
	const result = { ...defaultRainSettings };
	for (const control of settingControls) {
		const value = input[control.key];
		if (typeof value === 'number' && Number.isFinite(value))
			result[control.key] = Math.min(control.max, Math.max(control.min, value));
	}
	return result;
};
export const getVisualThickness = (settings: TagRainSettings) =>
	(settings.thicknessInches / tagDimensionsInches.width) * settings.thicknessScale;
