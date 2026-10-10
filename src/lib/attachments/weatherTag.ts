import patchSvg from '#lib/assets/tag-patch.svg?raw';
import shapeSvg from '#lib/assets/tag-shape.svg?raw';

/** Art-directed wind and rain, using the supplied tag and patch paths. Not a material test. */
export const weatherTag = (element: HTMLElement) => {
	const canvas = element.querySelector<HTMLCanvasElement>('canvas');
	const accent = element.querySelector<HTMLElement>('[data-weather-accent]');
	const context = canvas?.getContext('2d');
	if (!canvas || !context || !accent) return;
	const preference = matchMedia('(prefers-reduced-motion: reduce)');
	const trigger = element.dataset.weatherPreview === 'true' ? element.closest('a, button') : null;
	const paper = new Path2D(shapeSvg.match(/\sd="([^"]+)"/)![1]);
	const patch = new Path2D(patchSvg.match(/\sd="([^"]+)"/)![1]);
	const texture = document.createElement('canvas');
	texture.width = 474;
	texture.height = 948;
	const ink = texture.getContext('2d')!;
	let elapsed = 0;
	let frame = 0;
	let height = 0;
	let isHovered = false;
	let isInView = false;
	let lastFrame = 0;
	let primary = '';
	let secondary = '';
	let storm = 0;
	let tetherColor = '';
	let width = 0;
	const makeTexture = () => {
		ink.clearRect(0, 0, 474, 948);
		ink.save();
		ink.scale(2, 2);
		const fill = ink.createLinearGradient(0, 0, 237, 474);
		fill.addColorStop(0, '#ffffff');
		fill.addColorStop(0.55, '#f7f8fb');
		fill.addColorStop(1, '#d9dee7');
		ink.fillStyle = fill;
		ink.fill(paper, 'evenodd');
		ink.save();
		ink.clip(paper, 'evenodd');
		// Subtle fibers are illustrative, not a reproduction of a particular stock grade.
		ink.strokeStyle = 'rgba(52,67,85,0.035)';
		ink.lineWidth = 0.5;
		for (let i = 0; i < 190; i++) {
			const x = (i * 79.7) % 237;
			const y = (i * 43.3) % 474;
			ink.beginPath();
			ink.moveTo(x, y);
			ink.lineTo(x + 14, y - 6);
			ink.stroke();
		}
		ink.fillStyle = primary;
		ink.fillRect(19, 86, 199, 5);
		ink.fillStyle = '#202d40';
		ink.textAlign = 'left';
		ink.font = '600 9px sans-serif';
		ink.fillText('ALLEN-BAILEY', 19, 116);
		ink.font = '600 29px sans-serif';
		ink.fillText('OUT IN', 19, 164);
		ink.fillText('THE OPEN.', 19, 198);
		ink.font = '9px sans-serif';
		ink.fillText('IDENTIFICATION THAT GOES TO WORK.', 19, 222);
		ink.strokeStyle = '#9aa5b3';
		ink.lineWidth = 0.7;
		for (let i = 0; i < 4; i++) {
			ink.beginPath();
			ink.moveTo(19, 260 + i * 30);
			ink.lineTo(218, 260 + i * 30);
			ink.stroke();
		}
		ink.font = '9px sans-serif';
		ink.fillText('EQUIPMENT / FIELD RECORD', 19, 251);
		ink.fillText('AB?026 / OUTDOOR', 19, 383);
		// A small illustrative barcode, not a production or scannable code.
		ink.fillStyle = '#202d40';
		for (let i = 0; i < 55; i++)
			if (i % 3 !== 1) ink.fillRect(19 + i * 3.6, 402, i % 2 ? 1 : 2, 27);
		ink.font = '600 10px sans-serif';
		ink.fillText((element.dataset.weatherMaterial ?? 'SYNTHETIC').toUpperCase(), 19, 453);
		ink.restore();
		ink.translate(94.1475, 0.057);
		ink.fillStyle = '#ae621a';
		ink.fill(patch, 'evenodd');
		ink.restore();
	};
	const draw = () => {
		if (!width || !height) return;
		context.clearRect(0, 0, width, height);
		const t = elapsed / 1000;
		const isReduced = preference.matches;
		const intensity = isReduced ? 0 : storm;
		// Tether point stays fixed; the tag rotates and flexes around its reinforced hole.
		const anchorX = width * 0.3;
		const anchorY = height * 0.1;
		const holeX = width * 0.4 + Math.sin(t * 2.8) * intensity * 6;
		const holeY = height * 0.27 + Math.cos(t * 3.3) * intensity * 3;
		const angle = isReduced
			? -0.18
			: -0.18 - intensity * 0.5 + Math.sin(t * (2.4 + intensity * 5)) * (0.045 + intensity * 0.16);
		const scale = Math.min(height * 0.63, width * 0.69, 310) / 474;
		const attachment = element.dataset.weatherAttachment ?? 'wire';
		const stroke = tetherColor;
		// Wind trails behind the tag, with a transparent canvas surface.
		context.strokeStyle = primary;
		context.lineWidth = 1;
		for (let i = 0; i < 7; i++) {
			const x = ((t * (35 + intensity * 130) + i * 83) % (width + 180)) - 120;
			const y = height * (0.2 + i * 0.105);
			context.globalAlpha = 0.04 + intensity * 0.08;
			context.beginPath();
			context.moveTo(x, y);
			context.bezierCurveTo(x + 28, y - 12, x + 78, y + 12, x + 115, y - 6);
			context.stroke();
		}
		context.globalAlpha = 1;
		// Anchor and tether are rendered in screen space so they never detach from the hole.
		context.strokeStyle = stroke;
		context.lineWidth = 1.2;
		context.globalAlpha = 0.5;
		context.beginPath();
		context.arc(anchorX, anchorY, 7, 0, Math.PI * 2);
		context.stroke();
		context.strokeStyle =
			attachment === 'elastic' ? primary : attachment === 'string' ? '#b89562' : stroke;
		context.lineWidth = attachment === 'wire' ? 1.2 : 2.6;
		const slack = attachment === 'wire' ? 12 : 23;
		for (let i = 0; i < 2; i++) {
			const offset = i * 3 - 1.5;
			context.beginPath();
			context.moveTo(anchorX + offset, anchorY + 6);
			context.bezierCurveTo(
				anchorX + slack + offset,
				anchorY + 28,
				holeX - slack + offset,
				holeY - 22,
				holeX + offset,
				holeY
			);
			context.stroke();
		}
		context.globalAlpha = 1;
		context.save();
		context.translate(holeX, holeY);
		context.rotate(angle);
		context.scale(scale, scale);
		context.translate(-117.745, -35.5908);
		// Narrow affine strips give the free end a gentle traveling bend without a cloth solver.
		const rows = 48;
		const rowHeight = 474 / rows;
		for (let row = 0; row < rows; row++) {
			const y = row * rowHeight;
			const u = Math.max(0, (y - 60) / 414);
			const bend = Math.sin(u * 4.2 - t * (5 + intensity * 10)) * u * u * (3 + intensity * 24);
			const twist = 1 - Math.sin(u * 3.2 + t * 4) ** 2 * u * intensity * 0.1;
			context.drawImage(
				texture,
				0,
				y * 2,
				474,
				(rowHeight + 1.5) * 2,
				bend + (237 * (1 - twist)) / 2,
				y,
				237 * twist,
				rowHeight + 1.5
			);
		}
		context.restore();
		context.strokeStyle = primary;
		context.lineWidth = 0.9;
		const drops = isReduced ? 22 : Math.round(30 + intensity * 105);
		for (let i = 0; i < drops; i++) {
			const phase = isReduced ? 0.37 : t * (0.28 + intensity * 0.8);
			const y = ((i * 0.618033 + phase) % 1) * (height + 70) - 35;
			const x = ((i * 0.754877 + phase * 0.65) % 1) * (width + 140) - 70;
			const length = 9 + intensity * 14 + (i % 4) * 2;
			context.globalAlpha = 0.1 + (i % 4) * 0.035 + intensity * 0.04;
			context.beginPath();
			context.moveTo(x, y);
			context.lineTo(x + length * (0.3 + intensity * 1.7), y + length);
			context.stroke();
		}
		// A few pale rain beads move across the face with the tag.
		context.save();
		context.translate(holeX, holeY);
		context.rotate(angle);
		context.scale(scale, scale);
		for (let i = 0; i < 8; i++) {
			const y = 65 + ((i * 51 + (isReduced ? 0 : t * 22)) % 290);
			context.globalAlpha = 0.65;
			context.fillStyle = '#ffffff';
			context.strokeStyle = secondary;
			context.lineWidth = 0.8;
			context.beginPath();
			context.ellipse(-80 + ((i * 37) % 160), y, 2.5, 5, 0.2, 0, Math.PI * 2);
			context.fill();
			context.globalAlpha = 0.2;
			context.stroke();
		}
		context.restore();
		context.globalAlpha = 1;
	};
	const animate = (time: number) => {
		if (!lastFrame || time - lastFrame >= 1000 / 30) {
			const delta = lastFrame ? Math.min(time - lastFrame, 80) : 0;
			elapsed += delta;
			lastFrame = time;
			const target = isHovered || element.dataset.weatherStorm === 'true' ? 1 : 0;
			storm += (target - storm) * (1 - Math.exp(-delta / 420));
			draw();
		}
		frame = requestAnimationFrame(animate);
	};
	const update = () => {
		cancelAnimationFrame(frame);
		lastFrame = 0;
		const isMoving = isInView && !document.hidden && !preference.matches;
		element.dataset.weatherMotion = isMoving ? 'active' : 'static';
		element.dataset.weatherIntensity =
			isHovered || element.dataset.weatherStorm === 'true' ? 'storm' : 'breeze';
		draw();
		if (isMoving) frame = requestAnimationFrame(animate);
	};
	const resize = () => {
		const bounds = element.getBoundingClientRect();
		width = bounds.width;
		height = bounds.height;
		const ratio = Math.min(devicePixelRatio || 1, 1.5);
		canvas.width = Math.round(width * ratio);
		canvas.height = Math.round(height * ratio);
		context.setTransform(ratio, 0, 0, ratio, 0, 0);
		tetherColor = getComputedStyle(element).color;
		primary = getComputedStyle(canvas).color;
		secondary = getComputedStyle(accent).color;
		makeTexture();
		element.dataset.weatherReady = 'true';
		update();
	};
	const enter = () => {
		isHovered = true;
		update();
	};
	const leave = () => {
		isHovered = false;
		update();
	};
	const visibility = new IntersectionObserver(([entry]) => {
		isInView = entry.isIntersecting;
		update();
	});
	const size = new ResizeObserver(resize);
	const theme = new MutationObserver(resize);
	const settings = new MutationObserver(() => {
		makeTexture();
		update();
	});
	visibility.observe(element);
	size.observe(element);
	theme.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ['data-theme', 'class']
	});
	settings.observe(element, {
		attributes: true,
		attributeFilter: ['data-weather-storm', 'data-weather-attachment', 'data-weather-material']
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
		settings.disconnect();
		trigger?.removeEventListener('pointerenter', enter);
		trigger?.removeEventListener('pointerleave', leave);
		trigger?.removeEventListener('focusin', enter);
		trigger?.removeEventListener('focusout', leave);
		preference.removeEventListener('change', update);
		document.removeEventListener('visibilitychange', update);
	};
};
