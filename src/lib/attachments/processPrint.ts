import patchSvg from '#lib/assets/tag-patch.svg?raw';
import shapeSvg from '#lib/assets/tag-shape.svg?raw';

type Proof = { composite: HTMLCanvasElement; layers: HTMLCanvasElement[] };
const proofs = new Map<boolean, Proof>();

/** Build illustrative art and mathematical CMYK separations once per side, not per frame. */
const createProof = (isBack: boolean): Proof => {
	const cached = proofs.get(isBack);
	if (cached) return cached;
	const composite = document.createElement('canvas');
	composite.width = 237;
	composite.height = 474;
	const context = composite.getContext('2d')!;
	context.fillStyle = '#ffffff';
	context.fillRect(0, 0, 237, 474);
	context.textAlign = 'center';
	context.fillStyle = '#233f38';
	context.font = '22px Georgia, serif';
	context.fillText('ORANGERIE', 118.5, 102);
	context.font = '7px sans-serif';
	context.fillText('T H E   B O T A N I C A L   C O L L E C T I O N', 118.5, 119);
	const leaf = (x: number, y: number, angle: number, size: number, color: string) => {
		context.save();
		context.translate(x, y);
		context.rotate(angle);
		context.beginPath();
		context.moveTo(0, 0);
		context.bezierCurveTo(-size, -size * 0.9, -size * 0.25, -size * 1.9, 0, -size * 2.4);
		context.bezierCurveTo(size, -size * 1.2, size * 0.6, -size * 0.5, 0, 0);
		context.fillStyle = color;
		context.fill();
		context.strokeStyle = '#b4c09a';
		context.lineWidth = 0.6;
		context.beginPath();
		context.moveTo(0, 0);
		context.lineTo(0, -size * 2.1);
		context.stroke();
		context.restore();
	};
	if (isBack) {
		leaf(119, 202, -0.5, 24, '#48745b');
		leaf(119, 202, 0.65, 21, '#6a8f5a');
		context.fillStyle = '#233f38';
		context.font = '18px Georgia, serif';
		context.fillText('A little citrus.', 118.5, 248);
		context.fillText('A lasting impression.', 118.5, 272);
		context.font = '9px sans-serif';
		for (const [index, line] of [
			'Bright orange. Delicate blossom.',
			'A botanical fragrance imagined',
			'for the spaces you call home.'
		].entries()) {
			context.fillText(line, 118.5, 304 + index * 16);
		}
		context.font = '7px sans-serif';
		context.fillText('D I S C O V E R   T H E   C O L L E C T I O N', 118.5, 399);
	} else {
		context.strokeStyle = '#c8ccb2';
		context.lineWidth = 1;
		context.beginPath();
		context.roundRect(24, 143, 189, 244, [94, 94, 0, 0]);
		context.stroke();
		context.strokeStyle = '#5e7048';
		context.lineWidth = 3;
		context.beginPath();
		context.moveTo(62, 367);
		context.bezierCurveTo(133, 280, 81, 220, 165, 161);
		context.stroke();
		for (const [x, y, angle, size, color] of [
			[84, 333, -1.2, 25, '#325b47'],
			[105, 302, 0.9, 25, '#6e8d55'],
			[106, 270, -0.8, 27, '#274e43'],
			[111, 233, 0.9, 23, '#72965f'],
			[136, 195, -0.7, 19, '#3d6851']
		] as const)
			leaf(x, y, angle, size, color);
		for (const [x, y, radius] of [
			[146, 280, 39],
			[81, 221, 28]
		]) {
			const fruit = context.createRadialGradient(x - 12, y - 15, 2, x, y, radius);
			fruit.addColorStop(0, '#ffc256');
			fruit.addColorStop(0.6, '#ed8430');
			fruit.addColorStop(1, '#c94c28');
			context.fillStyle = fruit;
			context.beginPath();
			context.arc(x, y, radius, 0, Math.PI * 2);
			context.fill();
			leaf(x, y - radius + 6, 0.7, 8, '#325b47');
		}
		context.fillStyle = '#233f38';
		context.font = 'italic 19px Georgia, serif';
		context.fillText('Orange & blossom', 118.5, 418);
		context.font = '7px sans-serif';
		context.fillText('H O M E   F R A G R A N C E', 118.5, 438);
	}
	const pixels = context.getImageData(0, 0, 237, 474);
	const layers = Array.from({ length: 4 }, (_, channel) => {
		const layer = document.createElement('canvas');
		layer.width = 237;
		layer.height = 474;
		const target = layer.getContext('2d')!;
		const output = target.createImageData(237, 474);
		const colors = [
			[0, 255, 255],
			[255, 0, 255],
			[255, 255, 0],
			[0, 0, 0]
		];
		for (let offset = 0; offset < pixels.data.length; offset += 4) {
			const c = 1 - pixels.data[offset] / 255;
			const m = 1 - pixels.data[offset + 1] / 255;
			const y = 1 - pixels.data[offset + 2] / 255;
			const k = Math.min(c, m, y);
			const coverage = channel === 3 ? k : k === 1 ? 0 : ([c, m, y][channel] - k) / (1 - k);
			output.data.set([...colors[channel], Math.round(coverage * 255)], offset);
		}
		target.putImageData(output, 0, 0);
		return layer;
	});
	const proof = { composite, layers };
	proofs.set(isBack, proof);
	return proof;
};

/** Lightweight, event-driven registration and face/back animation. */
export const processPrint = (element: HTMLElement) => {
	const canvas = element.querySelector<HTMLCanvasElement>('canvas');
	const context = canvas?.getContext('2d');
	if (!canvas || !context) return;
	const preference = matchMedia('(prefers-reduced-motion: reduce)');
	const trigger = element.closest('a, button');
	const shape = new Path2D(shapeSvg.match(/\sd="([^"]+)"/)![1]);
	const patch = new Path2D(patchSvg.match(/\sd="([^"]+)"/)![1]);
	const stock = document.createElement('canvas');
	stock.width = 237;
	stock.height = 474;
	const stockContext = stock.getContext('2d')!;
	stockContext.fillStyle = '#ffffff';
	stockContext.fill(shape, 'evenodd');
	stockContext.translate(94.1475, 0.057);
	stockContext.fillStyle = '#ae621a';
	stockContext.fill(patch, 'evenodd');
	const surface = document.createElement('canvas');
	const surfaceContext = surface.getContext('2d')!;
	const sides = new Map<boolean, HTMLCanvasElement>();
	const textures = new WeakMap<HTMLCanvasElement, Uint8ClampedArray>();
	let channels = '1111';
	let flip = 0;
	let frame = 0;
	let height = 0;
	let isFocused = false;
	let isHovered = false;
	let isInView = false;
	let lastTime = 0;
	let spread = 1;
	let targetFlip = 0;
	let targetSpread = 1;
	let width = 0;
	const readState = () => {
		channels = element.dataset.printChannels ?? '1111';
		targetFlip = element.dataset.printBack === 'true' ? 1 : 0;
		targetSpread =
			element.dataset.printPreview === 'true'
				? isHovered || isFocused
					? 0
					: 1
				: element.dataset.printSeparated === 'true'
					? 1
					: 0;
	};
	const draw = () => {
		if (width <= 0 || height <= 0) return;
		context.clearRect(0, 0, width, height);
		const scale = Math.min(width / 460, height / 660);
		const yaw = ((35 * Math.PI) / 180) * spread;
		const roll = ((-5 * Math.PI) / 180) * spread;
		const layerGap = 80 * spread;
		// Keep transition sampling inexpensive on high-DPI screens; restore full detail at rest.
		const isSettled = spread === targetSpread && flip === targetFlip;
		const ratio = Math.min(canvas.width / width, isSettled ? 1.5 : 0.75);
		const surfaceWidth = Math.round(width * ratio);
		const surfaceHeight = Math.round(height * ratio);
		if (surface.width !== surfaceWidth || surface.height !== surfaceHeight) {
			surface.width = surfaceWidth;
			surface.height = surfaceHeight;
		}
		type Point = { x: number; y: number };
		const project = (x: number, y: number, distance: number): Point => {
			const centeredX = x - 118.5;
			const centeredY = y - 237;
			const centeredZ = distance - layerGap * 2;
			const rotatedX = Math.cos(yaw) * centeredX + Math.sin(yaw) * centeredZ;
			const depth = -Math.sin(yaw) * centeredX + Math.cos(yaw) * centeredZ;
			// A finite camera distance makes near planes larger and foreshortens each plane.
			const perspective = 1000 / (1000 - depth);
			return {
				x:
					width / 2 +
					(Math.cos(roll) * rotatedX - Math.sin(roll) * centeredY) *
						perspective *
						scale *
						Math.max(0.015, Math.abs(Math.cos(flip * Math.PI))),
				y:
					height / 2 +
					(Math.sin(roll) * rotatedX + Math.cos(roll) * centeredY) * perspective * scale
			};
		};
		const drawPlane = (source: HTMLCanvasElement, distance: number, isInk = false) => {
			// Registered artwork and face/back flips need no projective resampling.
			if (spread === 0) {
				context.save();
				context.globalCompositeOperation = isInk ? 'multiply' : 'source-over';
				context.translate(width / 2, height / 2);
				context.scale(scale * Math.max(0.015, Math.abs(Math.cos(flip * Math.PI))), scale);
				context.drawImage(source, -118.5, -237);
				context.restore();
				return;
			}
			let pixels = textures.get(source);
			if (!pixels) {
				pixels = source.getContext('2d')!.getImageData(0, 0, 237, 474).data;
				textures.set(source, pixels);
			}
			const corners = [
				[0, 0],
				[237, 0],
				[237, 474],
				[0, 474]
			].map(([x, y]) => project(x, y, distance));
			const left = Math.max(0, Math.floor(Math.min(...corners.map((point) => point.x)) * ratio));
			const top = Math.max(0, Math.floor(Math.min(...corners.map((point) => point.y)) * ratio));
			const right = Math.min(
				surface.width,
				Math.ceil(Math.max(...corners.map((point) => point.x)) * ratio)
			);
			const bottom = Math.min(
				surface.height,
				Math.ceil(Math.max(...corners.map((point) => point.y)) * ratio)
			);
			if (right <= left || bottom <= top) return;
			const output = surfaceContext.createImageData(right - left, bottom - top);
			const outputPixels = output.data;
			const z = distance - layerGap * 2;
			const cosineY = Math.cos(yaw);
			const sineY = Math.sin(yaw);
			const cosineZ = Math.cos(roll);
			const sineZ = Math.sin(roll);
			const flipScale = Math.max(0.015, Math.abs(Math.cos(flip * Math.PI)));
			// Inverse-project pixel centers directly onto the plane. Unlike an affine triangle
			// mesh, this preserves continuous texture sampling and transparent edges without seams.
			for (let row = top; row < bottom; row++) {
				const v = ((row + 0.5) / ratio - height / 2) / scale;
				for (let column = left; column < right; column++) {
					const u = ((column + 0.5) / ratio - width / 2) / (scale * flipScale);
					const horizontal = cosineZ * u + sineZ * v;
					const vertical = -sineZ * u + cosineZ * v;
					const x =
						(horizontal * (1000 - cosineY * z) - 1000 * sineY * z) /
						(1000 * cosineY - horizontal * sineY);
					const y = (vertical * (1000 + sineY * x - cosineY * z)) / 1000;
					const sourceX = x + 118;
					const sourceY = y + 236.5;
					const sampleX = Math.floor(sourceX);
					const sampleY = Math.floor(sourceY);
					if (sampleX < 0 || sampleX >= 236 || sampleY < 0 || sampleY >= 473) continue;
					const fractionX = sourceX - sampleX;
					const fractionY = sourceY - sampleY;
					const offsetA = (sampleY * 237 + sampleX) * 4;
					const offsetB = offsetA + 4;
					const offsetC = offsetA + 237 * 4;
					const offsetD = offsetC + 4;
					const weightA = (1 - fractionX) * (1 - fractionY) * pixels[offsetA + 3];
					const weightB = fractionX * (1 - fractionY) * pixels[offsetB + 3];
					const weightC = (1 - fractionX) * fractionY * pixels[offsetC + 3];
					const weightD = fractionX * fractionY * pixels[offsetD + 3];
					const alpha = weightA + weightB + weightC + weightD;
					if (alpha === 0) continue;
					const target = ((row - top) * output.width + column - left) * 4;
					for (let channel = 0; channel < 3; channel++) {
						outputPixels[target + channel] =
							(pixels[offsetA + channel] * weightA +
								pixels[offsetB + channel] * weightB +
								pixels[offsetC + channel] * weightC +
								pixels[offsetD + channel] * weightD) /
							alpha;
					}
					outputPixels[target + 3] = alpha;
				}
			}
			surfaceContext.clearRect(0, 0, surface.width, surface.height);
			surfaceContext.putImageData(output, left, top);
			context.save();
			context.globalCompositeOperation = isInk ? 'multiply' : 'source-over';
			if (!isInk) {
				context.shadowColor = 'rgba(10, 8, 12, 0.12)';
				context.shadowBlur = 18;
				context.shadowOffsetY = 8;
			}
			context.drawImage(surface, 0, 0, width, height);
			context.restore();
		};
		drawPlane(stock, 0);
		const proof = createProof(flip >= 0.5);
		if (element.dataset.printDuplex === 'true') {
			const isBack = flip >= 0.5;
			let side = sides.get(isBack);
			if (!side) {
				side = document.createElement('canvas');
				side.width = 237;
				side.height = 474;
				const sideContext = side.getContext('2d')!;
				sideContext.clip(shape, 'evenodd');
				sideContext.drawImage(proof.composite, 0, 0);
				sideContext.translate(94.1475, 0.057);
				sideContext.fillStyle = '#ae621a';
				sideContext.fill(patch, 'evenodd');
				sides.set(isBack, side);
			}
			drawPlane(side, 0);
		} else {
			for (let index = 0; index < 4; index++) {
				if (channels[index] !== '1') continue;
				drawPlane(proof.layers[index], (index + 1) * layerGap, true);
			}
		}
		element.dataset.printReady = 'true';
	};
	const animate = (time: number) => {
		const amount = Math.min(1, (lastTime ? time - lastTime : 16) / 100);
		lastTime = time;
		spread += (targetSpread - spread) * amount;
		flip += (targetFlip - flip) * amount;
		const isSettled =
			Math.abs(spread - targetSpread) < 0.001 && Math.abs(flip - targetFlip) < 0.001;
		if (isSettled) {
			spread = targetSpread;
			flip = targetFlip;
		}
		draw();
		if (isSettled) {
			frame = 0;
			element.dataset.printMotion = 'static';
		} else frame = requestAnimationFrame(animate);
	};
	const update = () => {
		cancelAnimationFrame(frame);
		frame = 0;
		lastTime = 0;
		readState();
		// Defer pixel separation until the artwork enters view, keeping it off the initial load path.
		if (!isInView) {
			element.dataset.printMotion = 'static';
			return;
		}
		if (preference.matches || document.hidden) {
			spread = targetSpread;
			flip = targetFlip;
			draw();
			element.dataset.printMotion = 'static';
		} else {
			element.dataset.printMotion = 'active';
			frame = requestAnimationFrame(animate);
		}
	};
	const resize = () => {
		const bounds = element.getBoundingClientRect();
		width = bounds.width;
		height = bounds.height;
		// Source artwork is 237px wide; higher densities add blending cost without more detail.
		const ratio = Math.min(devicePixelRatio || 1, 1.5);
		canvas.width = Math.round(width * ratio);
		canvas.height = Math.round(height * ratio);
		surface.width = canvas.width;
		surface.height = canvas.height;
		context.setTransform(ratio, 0, 0, ratio, 0, 0);
		update();
	};
	const enter = (event: Event) => {
		if ((event as PointerEvent).pointerType === 'touch') return;
		isHovered = true;
		update();
	};
	const leave = () => {
		isHovered = false;
		update();
	};
	const focus = () => {
		isFocused = trigger?.matches(':focus-visible') ?? false;
		update();
	};
	const blur = () => {
		isFocused = false;
		update();
	};
	const visibility = new IntersectionObserver(([entry]) => {
		isInView = entry.isIntersecting;
		update();
	});
	const size = new ResizeObserver(resize);
	const state = new MutationObserver(update);
	visibility.observe(element);
	size.observe(element);
	state.observe(element, {
		attributes: true,
		attributeFilter: ['data-print-back', 'data-print-separated', 'data-print-channels']
	});
	trigger?.addEventListener('pointerenter', enter);
	trigger?.addEventListener('pointerleave', leave);
	trigger?.addEventListener('focusin', focus);
	trigger?.addEventListener('focusout', blur);
	preference.addEventListener('change', update);
	document.addEventListener('visibilitychange', update);
	resize();
	return () => {
		cancelAnimationFrame(frame);
		visibility.disconnect();
		size.disconnect();
		state.disconnect();
		trigger?.removeEventListener('pointerenter', enter);
		trigger?.removeEventListener('pointerleave', leave);
		trigger?.removeEventListener('focusin', focus);
		trigger?.removeEventListener('focusout', blur);
		preference.removeEventListener('change', update);
		document.removeEventListener('visibilitychange', update);
	};
};
