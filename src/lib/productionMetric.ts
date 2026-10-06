export type ProductionMetric = {
	asOf: string;
	tagsPerSecond: number;
	total: number;
};

// Supply a verified total, ISO timestamp, and average rate before displaying this estimate.
export const productionMetric: ProductionMetric | null = null;

export const estimateProduction = (metric: ProductionMetric, timestamp: number) => {
	const baseline = Date.parse(metric.asOf);
	if (
		!Number.isFinite(baseline) ||
		!Number.isFinite(metric.total) ||
		!Number.isFinite(metric.tagsPerSecond) ||
		metric.total < 0 ||
		metric.tagsPerSecond < 0
	)
		return null;
	return Math.floor(
		metric.total + (Math.max(0, timestamp - baseline) / 1000) * metric.tagsPerSecond
	);
};
