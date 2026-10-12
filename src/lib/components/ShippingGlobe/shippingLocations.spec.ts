import { expect, test } from 'vitest';
import featured from '#lib/data/shipments/featured.json';
import points from '#lib/data/shipments/points.json';
import review from '#lib/server/shipments/review.json';
import shipmentSummary from '#lib/server/shipments/summary.json';
import privatePoints from '#lib/server/shipments/points.json';
import {
	internationalLocations,
	shippedStateCount,
	shippingLocations,
	stateRows
} from './shippingLocations';

test('internal snapshot reconciles while public points contain only geography', () => {
	expect(points.length).toBe(shipmentSummary.mappedDestinations);
	expect(points).toEqual(privatePoints.map(([latitude, longitude]) => [latitude, longitude]));
	const mapped = privatePoints.reduce((total, [, , count]) => total + count, 0);
	const unresolved = review.unresolved.reduce((total, row) => total + row.orderCount, 0);
	expect(mapped).toBe(shipmentSummary.mappedOrderCount);
	expect(unresolved).toBe(shipmentSummary.unresolvedOrderCount);
	expect(mapped + unresolved).toBe(shipmentSummary.orderCount);
});

test('uses bounded destinations and exports no order counts to public datasets', () => {
	expect(shippingLocations.length).toBeLessThanOrEqual(32);
	expect(new Set(shippingLocations.map(({ id }) => id)).size).toBe(shippingLocations.length);
	expect(
		points.every(
			([lat, lon]) =>
				Number.isFinite(lat) && Math.abs(lat) <= 90 && Number.isFinite(lon) && Math.abs(lon) <= 180
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
	expect(points.every((point) => point.length === 2)).toBe(true);
	const allowedFields = ['country', 'countryName', 'id', 'latitude', 'longitude', 'name', 'state'];
	expect(
		[...featured.domestic, ...featured.international].every((location) =>
			Object.keys(location).every((key) => allowedFields.includes(key))
		)
	).toBe(true);
	expect(shippedStateCount).toBe(50);
	expect(stateRows.flat().filter(Boolean).sort()).toEqual(
		Object.keys(shipmentSummary.stateOrderCounts).sort()
	);
});
