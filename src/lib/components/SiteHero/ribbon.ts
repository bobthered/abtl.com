type Point = [number, number];

const point = (progress: number, across: number): Point => {
	const angle = progress * Math.PI * 2.15 - 0.7;
	return [
		650 + Math.sin(angle) * 235 + across * Math.cos(angle) * 170,
		-140 + progress * 1110 + across * Math.sin(angle) * 65
	];
};

/** A continuous twisted paper web; the same edge samples prevent gaps between surfaces. */
export const ribbonBand = (start: number, end: number) => {
	const edge = (across: number) =>
		Array.from({ length: 121 }, (_, index) => point(index / 120, across));
	return (
		[...edge(start), ...edge(end).reverse()]
			.map(([x, y], index) => `${index ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`)
			.join(' ') + 'Z'
	);
};
