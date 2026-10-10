import '../../../routes/layout.css';
import BentoSection from './BentoSection.svelte';
import { expect, it, vi } from 'vitest';
import ImageLightbox from '../ImageLightbox/ImageLightbox.svelte';
import { initializeTheme } from '#lib/theme.js';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import StockColorMarquee from './StockColorMarquee.svelte';
import StockTagExamples from './StockTagExamples.svelte';
import { stockPhotoExamples } from './stockPhotoExamples';

it('scrolls a constrained card through a full-screen backdrop and restores focus on Escape', async () => {
	initializeTheme();
	render(BentoSection);
	const trigger = page.getByRole('link', { name: 'Explore What color will you choose?' });
	await trigger.click();
	const dialog = page.getByRole('dialog', { name: 'What color will you choose?' });
	await expect.element(dialog).toBeVisible();
	const topGap = window.innerWidth >= 640 ? 64 : 32;
	const card = dialog.element().querySelector<HTMLElement>('[data-bento-card]')!;
	await expect.poll(() => Math.round(card.getBoundingClientRect().top)).toBe(topGap);
	const element = dialog.element();
	const closeButton = element.querySelector<HTMLElement>('[data-bento-close]')!;
	const marquee = element.querySelector<HTMLElement>('[data-marquee]')!;
	expect(getComputedStyle(marquee).overflowX).toBe('hidden');
	expect(marquee.querySelectorAll('[data-marquee-copy]').length).toBe(2);
	expect(marquee.querySelector('[data-marquee-copy]')!.children.length).toBe(21);
	expect(marquee.querySelectorAll('button').length).toBe(0);
	expect(Math.round(marquee.getBoundingClientRect().width)).toBe(
		Math.round(card.getBoundingClientRect().width)
	);
	expect(Math.round(marquee.getBoundingClientRect().left)).toBe(
		Math.round(card.getBoundingClientRect().left)
	);
	const colorCard = marquee.querySelector<HTMLElement>('[data-stock-marquee-color]')!;
	expect(getComputedStyle(colorCard).backgroundColor).not.toBe(
		getComputedStyle(card).backgroundColor
	);
	const examples = element.querySelector('[data-color-section="examples"]')!;
	expect(Math.round(examples.querySelector('[data-marquee]')!.getBoundingClientRect().width)).toBe(
		Math.round(card.getBoundingClientRect().width)
	);
	expect(examples.querySelector('[data-marquee-copy]')!.children.length).toBe(21);
	const photoCards = examples.querySelectorAll<HTMLElement>(
		'[data-marquee-copy]:first-child [data-stock-photo-color]'
	);
	const colorCards = marquee.querySelectorAll<HTMLElement>(
		'[data-marquee-copy]:first-child [data-stock-marquee-color]'
	);
	expect(Array.from(photoCards, (item) => item.dataset.stockPhotoColor)).toEqual(
		Array.from(colorCards, (item) => item.dataset.stockMarqueeColor)
	);
	expect(
		new Set(Array.from(photoCards, (item) => item.querySelector('img')!.getAttribute('src'))).size
	).toBe(21);
	for (const image of examples.querySelectorAll('img')) {
		expect(image.getAttribute('loading')).toBe('lazy');
		expect(image.getAttribute('alt')).toContain('reinforcement patch');
	}
	expect(getComputedStyle(closeButton).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
	expect(Math.round(element.getBoundingClientRect().width)).toBe(window.innerWidth);
	expect(element.getBoundingClientRect().top).toBe(0);
	expect(Math.round(element.getBoundingClientRect().height)).toBe(window.innerHeight);
	expect(getComputedStyle(element, '::backdrop').backdropFilter).not.toBe('none');
	expect(card.getBoundingClientRect().left).toBeGreaterThan(0);
	expect(card.getBoundingClientRect().right).toBeLessThan(window.innerWidth);
	expect(element.scrollHeight).toBeGreaterThan(element.clientHeight);
	expect(document.documentElement.classList.contains('overflow-hidden')).toBe(true);
	await expect
		.element(page.getByRole('button', { name: 'Close topic', exact: true }))
		.toHaveFocus();
	await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
	expect(element.contains(document.activeElement)).toBe(true);
	element.scrollTop = element.clientHeight / 2;
	expect(closeButton.getBoundingClientRect().bottom).toBeLessThan(0);
	expect(card.getBoundingClientRect().top).toBeLessThan(0);
	expect(card.getBoundingClientRect().bottom).toBeGreaterThan(window.innerHeight);
	const photoTrigger = photoCards[0] as HTMLButtonElement;
	photoTrigger.focus({ preventScroll: true });
	photoTrigger.click();
	const lightbox = page.getByRole('dialog', { name: /White ?/ });
	await expect.element(lightbox).toBeVisible();
	await userEvent.keyboard('{Escape}');
	await expect.element(lightbox).not.toBeInTheDocument();
	await expect.element(dialog).toBeVisible();
	expect(document.documentElement.classList.contains('overflow-hidden')).toBe(true);
	element.scrollTop = element.scrollHeight;
	expect(element.scrollTop).toBeGreaterThan(0);
	expect(Math.round(card.getBoundingClientRect().bottom)).toBe(window.innerHeight - topGap);
	await userEvent.keyboard('{Escape}');
	await expect.element(dialog).not.toBeInTheDocument();
	await expect
		.poll(() => document.documentElement.classList.contains('overflow-hidden'))
		.toBe(false);
	await expect.element(trigger).toHaveFocus();
});

it('closes with the visible control and opens another topic with fresh scroll position', async () => {
	initializeTheme();
	render(BentoSection);
	await page.getByRole('link', { name: 'Explore Make your mark.' }).click();
	await expect.element(page.getByRole('dialog', { name: 'Make your mark.' })).toBeVisible();
	await page.getByRole('button', { name: 'Close topic', exact: true }).click();
	await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
	await page.getByRole('link', { name: 'Explore Keep every number in order.' }).click();
	const dialog = page.getByRole('dialog', { name: 'Keep every number in order.' });
	await expect.element(dialog).toBeVisible();
	expect(dialog.element().scrollTop).toBe(0);
	await page.getByRole('button', { name: 'Close topic', exact: true }).click();
	await expect.element(dialog).not.toBeInTheDocument();
});

it('builds one sample request from selected colors and presents divided content sections', async () => {
	initializeTheme();
	render(BentoSection);
	await page.getByRole('link', { name: 'Explore What color will you choose?' }).click();
	const dialog = page.getByRole('dialog', { name: 'What color will you choose?' });
	await expect.element(dialog).toBeVisible();
	const white = page.getByRole('button', { name: 'Select White for samples', exact: true });
	const pink = page.getByRole('button', {
		name: 'Select Fluorescent Pink for samples',
		exact: true
	});
	await white.click();
	await pink.click();
	await expect.element(white).toHaveAttribute('aria-pressed', 'true');
	const request = dialog.element().querySelector<HTMLAnchorElement>('[data-stock-sample-request]')!;
	const body = new URL(request.href).searchParams.get('body')!;
	expect(body).toContain('White');
	expect(body).toContain('Fluorescent Pink');
	await pink.click();
	expect(new URL(request.href).searchParams.get('body')).not.toContain('Fluorescent Pink');
	const sections = dialog.element().querySelectorAll<HTMLElement>('[data-color-section]');
	expect(sections.length).toBeGreaterThanOrEqual(10);
	for (const section of sections) expect(getComputedStyle(section).borderTopWidth).toBe('1px');
	expect(sections[sections.length - 1].dataset.colorSection).toBe('samples');
	await page.getByText('Can I compare more than one color?', { exact: true }).click();
	expect(dialog.element().querySelector('details')?.open).toBe(true);
	await userEvent.keyboard('{Escape}');
	await expect.element(dialog).not.toBeInTheDocument();
});

it('resumes the marquee after pointer clicks and pauses for keyboard browsing', async () => {
	initializeTheme();
	render(StockColorMarquee);
	const marquee = page.getByRole('region', { name: 'Stock tag colors' });
	const track = marquee.element().querySelector<HTMLElement>('[data-marquee-track]')!;
	await expect.poll(() => track.getAnimations().length).toBe(1);
	await marquee.click();
	await userEvent.unhover(marquee);
	await expect.poll(() => track.getAnimations()[0].playState).toBe('running');
	await userEvent.keyboard('{ArrowRight}');
	await expect.poll(() => track.getAnimations()[0].playState).toBe('paused');
});

it.each(['mouse', 'touch'])(
	'drags the marquee in both directions with %s input',
	async (pointerType) => {
		initializeTheme();
		render(StockColorMarquee);
		const element = page.getByRole('region', { name: 'Stock tag colors' }).element();
		const track = element.querySelector<HTMLElement>('[data-marquee-track]')!;
		await expect.poll(() => track.getAnimations().length).toBe(1);
		const animation = track.getAnimations()[0];
		// Synthetic pointer events cannot establish a native browser pointer capture.
		const capture = vi.spyOn(element, 'setPointerCapture').mockImplementation(() => {});
		const sendPointer = (target: EventTarget, type: string, x: number, y = 100) =>
			target.dispatchEvent(
				new PointerEvent(type, {
					bubbles: true,
					button: 0,
					clientX: x,
					clientY: y,
					isPrimary: true,
					pointerId: 1,
					pointerType
				})
			);
		const duration = Number(animation.effect!.getTiming().duration);
		animation.currentTime = 0;
		sendPointer(element, 'pointerdown', 200);
		sendPointer(window, 'pointermove', 300);
		await expect.poll(() => getComputedStyle(element).cursor).toBe('grabbing');
		expect(capture).toHaveBeenCalledWith(1);
		expect(animation.playState).toBe('paused');
		// Mobile transfers implicit capture from the touched child to the marquee itself.
		sendPointer(track, 'lostpointercapture', 300);
		expect(getComputedStyle(element).cursor).toBe('grabbing');
		// Dragging right from the first item wraps seamlessly into the preceding copy.
		expect(Number(animation.currentTime)).toBeCloseTo(duration - (100 / 32) * 1000, 3);
		sendPointer(window, 'pointermove', 100);
		expect(Number(animation.currentTime)).toBeCloseTo((100 / 32) * 1000, 3);
		sendPointer(window, 'pointerup', 100);
		await expect.poll(() => getComputedStyle(element).cursor).toBe('grab');
		await expect.poll(() => animation.playState).toBe('running');
		expect(getComputedStyle(element).touchAction).toBe('pan-y');
		capture.mockRestore();
	}
);

it('yields vertical swipes to page scrolling and recovers from pointer cancellation', async () => {
	initializeTheme();
	render(StockColorMarquee);
	const element = page.getByRole('region', { name: 'Stock tag colors' }).element();
	const track = element.querySelector<HTMLElement>('[data-marquee-track]')!;
	await expect.poll(() => track.getAnimations().length).toBe(1);
	const animation = track.getAnimations()[0];
	const capture = vi.spyOn(element, 'setPointerCapture').mockImplementation(() => {});
	const sendPointer = (target: EventTarget, type: string, x: number, y: number) =>
		target.dispatchEvent(
			new PointerEvent(type, {
				bubbles: true,
				clientX: x,
				clientY: y,
				isPrimary: true,
				pointerId: 1,
				pointerType: 'touch'
			})
		);
	sendPointer(element, 'pointerdown', 200, 100);
	sendPointer(window, 'pointermove', 202, 140);
	expect(capture).not.toHaveBeenCalled();
	await expect.poll(() => animation.playState).toBe('running');
	sendPointer(element, 'pointerdown', 200, 100);
	sendPointer(window, 'pointermove', 100, 102);
	await expect.poll(() => getComputedStyle(element).cursor).toBe('grabbing');
	sendPointer(window, 'pointercancel', 100, 102);
	await expect.poll(() => getComputedStyle(element).cursor).toBe('grab');
	await expect.poll(() => animation.playState).toBe('running');
	capture.mockRestore();
});

it('keeps release momentum moving while hovered, then returns to hover pause', async () => {
	initializeTheme();
	render(StockColorMarquee);
	const marquee = page.getByRole('region', { name: 'Stock tag colors' });
	const element = marquee.element();
	const track = element.querySelector<HTMLElement>('[data-marquee-track]')!;
	await expect.poll(() => track.getAnimations().length).toBe(1);
	await userEvent.hover(marquee);
	const animation = track.getAnimations()[0];
	await expect.poll(() => animation.playState).toBe('paused');
	const capture = vi.spyOn(element, 'setPointerCapture').mockImplementation(() => {});
	const start = performance.now();
	try {
		for (const [type, x, elapsed] of [
			['pointerdown', 200, 0],
			['pointermove', 150, 16],
			['pointermove', 100, 32],
			['pointerup', 100, 40]
		] as const) {
			const event = new PointerEvent(type, {
				bubbles: true,
				button: 0,
				clientX: x,
				clientY: 100,
				isPrimary: true,
				pointerId: 1,
				pointerType: 'mouse'
			});
			Object.defineProperty(event, 'timeStamp', { value: start + elapsed });
			(type === 'pointerdown' ? element : window).dispatchEvent(event);
		}
		const releasedTime = Number(animation.currentTime);
		await expect.poll(() => Number(animation.currentTime)).not.toBe(releasedTime);
		expect(animation.playState).toBe('paused');
		await new Promise((resolve) => setTimeout(resolve, 1100));
		const settledTime = Number(animation.currentTime);
		await new Promise((resolve) => setTimeout(resolve, 100));
		expect(Number(animation.currentTime)).toBe(settledTime);
		await userEvent.unhover(marquee);
		await expect.poll(() => animation.playState).toBe('running');
	} finally {
		capture.mockRestore();
	}
});

it('enlarges a photo from its card and restores focus after dismissing the lightbox', async () => {
	initializeTheme();
	render(StockTagExamples);
	const trigger = document.querySelector<HTMLButtonElement>('[data-stock-photo-color]')!;
	const sourceImage = trigger.querySelector('img')!;
	const sourceBounds = sourceImage.getBoundingClientRect();
	trigger.focus();
	trigger.click();
	const lightbox = page.getByRole('dialog');
	await expect.element(lightbox).toBeVisible();
	const enlargedImage = lightbox.element().querySelector('img')!;
	expect(enlargedImage.getAttribute('src')).toBe(sourceImage.getAttribute('src'));
	expect(enlargedImage.getAttribute('alt')).toBe(sourceImage.getAttribute('alt'));
	await expect.poll(() => enlargedImage.getAnimations().length).toBeGreaterThan(0);
	const animation = enlargedImage.getAnimations()[0];
	const frames = (animation.effect as KeyframeEffect).getKeyframes();
	expect(frames[0].transform).toContain('translate(');
	expect(frames[0].transform).toContain('scale(');
	expect(frames[1].transform).toBe('translate(0px, 0px) scale(1)');
	await animation.finished;
	const targetBounds = enlargedImage.getBoundingClientRect();
	const startTransform = new DOMMatrix(frames[0].transform as string);
	expect(startTransform.e).toBeCloseTo(sourceBounds.left - targetBounds.left, 1);
	expect(startTransform.f).toBeCloseTo(sourceBounds.top - targetBounds.top, 1);
	expect(startTransform.a).toBeCloseTo(sourceBounds.width / targetBounds.width, 2);
	expect(startTransform.d).toBeCloseTo(sourceBounds.height / targetBounds.height, 2);
	await userEvent.keyboard('{Escape}');
	await expect.element(lightbox).not.toBeInTheDocument();
	expect(document.activeElement).toBe(trigger);
	expect(document.documentElement.classList.contains('overflow-hidden')).toBe(false);
	const duplicate = document.querySelector<HTMLButtonElement>(
		'[data-marquee-copy]:last-child [data-stock-photo-color]'
	)!;
	expect(duplicate.closest('[inert]')).toBe(null);
	expect(duplicate.tabIndex).toBe(-1);
	duplicate.click();
	await expect.element(page.getByRole('dialog')).toBeVisible();
	await page.getByRole('button', { name: 'Close image' }).click();
	await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
});

it('waits for decoded lightbox pixels before revealing and animating the image', async () => {
	initializeTheme();
	const nativeDecode = HTMLImageElement.prototype.decode;
	let releaseDecode!: () => void;
	const pendingDecode = new Promise<void>((resolve) => {
		releaseDecode = resolve;
	});
	// Keep the real image request, but simulate decoding that finishes later.
	// A standard function is required to preserve the image element receiver.
	const decode = vi.spyOn(HTMLImageElement.prototype, 'decode').mockImplementation(function (
		this: HTMLImageElement
	) {
		return nativeDecode.call(this).then(() => pendingDecode);
	});
	try {
		render(ImageLightbox, {
			alt: 'Stock tag example',
			isVisible: true,
			src: stockPhotoExamples[0].image,
			origin: new DOMRect(100, 100, 240, 180)
		});
		const dialog = page.getByRole('dialog');
		await expect.element(dialog).toBeVisible();
		const image = dialog.element().querySelector('img')!;
		await expect.element(page.getByRole('status')).toHaveTextContent('Loading image');
		expect(image.loading).toBe('eager');
		expect(image.fetchPriority).toBe('high');
		expect(getComputedStyle(image).visibility).toBe('hidden');
		expect(image.getAnimations()).toHaveLength(0);
		await nativeDecode.call(image);
		releaseDecode();
		await expect.poll(() => getComputedStyle(image).visibility).toBe('visible');
		await expect.poll(() => image.getAnimations().length).toBeGreaterThan(0);
		await expect.element(page.getByRole('status')).not.toBeInTheDocument();
		await userEvent.keyboard('{Escape}');
		await expect.element(dialog).not.toBeInTheDocument();
	} finally {
		releaseDecode();
		decode.mockRestore();
	}
});

it('reserves vertical room for marquee tile expansion and focus outlines', async () => {
	initializeTheme();
	render(StockColorMarquee);
	const marquee = page.getByRole('region', { name: 'Stock tag colors' }).element();
	const tile = marquee.querySelector<HTMLElement>('[data-stock-marquee-color]')!;
	const surface = tile.querySelector<HTMLElement>('[data-bento-surface]')!;
	const viewport = marquee.getBoundingClientRect();
	const bounds = surface.getBoundingClientRect();
	// Expansion is 4px; the focus indicator extends another 4px plus its 2px outline.
	expect(bounds.top - viewport.top).toBeGreaterThanOrEqual(10);
	expect(viewport.bottom - bounds.bottom).toBeGreaterThanOrEqual(10);
	expect(getComputedStyle(marquee).overflowX).toBe('hidden');
});

it('preloads photos on hover and keyboard focus without repeating the same decode', async () => {
	initializeTheme();
	const decode = vi.spyOn(HTMLImageElement.prototype, 'decode').mockResolvedValue(undefined);
	try {
		render(StockTagExamples);
		const buttons = document.querySelectorAll<HTMLButtonElement>('[data-stock-photo-color]');
		buttons[0].dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }));
		expect(decode).toHaveBeenCalledTimes(1);
		buttons[0].dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
		expect(decode).toHaveBeenCalledTimes(1);
		buttons[1].dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
		expect(decode).toHaveBeenCalledTimes(2);
		expect(document.querySelector('dialog')).toBe(null);
	} finally {
		decode.mockRestore();
	}
});

it('dismisses the bento dialog from its backdrop without dismissing content clicks or drags', async () => {
	initializeTheme();
	render(BentoSection);
	const trigger = page.getByRole('link', { name: 'Explore Make your mark.' });
	await trigger.click();
	const dialog = page.getByRole('dialog', { name: 'Make your mark.' });
	await expect.element(dialog).toBeVisible();
	const card = dialog.element().querySelector<HTMLElement>('[data-bento-card]')!;
	await expect
		.poll(() => Math.round(card.getBoundingClientRect().top))
		.toBe(window.innerWidth >= 640 ? 64 : 32);
	await page.getByRole('heading', { name: 'Make your mark.', exact: true }).click();
	await expect.element(dialog).toBeVisible();
	card.dispatchEvent(
		new PointerEvent('pointerdown', { bubbles: true, isPrimary: true, button: 0 })
	);
	dialog.element().dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
	await expect.element(dialog).toBeVisible();
	await dialog.click({ position: { x: 4, y: 4 } });
	await expect.element(dialog).not.toBeInTheDocument();
	await expect.element(trigger).toHaveFocus();
	await expect
		.poll(() => document.documentElement.classList.contains('overflow-hidden'))
		.toBe(false);
});

it('dismisses only the lightbox when its backdrop is clicked above a bento dialog', async () => {
	initializeTheme();
	render(BentoSection);
	await page.getByRole('link', { name: 'Explore What color will you choose?' }).click();
	const parent = page.getByRole('dialog', { name: 'What color will you choose?' });
	await expect.element(parent).toBeVisible();
	const trigger = parent.element().querySelector<HTMLButtonElement>('[data-stock-photo-color]')!;
	trigger.focus({ preventScroll: true });
	trigger.click();
	const lightbox = page.getByRole('dialog', { name: /White/ });
	await expect.element(lightbox).toBeVisible();
	const image = lightbox.element().querySelector('img')!;
	await expect.poll(() => getComputedStyle(image).visibility).toBe('visible');
	image.dispatchEvent(
		new PointerEvent('pointerdown', { bubbles: true, isPrimary: true, button: 0 })
	);
	lightbox.element().dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
	await expect.element(lightbox).toBeVisible();
	await lightbox.click({ position: { x: 4, y: 4 } });
	await expect.element(lightbox).not.toBeInTheDocument();
	await expect.element(parent).toBeVisible();
	expect(document.activeElement).toBe(trigger);
	expect(document.documentElement.classList.contains('overflow-hidden')).toBe(true);
	await userEvent.keyboard('{Escape}');
	await expect.element(parent).not.toBeInTheDocument();
});
