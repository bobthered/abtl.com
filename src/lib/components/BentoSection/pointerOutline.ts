/** Draw only the perimeter near the pointer; leave layout and focus styling to the theme. */
export const initializePointerOutlines = (section: HTMLElement | null) => {
	const cleanups = Array.from(
		section?.querySelectorAll<HTMLElement>('[data-bento-topic]') ?? []
	).map((tile) => {
		const canvas = tile.querySelector<HTMLCanvasElement>('[data-bento-outline]');
		const surface = tile.querySelector<HTMLElement>('[data-bento-surface]');
		if (!canvas || !surface) return () => {};
		const context = canvas.getContext('2d');
		if (!context) return () => {};
		let frame = 0;
		let pointer: { x: number; y: number } | null = null;

		const draw = () => {
			frame = 0;
			if (!pointer) return;
			const bounds = surface.getBoundingClientRect();
			const ratio = Math.min(window.devicePixelRatio || 1, 2);
			const width = Math.round(bounds.width * ratio);
			const height = Math.round(bounds.height * ratio);
			if (canvas.width !== width || canvas.height !== height) {
				canvas.width = width;
				canvas.height = height;
			}
			context.setTransform(ratio, 0, 0, ratio, 0, 0);
			context.clearRect(0, 0, bounds.width, bounds.height);
			const x = pointer.x - bounds.left;
			const y = pointer.y - bounds.top;
			const radius = Math.min(200, Math.max(bounds.width, bounds.height) / 2);
			const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
			const colors = getComputedStyle(canvas);
			gradient.addColorStop(0, colors.color);
			gradient.addColorStop(0.65, colors.getPropertyValue('--bento-outline-secondary').trim());
			gradient.addColorStop(1, 'transparent');
			context.strokeStyle = gradient;
			context.lineWidth = 1.5;
			context.beginPath();
			context.roundRect(
				0.75,
				0.75,
				Math.max(0, bounds.width - 1.5),
				Math.max(0, bounds.height - 1.5),
				Math.max(0, parseFloat(getComputedStyle(surface).borderTopLeftRadius) - 0.75)
			);
			context.stroke();
		};
		const scheduleDraw = () => {
			if (pointer && !frame) frame = requestAnimationFrame(draw);
		};
		const leave = () => {
			pointer = null;
			cancelAnimationFrame(frame);
			frame = 0;
		};
		const move = (event: PointerEvent) => {
			if (event.pointerType === 'touch') return;
			pointer = { x: event.clientX, y: event.clientY };
			scheduleDraw();
		};
		const observer = new ResizeObserver(scheduleDraw);
		observer.observe(surface);
		tile.addEventListener('pointerenter', move);
		tile.addEventListener('pointermove', move);
		tile.addEventListener('pointerleave', leave);
		tile.addEventListener('pointercancel', leave);
		window.addEventListener('scroll', scheduleDraw, { passive: true });
		return () => {
			leave();
			observer.disconnect();
			tile.removeEventListener('pointerenter', move);
			tile.removeEventListener('pointermove', move);
			tile.removeEventListener('pointerleave', leave);
			tile.removeEventListener('pointercancel', leave);
			window.removeEventListener('scroll', scheduleDraw);
		};
	});
	return () => cleanups.forEach((cleanup) => cleanup());
};
