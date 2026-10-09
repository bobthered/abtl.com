import type { Attachment } from 'svelte/attachments';

export type DragScrollOptions = {
	/** Logical horizontal position in pixels. Defaults to native scrollLeft. */
	getPosition?: () => number;
	isEnabled?: () => boolean;
	isInertiaEnabled?: () => boolean;
	onDragChange?: (isDragging: boolean) => void;
	/** Includes the pressed gesture and its release momentum. */
	onInteractionChange?: (isInteracting: boolean) => void;
	onStart?: () => void;
	setPosition?: (position: number) => void;
};

type Gesture = {
	pointerId: number;
	pointerType: string;
	position: number;
	samples: { time: number; x: number }[];
	x: number;
	y: number;
};

/** Horizontal drag and release momentum. Pair with touch-pan-y and select-none utilities. */
export const dragScroll =
	(options: DragScrollOptions = {}): Attachment<HTMLElement> =>
	(element) => {
		const controller = new AbortController();
		const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
		const getPosition = options.getPosition ?? (() => element.scrollLeft);
		const setPosition = options.setPosition ?? ((position) => (element.scrollLeft = position));
		let frame: number | null = null;
		let gesture: Gesture | null = null;
		let isClickSuppressed = false;
		let isDragging = false;
		let isInteracting = false;

		const notifyInteraction = (isActive: boolean) => {
			if (isInteracting === isActive) return;
			isInteracting = isActive;
			options.onInteractionChange?.(isActive);
		};
		const stopMomentum = () => {
			if (frame !== null) cancelAnimationFrame(frame);
			frame = null;
		};
		const releasePointer = () => {
			const pointerId = gesture?.pointerId;
			gesture = null;
			isDragging = false;
			options.onDragChange?.(false);
			if (pointerId !== undefined && element.hasPointerCapture(pointerId)) {
				element.releasePointerCapture(pointerId);
			}
		};
		const cancelInteraction = () => {
			stopMomentum();
			releasePointer();
			notifyInteraction(false);
		};
		const coast = (initialVelocity: number) => {
			let velocity = initialVelocity;
			let previousTime = performance.now();
			const decay = 0.006;
			const advance = (time: number) => {
				if (
					preference.matches ||
					options.isEnabled?.() === false ||
					options.isInertiaEnabled?.() === false
				) {
					cancelInteraction();
					return;
				}
				const elapsed = Math.max(0, time - previousTime);
				previousTime = time;
				const attenuation = Math.exp(-decay * elapsed);
				setPosition(getPosition() + (velocity * (1 - attenuation)) / decay);
				velocity *= attenuation;
				if (Math.abs(velocity) < 0.02) {
					frame = null;
					notifyInteraction(false);
					return;
				}
				frame = requestAnimationFrame(advance);
			};
			frame = requestAnimationFrame(advance);
		};
		const finish = (event: PointerEvent) => {
			if (!gesture || gesture.pointerId !== event.pointerId) return;
			const samples = gesture.samples;
			const first = samples[0];
			const last = samples[samples.length - 1];
			const velocity =
				first && last && last.time > first.time && event.timeStamp - last.time < 80
					? Math.max(-3.5, Math.min(3.5, (first.x - last.x) / (last.time - first.time)))
					: 0;
			const isCoasting =
				event.type === 'pointerup' &&
				isDragging &&
				!preference.matches &&
				options.isInertiaEnabled?.() !== false &&
				Math.abs(velocity) >= 0.02;
			releasePointer();
			if (isCoasting) coast(velocity);
			else notifyInteraction(false);
		};
		const move = (event: PointerEvent) => {
			if (!gesture || gesture.pointerId !== event.pointerId) return;
			const x = event.clientX - gesture.x;
			const y = event.clientY - gesture.y;
			if (!isDragging) {
				if (Math.max(Math.abs(x), Math.abs(y)) < 6) return;
				if (gesture.pointerType === 'touch' && Math.abs(y) > Math.abs(x)) {
					cancelInteraction();
					return;
				}
				isDragging = true;
				isClickSuppressed = true;
				options.onDragChange?.(true);
				element.setPointerCapture(event.pointerId);
			}
			gesture.samples = gesture.samples.filter((sample) => event.timeStamp - sample.time <= 80);
			gesture.samples.push({ time: event.timeStamp, x: event.clientX });
			setPosition(gesture.position - x);
		};
		const start = (event: PointerEvent) => {
			if (!event.isPrimary || event.button !== 0 || gesture || options.isEnabled?.() === false)
				return;
			stopMomentum();
			isClickSuppressed = false;
			options.onStart?.();
			gesture = {
				pointerId: event.pointerId,
				pointerType: event.pointerType,
				position: getPosition(),
				samples: [{ time: event.timeStamp, x: event.clientX }],
				x: event.clientX,
				y: event.clientY
			};
			notifyInteraction(true);
		};

		const listenerOptions = { signal: controller.signal };
		element.addEventListener('pointerdown', start, listenerOptions);
		element.addEventListener(
			'lostpointercapture',
			(event) => {
				// Ignore the touched child's implicit capture transferring to this element.
				if (event.target === element) finish(event);
			},
			listenerOptions
		);
		element.addEventListener(
			'click',
			(event) => {
				if (!isClickSuppressed || event.detail === 0) return;
				isClickSuppressed = false;
				event.preventDefault();
				event.stopImmediatePropagation();
			},
			{ ...listenerOptions, capture: true }
		);
		element.addEventListener('dragstart', (event) => event.preventDefault(), listenerOptions);
		element.addEventListener('keydown', cancelInteraction, listenerOptions);
		window.addEventListener('pointermove', move, listenerOptions);
		window.addEventListener('pointerup', finish, listenerOptions);
		window.addEventListener('pointercancel', finish, listenerOptions);
		window.addEventListener('blur', cancelInteraction, listenerOptions);
		document.addEventListener(
			'visibilitychange',
			() => {
				if (document.hidden) cancelInteraction();
			},
			listenerOptions
		);
		preference.addEventListener(
			'change',
			() => {
				if (preference.matches && frame !== null) cancelInteraction();
			},
			listenerOptions
		);

		return () => {
			controller.abort();
			cancelInteraction();
		};
	};
