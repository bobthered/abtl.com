/** Owner-provided merchandise tag dimensions, in inches (length x width). */
export const merchandiseSizes = (
	[
		[1, 15 / 16, 5 / 8, '15/16', '5/8'],
		[2, 1 + 3 / 32, 3 / 4, '1-3/32', '3/4'],
		[3, 1 + 5 / 16, 7 / 8, '1-5/16', '7/8'],
		[4, 1 + 1 / 2, 15 / 16, '1-1/2', '15/16'],
		[5, 1 + 3 / 4, 1 + 3 / 32, '1-3/4', '1-3/32'],
		[6, 1 + 29 / 32, 1 + 1 / 4, '1-29/32', '1-1/4'],
		[7, 2 + 5 / 32, 1 + 7 / 16, '2-5/32', '1-7/16'],
		[8, 2 + 3 / 4, 1 + 11 / 16, '2-3/4', '1-11/16'],
		[9, 3 + 1 / 4, 1 + 15 / 16, '3-1/4', '1-15/16']
	] as const
).map(([number, length, width, lengthLabel, widthLabel]) => ({
	dimensions: `${lengthLabel}" x ${widthLabel}"`,
	length,
	number,
	width
}));

export type MerchandiseSize = (typeof merchandiseSizes)[number];
