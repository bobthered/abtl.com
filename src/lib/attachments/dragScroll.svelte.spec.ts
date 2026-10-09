import { dragScroll } from './dragScroll';
import { expect, it, vi } from 'vitest';

it.each(['mouse', 'touch'])(
	'continues with decaying %s momentum and cleans up on detach',
	(pointerType) => {
		const element = document.createElement('div');
		document.body.append(element);
		const capture = vi.spyOn(element, 'setPointerCapture').mockImplementation(() => {});
		const frames = new Map<number, FrameRequestCallback>();
		let frameId = 0;
		const request = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
			frames.set(++frameId, callback);
			return frameId;
		});
		const cancel = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
			frames.delete(id);
		});
		const clock = vi.spyOn(performance, 'now').mockReturnValue(0);
		let position = 0;
		const interactions: boolean[] = [];
		const cleanup = dragScroll({
			getPosition: () => position,
			onInteractionChange: (isActive) => interactions.push(isActive),
			setPosition: (value) => {
				position = value;
			}
		})(element);
		const send = (target: EventTarget, type: string, x: number, time: number) => {
			const event = new PointerEvent(type, {
				bubbles: true,
				button: 0,
				clientX: x,
				clientY: 100,
				isPrimary: true,
				pointerId: 1,
				pointerType
			});
			Object.defineProperty(event, 'timeStamp', { value: time });
			target.dispatchEvent(event);
		};
		const advance = (time: number) => {
			const [id, callback] = [...frames.entries()][0];
			frames.delete(id);
			callback(time);
		};
		try {
			send(element, 'pointerdown', 200, 0);
			send(window, 'pointermove', 150, 16);
			send(window, 'pointermove', 100, 32);
			expect(position).toBe(100);
			send(window, 'pointerup', 100, 40);
			expect(interactions).toEqual([true]);
			advance(16);
			const firstStep = position - 100;
			expect(firstStep).toBeGreaterThan(0);
			const previousPosition = position;
			advance(32);
			expect(position - previousPosition).toBeGreaterThan(0);
			expect(position - previousPosition).toBeLessThan(firstStep);
			// A new grab immediately takes over the same position, without a momentum jump.
			send(element, 'pointerdown', 200, 60);
			expect(frames.size).toBe(0);
			const grabbedPosition = position;
			send(window, 'pointermove', 180, 76);
			expect(position).toBe(grabbedPosition + 20);
			send(window, 'pointerup', 180, 80);
			expect(frames.size).toBe(1);
			if (typeof cleanup === 'function') cleanup();
			expect(frames.size).toBe(0);
			expect(interactions).toEqual([true, false]);
			const detachedPosition = position;
			send(element, 'pointerdown', 200, 100);
			send(window, 'pointermove', 100, 116);
			expect(position).toBe(detachedPosition);
		} finally {
			if (typeof cleanup === 'function') cleanup();
			element.remove();
			capture.mockRestore();
			request.mockRestore();
			cancel.mockRestore();
			clock.mockRestore();
		}
	}
);

it('skips momentum when reduced motion is requested', () => {
	const element = document.createElement('div');
	const capture = vi.spyOn(element, 'setPointerCapture').mockImplementation(() => {});
	const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
	const media = vi.spyOn(window, 'matchMedia').mockReturnValue({
		...preference,
		matches: true,
		addEventListener: () => {}
	} as MediaQueryList);
	const request = vi.spyOn(window, 'requestAnimationFrame');
	let position = 0;
	const cleanup = dragScroll({
		getPosition: () => position,
		setPosition: (value) => {
			position = value;
		}
	})(element);
	try {
		for (const [type, x] of [
			['pointerdown', 200],
			['pointermove', 100],
			['pointerup', 100]
		] as const) {
			const event = new PointerEvent(type, {
				bubbles: true,
				clientX: x,
				clientY: 100,
				isPrimary: true,
				pointerId: 1,
				pointerType: 'touch'
			});
			(type === 'pointerdown' ? element : window).dispatchEvent(event);
		}
		expect(position).toBe(100);
		expect(request).not.toHaveBeenCalled();
	} finally {
		if (typeof cleanup === 'function') cleanup();
		capture.mockRestore();
		media.mockRestore();
		request.mockRestore();
	}
});
