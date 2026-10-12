import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import featured from '#lib/data/shipments/featured.json';
import points from '#lib/data/shipments/points.json';
import review from '#lib/data/shipments/review.json';
import {
	internationalLocations,
	shipmentSummary,
	shippedStateCount,
	shippingLocations,
	stateRows
} from './shippingLocations';

test('generated orders reconcile with every source row and the original report total', () => {
	const source = readFileSync('shipments.csv');
	const rows = source
		.toString('utf8')
		.replace(/^\uFEFF/, '')
		.trim()
		.split(/\r?\n/)
		.slice(1)
		.map((row) => row.split('\t'));
	const totalRow = rows.find(([name]) => name === 'Grand Total')!;
	const destinationRows = rows.filter(([name]) => name !== 'Grand Total');
	expect(createHash('sha256').update(source).digest('hex')).toBe(review.sourceSha256);
	expect(shipmentSummary.orderCount).toBe(Number(totalRow[1]));
	expect(destinationRows.reduce((total, [, count]) => total + Number(count), 0)).toBe(
		shipmentSummary.orderCount
	);
	expect(destinationRows.length).toBe(shipmentSummary.sourceRows);
	expect(points.length).toBe(shipmentSummary.mappedDestinations);
	const mapped = points.reduce((total, [, , count]) => total + count, 0);
	const unresolved = review.unresolved.reduce((total, row) => total + row.orderCount, 0);
	expect(mapped).toBe(shipmentSummary.mappedOrderCount);
	expect(unresolved).toBe(shipmentSummary.unresolvedOrderCount);
	expect(mapped + unresolved).toBe(shipmentSummary.orderCount);
});

test('uses bounded actual destinations, geographic coordinates, and international order totals', () => {
	expect(shippingLocations.length).toBeLessThanOrEqual(32);
	expect(new Set(shippingLocations.map(({ id }) => id)).size).toBe(shippingLocations.length);
	expect(
		points.every(
			([lat, lon, orders]) =>
				Number.isFinite(lat) &&
				Math.abs(lat) <= 90 &&
				Number.isFinite(lon) &&
				Math.abs(lon) <= 180 &&
				Number.isInteger(orders) &&
				orders > 0
		)
	).toBe(true);
	expect(internationalLocations.map(({ country }) => country)).toEqual([
		'BM',
		'CA',
		'CH',
		'HK',
		'KY',
		'NL',
		'TC',
		'TT'
	]);
	expect(
		internationalLocations.every((location) => location.countryOrderCount >= location.orderCount)
	).toBe(true);
	expect(featured.international.find(({ country }) => country === 'CH')?.countryOrderCount).toBe(2);
	expect(shippedStateCount).toBe(50);
	expect(stateRows.flat().filter(Boolean).sort()).toEqual(
		Object.keys(shipmentSummary.stateOrderCounts).sort()
	);
});
