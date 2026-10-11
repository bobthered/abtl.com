import { expect, test } from '@playwright/test';

test('full-color printing opens a routed dialog, combines ink channels, and flips distinct artwork', async ({
	page
}) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/');
	await expect(page.locator('[data-bento-section]')).toHaveAttribute('data-bento-ready', 'true');
	const trigger = page.locator('[data-bento-topic="full-color-printing"]');
	await expect(page.locator('[data-bento-topic="materials"]')).toHaveCount(0);
	await page.setViewportSize({ width: 1440, height: 900 });
	const slot = await trigger.evaluate((element) =>
		[...element.parentElement!.children].indexOf(element)
	);
	await expect(trigger).toHaveCSS('grid-column-end', 'span ' + [4, 2, 2, 2, 2, 6][slot]);
	await trigger.scrollIntoViewIfNeeded();
	await trigger.click();
	await expect(page).toHaveURL(/\/tags\/full-color-printing$/);
	const dialog = page.getByRole('dialog', { name: 'Full color. Both sides.' });
	await expect(dialog).toBeVisible();
	const studio = dialog.locator('[data-process-section="process"]');
	const artwork = studio.locator('[data-print-channels]');
	await artwork.scrollIntoViewIfNeeded();
	await expect(artwork).toHaveAttribute('data-print-ready', 'true');
	// An unprinted point on the outermost ink plane must remain fully transparent.
	const unprintedAlpha = await artwork.locator('canvas').evaluate((canvas: HTMLCanvasElement) => {
		const { width, height } = canvas.getBoundingClientRect();
		const scale = Math.min(width / 460, height / 660);
		const yaw = (35 * Math.PI) / 180;
		const roll = (-5 * Math.PI) / 180;
		const rotatedX = Math.cos(yaw) * 81.5 + Math.sin(yaw) * 160;
		const depth = -Math.sin(yaw) * 81.5 + Math.cos(yaw) * 160;
		const perspective = 1000 / (1000 - depth);
		const x = width / 2 + (Math.cos(roll) * rotatedX + Math.sin(roll) * 155) * perspective * scale;
		const y = height / 2 + (Math.sin(roll) * rotatedX - Math.cos(roll) * 155) * perspective * scale;
		const ratio = canvas.width / width;
		return canvas.getContext('2d')!.getImageData(Math.round(x * ratio), Math.round(y * ratio), 1, 1)
			.data[3];
	});
	expect(unprintedAlpha).toBe(0);
	await studio.locator('[data-process-register]').click();
	await expect(artwork).toHaveAttribute('data-print-separated', 'false');
	await expect(artwork).toHaveAttribute('data-print-motion', 'static');
	const composite = await artwork
		.locator('canvas')
		.evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL());
	await studio.locator('[data-process-ink="C"]').click();
	await expect(artwork).toHaveAttribute('data-print-channels', '0111');
	await expect(studio.locator('[data-process-count]')).toHaveText('3 of 4 inks active');
	await expect
		.poll(() =>
			artwork.locator('canvas').evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL())
		)
		.not.toBe(composite);
	await studio.getByRole('button', { name: 'All four inks', exact: true }).click();
	await expect(artwork).toHaveAttribute('data-print-channels', '1111');
	await expect
		.poll(() =>
			artwork.locator('canvas').evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL())
		)
		.toBe(composite);
	const sides = dialog.locator('[data-process-section="sides"]');
	const duplex = sides.locator('[data-print-duplex]');
	await sides.scrollIntoViewIfNeeded();
	const face = await duplex
		.locator('canvas')
		.evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL());
	await sides.locator('[data-process-flip]').click();
	await expect(duplex).toHaveAttribute('data-print-back', 'true');
	await expect(sides.locator('[data-process-side]')).toContainText('Back');
	await expect
		.poll(() =>
			duplex.locator('canvas').evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL())
		)
		.not.toBe(face);
	await page.keyboard.press('Escape');
	await expect(page).toHaveURL(/\/$/);
	await expect(trigger).toBeFocused();
	await trigger.click();
	await page.reload();
	await expect(
		page.getByRole('heading', { level: 1, name: 'Full color. Both sides.' })
	).toBeVisible();
	await expect(page.getByRole('dialog')).toHaveCount(0);
	for (const width of [390, 1440]) {
		await page.setViewportSize({ width, height: 900 });
		expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
		const contact = await page.locator('[data-process-section="contact"]').boundingBox();
		expect(contact!.x).toBeCloseTo(0, 0);
		expect(contact!.width).toBeCloseTo(width, 0);
	}
});

test('printing tile registers on hover and keyboard focus, then rests', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('[data-bento-section]')).toHaveAttribute('data-bento-ready', 'true');
	const trigger = page.locator('[data-bento-topic="full-color-printing"]');
	await trigger.scrollIntoViewIfNeeded();
	await page.mouse.move(0, 0);
	const artwork = trigger.locator('[data-print-preview]');
	await expect(artwork).toHaveAttribute('data-print-motion', 'static');
	const separated = await artwork
		.locator('canvas')
		.evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL());
	await trigger.hover();
	await expect(artwork).toHaveAttribute('data-print-motion', 'active');
	await expect(artwork).toHaveAttribute('data-print-motion', 'static');
	const aligned = await artwork
		.locator('canvas')
		.evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL());
	expect(aligned).not.toBe(separated);
	await page.mouse.move(0, 0);
	await expect(artwork).toHaveAttribute('data-print-motion', 'static');
	await expect
		.poll(() =>
			artwork.locator('canvas').evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL())
		)
		.toBe(separated);
	await page.keyboard.press('Tab');
	await trigger.focus();
	await expect(artwork).toHaveAttribute('data-print-motion', 'static');
	await expect
		.poll(() =>
			artwork.locator('canvas').evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL())
		)
		.toBe(aligned);
});

test('printing backdrop provides dark-mode ink contrast without filling the ink canvas', async ({
	page
}) => {
	await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'light' });
	await page.goto('/');
	await expect(page.locator('[data-bento-section]')).toHaveAttribute('data-bento-ready', 'true');
	const tile = page.locator('[data-bento-topic="full-color-printing"]');
	await tile.scrollIntoViewIfNeeded();
	await page.mouse.move(0, 0);
	const art = tile.locator('[data-print-preview]');
	await expect(art).toHaveAttribute('data-print-ready', 'true');
	const canvas = art.locator('canvas');
	const lightPixels = await canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL());
	const backdrop = art.locator('[data-print-backdrop]');
	await expect(backdrop).toBeHidden();
	await page.evaluate(() => {
		document.documentElement.dataset.theme = 'dark';
	});
	await expect(backdrop).toBeVisible();
	expect(await backdrop.evaluate((element) => getComputedStyle(element).backgroundImage)).toContain(
		'radial-gradient'
	);
	expect(await canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL())).toBe(
		lightPixels
	);
});
