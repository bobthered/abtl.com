import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

// Corners are measured clockwise on the 1368px-wide, EXIF-oriented source previews.
const extracts = [
	{
		source: 'IMG_2260.jpg',
		name: 'archive-wooden-nursery-tag',
		width: 800,
		height: 400,
		corners: [
			[850, 451],
			[1214, 457],
			[1212, 635],
			[848, 633]
		]
	},
	{
		source: 'IMG_2260.jpg',
		name: 'archive-horse-drawn-tag-wagon',
		width: 1000,
		height: 625,
		corners: [
			[274, 597],
			[778, 608],
			[775, 920],
			[270, 919]
		]
	},
	{
		source: 'IMG_2260.jpg',
		name: 'archive-industry-handshake',
		width: 1000,
		height: 750,
		corners: [
			[637, 1180],
			[1190, 1182],
			[1177, 1596],
			[645, 1583]
		]
	},
	{
		source: 'IMG_2261.jpg',
		name: 'archive-company-gathering',
		width: 900,
		height: 630,
		corners: [
			[623, 440],
			[1055, 456],
			[1052, 751],
			[619, 745]
		]
	}
];

// Solve the projective mapping from a flat output rectangle back to the photographed page.
const solve = (rows) => {
	for (let column = 0; column < 8; column++) {
		let pivot = column;
		for (let row = column + 1; row < 8; row++)
			if (Math.abs(rows[row][column]) > Math.abs(rows[pivot][column])) pivot = row;
		[rows[column], rows[pivot]] = [rows[pivot], rows[column]];
		const divisor = rows[column][column];
		if (Math.abs(divisor) < 1e-12) throw new Error('Degenerate crop quadrilateral');
		rows[column] = rows[column].map((value) => value / divisor);
		for (let row = 0; row < 8; row++) {
			if (row === column) continue;
			const factor = rows[row][column];
			rows[row] = rows[row].map((value, index) => value - factor * rows[column][index]);
		}
	}
	return rows.map((row) => row[8]);
};

await mkdir('static/images/about', { recursive: true });
for (const extract of extracts) {
	const { data, info } = await sharp(extract.source)
		.rotate()
		.removeAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });
	const scale = info.width / 1368;
	const corners = extract.corners.map(([x, y]) => [x * scale, y * scale]);
	const outputCorners = [
		[0, 0],
		[extract.width - 1, 0],
		[extract.width - 1, extract.height - 1],
		[0, extract.height - 1]
	];
	const rows = outputCorners.flatMap(([x, y], index) => {
		const [u, v] = corners[index];
		return [
			[x, y, 1, 0, 0, 0, -u * x, -u * y, u],
			[0, 0, 0, x, y, 1, -v * x, -v * y, v]
		];
	});
	const h = solve(rows);
	const output = Buffer.alloc(extract.width * extract.height * 3);
	for (let y = 0; y < extract.height; y++)
		for (let x = 0; x < extract.width; x++) {
			const denominator = h[6] * x + h[7] * y + 1;
			const u = (h[0] * x + h[1] * y + h[2]) / denominator;
			const v = (h[3] * x + h[4] * y + h[5]) / denominator;
			const left = Math.max(0, Math.min(info.width - 2, Math.floor(u)));
			const top = Math.max(0, Math.min(info.height - 2, Math.floor(v)));
			const dx = Math.max(0, Math.min(1, u - left));
			const dy = Math.max(0, Math.min(1, v - top));
			for (let channel = 0; channel < 3; channel++) {
				const at = (px, py) => data[(py * info.width + px) * info.channels + channel];
				output[(y * extract.width + x) * 3 + channel] = Math.round(
					at(left, top) * (1 - dx) * (1 - dy) +
						at(left + 1, top) * dx * (1 - dy) +
						at(left, top + 1) * (1 - dx) * dy +
						at(left + 1, top + 1) * dx * dy
				);
			}
		}
	const result = await sharp(output, {
		raw: { width: extract.width, height: extract.height, channels: 3 }
	})
		.webp({ quality: 88 })
		.toFile(`static/images/about/${extract.name}.webp`);
	console.log(`${extract.name}: ${result.width}x${result.height}, ${result.size} bytes`);
}
