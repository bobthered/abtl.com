// Verified by the company's production report for the last year.
export const annualTagProductionTotal = 90_403_211;

// Illustrative calendar-year pace, not a live production feed. Dates use Eastern Time.
export const productionProjection = {
	endsAt: Date.parse('2026-12-31T23:59:59-05:00'),
	startsAt: Date.parse('2026-01-01T00:00:00-05:00'),
	target: 90_000_000,
	year: 2026
};

export const estimateAnnualProduction = (timestamp: number) => {
	if (!Number.isFinite(timestamp)) return null;
	const { endsAt, startsAt, target } = productionProjection;
	const progress = Math.min(1, Math.max(0, (timestamp - startsAt) / (endsAt - startsAt)));
	return Math.floor(target * progress);
};
