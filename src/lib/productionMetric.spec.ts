import { estimateAnnualProduction, productionProjection } from './productionMetric';
import { expect, it } from 'vitest';

it('starts at zero and caps the estimate at the December 31 target', () => {
	expect(estimateAnnualProduction(productionProjection.startsAt - 1)).toBe(0);
	expect(estimateAnnualProduction(productionProjection.startsAt)).toBe(0);
	expect(estimateAnnualProduction(productionProjection.endsAt)).toBe(90_000_000);
	expect(estimateAnnualProduction(Date.parse('2027-01-02T00:00:00-05:00'))).toBe(90_000_000);
});

it('estimates the October 6 total and advances at the annual rate', () => {
	const timestamp = Date.parse('2026-10-06T00:00:00-04:00');
	expect(estimateAnnualProduction(timestamp)).toBe(68_537_673);
	const difference =
		estimateAnnualProduction(timestamp + 60_000)! - estimateAnnualProduction(timestamp)!;
	expect(difference).toBeGreaterThanOrEqual(171);
	expect(difference).toBeLessThanOrEqual(172);
});

it('rejects invalid timestamps', () => {
	expect(estimateAnnualProduction(NaN)).toBeNull();
	expect(estimateAnnualProduction(Infinity)).toBeNull();
});
