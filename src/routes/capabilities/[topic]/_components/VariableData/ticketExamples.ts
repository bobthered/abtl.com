import records from './ticketExamples.json';

const artwork = import.meta.glob<string>('./artwork/*.svg', {
	eager: true,
	import: 'default',
	query: '?url'
});

export const ticketExamples = records.map((record) => ({
	...record,
	barcode: artwork[`./artwork/${record.number}-${record.reference}-barcode.svg`],
	codes: Array.from({ length: record.pieces }, (_, index) => ({
		image: artwork[`./artwork/${record.number}-${record.reference}-${index + 1}.svg`],
		reference: `${record.reference}-${index + 1}`,
		y: 88 + index * 72
	})),
	masterCode: artwork[`./artwork/${record.number}-${record.reference}.svg`],
	qr: artwork[`./artwork/${record.number}-${record.reference}-qr.svg`]
}));

export type TicketExample = (typeof ticketExamples)[number];
