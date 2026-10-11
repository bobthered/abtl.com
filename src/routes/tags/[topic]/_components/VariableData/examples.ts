import records from './examples.json';

const artwork = import.meta.glob<string>('/src/lib/assets/variable-data/*.svg', {
	eager: true,
	import: 'default',
	query: '?url'
});

export const variableExamples = records.map((record) => ({
	...record,
	barcode: artwork[`/src/lib/assets/variable-data/${record.id}-barcode.svg`],
	qr: artwork[`/src/lib/assets/variable-data/${record.id}-qr.svg`]
}));

export type VariableExample = (typeof variableExamples)[number];
