/** Isometric stock-and-release illustration. No simulation or rendering dependency. */
export const warehouseFlow = (element: HTMLElement) => {
	const canvas = element.querySelector<HTMLCanvasElement>('canvas');
	const accent = element.querySelector<HTMLElement>('[data-warehouse-accent]');
	const context = canvas?.getContext('2d');
	if (!canvas || !accent || !context) return;
	const preference = matchMedia('(prefers-reduced-motion: reduce)');
	const trigger = element.closest('a, button');
	let elapsed = 0;
	let frame = 0;
	let height = 0;
	let isHovered = false;
	let isInView = false;
	let lastFrame = 0;
	let primary = '';
	let secondary = '';
	let ink = '';
	let stock = 24;
	let releasedCartons = 0;
	let releaseStarted = -Infinity;
	let width = 0;
	type Point = [number, number, number];
	const project = ([x, y, z]: Point) => [360 + (x - z) * 28, 320 + (x + z) * 12 - y * 34];
	const polygon = (points: Point[], color: string, alpha = 1) => {
		context.globalAlpha = alpha;
		context.fillStyle = color;
		context.beginPath();
		points.forEach((point, index) => {
			const [x, y] = project(point);
			if (index === 0) context.moveTo(x, y);
			else context.lineTo(x, y);
		});
		context.closePath();
		context.fill();
	};
	const line = (from: Point, to: Point, color: string, alpha = 1, weight = 2) => {
		context.globalAlpha = alpha;
		context.strokeStyle = color;
		context.lineWidth = weight;
		context.beginPath();
		context.moveTo(...(project(from) as [number, number]));
		context.lineTo(...(project(to) as [number, number]));
		context.stroke();
	};
	const carton = (x: number, y: number, z: number, color: string) => {
		const w = 1.05;
		const h = 0.85;
		const d = 0.85;
		polygon(
			[
				[x, y, z],
				[x + w, y, z],
				[x + w, y + h, z],
				[x, y + h, z]
			],
			color
		);
		polygon(
			[
				[x + w, y, z],
				[x + w, y, z - d],
				[x + w, y + h, z - d],
				[x + w, y + h, z]
			],
			color,
			0.65
		);
		polygon(
			[
				[x, y + h, z],
				[x + w, y + h, z],
				[x + w, y + h, z - d],
				[x, y + h, z - d]
			],
			color,
			0.4
		);
		line([x + 0.52, y + h, z], [x + 0.52, y + h, z - d], ink, 0.3, 2);
		polygon(
			[
				[x + 0.15, y + 0.22, z + 0.01],
				[x + 0.48, y + 0.22, z + 0.01],
				[x + 0.48, y + 0.54, z + 0.01],
				[x + 0.15, y + 0.54, z + 0.01]
			],
			'#ffffff',
			0.85
		);
	};
	const draw = () => {
		context.clearRect(0, 0, width, height);
		context.save();
		const scale = Math.min(width / 720, height / 430);
		context.translate((width - 720 * scale) / 2, (height - 430 * scale) / 2);
		context.scale(scale, scale);
		// A fine floor grid, rather than a filled backdrop, keeps the artwork transparent.
		for (let i = -8; i <= 8; i += 2) {
			line([i, 0, -3], [i, 0, 6], ink, 0.06, 1);
			line([-8, 0, i / 2], [8, 0, i / 2], ink, 0.06, 1);
		}
		for (const x of [-6.5, -2.2, 2.2, 6.5]) {
			line([x, 0, -1], [x, 6.5, -1], ink, 0.22, 3);
		}
		let index = 0;
		for (let level = 0; level < 3; level++) {
			const y = 0.6 + level * 1.9;
			polygon(
				[
					[-6.5, y, 1],
					[6.5, y, 1],
					[6.5, y, -1],
					[-6.5, y, -1]
				],
				ink,
				0.06
			);
			line([-6.5, y, 1], [6.5, y, 1], ink, 0.45, 3);
			for (let column = 0; column < 8; column++) {
				const x = -5.9 + column * 1.55;
				if (index < stock) carton(x, y + 0.06, 0.8, column % 3 === 0 ? secondary : primary);
				index++;
			}
		}
		for (const x of [-6.5, -2.2, 2.2, 6.5]) line([x, 0, 1], [x, 6.5, 1], ink, 0.5, 3);
		// Conveyor and traveling cartons: hover/focus runs a release in the tile.
		polygon(
			[
				[-7, 0.15, 5],
				[8, 0.15, 5],
				[8, 0.15, 3],
				[-7, 0.15, 3]
			],
			ink,
			0.05
		);
		line([-7, 0.15, 5], [8, 0.15, 5], ink, 0.2);
		for (let i = -7; i < 8; i++) line([i, 0.15, 3], [i, 0.15, 5], ink, 0.12, 1);
		const isPreview = element.dataset.warehousePreview === 'true';
		const progress = (elapsed - releaseStarted) / 2400;
		const isReleasing = isPreview || (progress >= 0 && progress < 1);
		if (isReleasing) {
			const count = isPreview ? 3 : releasedCartons;
			for (let i = 0; i < count; i++) {
				const phase = preference.matches
					? 0.4 + i * 0.18
					: isPreview
						? (elapsed / 6500 + i / 3) % 1
						: Math.max(0, Math.min(1, progress * 1.8 - i * 0.12));
				if (isPreview) carton(-7 + phase * 14, 0.2, 4.8, i === 1 ? secondary : primary);
				else {
					const slot = stock + i;
					const startX = -5.9 + (slot % 8) * 1.55;
					const startY = 0.66 + Math.floor(slot / 8) * 1.9;
					const lift = Math.min(1, phase / 0.4);
					const travel = Math.max(0, (phase - 0.4) / 0.6);
					carton(
						startX + (9 - startX) * travel,
						startY + (0.2 - startY) * lift,
						0.8 + lift * 4,
						(slot % 8) % 3 === 0 ? secondary : primary
					);
				}
			}
		}
		context.restore();
		context.globalAlpha = 1;
	};
	const animate = (time: number) => {
		if (!lastFrame || time - lastFrame >= 1000 / 30) {
			if (lastFrame) elapsed += Math.min(time - lastFrame, 100) * (isHovered ? 2.5 : 1);
			lastFrame = time;
			draw();
		}
		if (element.dataset.warehousePreview !== 'true' && elapsed - releaseStarted >= 2400) {
			element.dataset.warehouseMotion = 'static';
			frame = 0;
			return;
		}
		frame = requestAnimationFrame(animate);
	};
	const update = () => {
		cancelAnimationFrame(frame);
		lastFrame = 0;
		const isMoving =
			isInView &&
			!document.hidden &&
			!preference.matches &&
			(element.dataset.warehousePreview === 'true' || elapsed - releaseStarted < 2400);
		element.dataset.warehouseMotion = isMoving ? 'active' : 'static';
		draw();
		if (isMoving) frame = requestAnimationFrame(animate);
	};
	const resize = () => {
		const bounds = element.getBoundingClientRect();
		width = bounds.width;
		height = bounds.height;
		const ratio = Math.min(devicePixelRatio || 1, 2);
		canvas.width = Math.round(width * ratio);
		canvas.height = Math.round(height * ratio);
		context.setTransform(ratio, 0, 0, ratio, 0, 0);
		primary = getComputedStyle(canvas).color;
		secondary = getComputedStyle(accent).color;
		ink = getComputedStyle(element).color;
		update();
	};
	const enter = () => {
		isHovered = true;
	};
	const leave = () => {
		isHovered = false;
	};
	const visibility = new IntersectionObserver(([entry]) => {
		isInView = entry.isIntersecting;
		update();
	});
	const size = new ResizeObserver(resize);
	const theme = new MutationObserver(resize);
	const release = new MutationObserver(() => {
		const nextStock = Number(element.dataset.warehouseStock ?? 24);
		releasedCartons = Math.max(0, stock - nextStock);
		stock = nextStock;
		releaseStarted = releasedCartons > 0 ? elapsed : -Infinity;
		update();
	});
	stock = Number(element.dataset.warehouseStock ?? 24);
	visibility.observe(element);
	size.observe(element);
	theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
	release.observe(element, {
		attributes: true,
		attributeFilter: ['data-warehouse-release', 'data-warehouse-stock']
	});
	trigger?.addEventListener('pointerenter', enter);
	trigger?.addEventListener('pointerleave', leave);
	trigger?.addEventListener('focusin', enter);
	trigger?.addEventListener('focusout', leave);
	preference.addEventListener('change', update);
	document.addEventListener('visibilitychange', update);
	resize();
	return () => {
		cancelAnimationFrame(frame);
		visibility.disconnect();
		size.disconnect();
		theme.disconnect();
		release.disconnect();
		trigger?.removeEventListener('pointerenter', enter);
		trigger?.removeEventListener('pointerleave', leave);
		trigger?.removeEventListener('focusin', enter);
		trigger?.removeEventListener('focusout', leave);
		preference.removeEventListener('change', update);
		document.removeEventListener('visibilitychange', update);
	};
};
