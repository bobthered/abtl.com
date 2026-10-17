import { expect, test } from '@playwright/test';

for (const route of ['/markets/fire-suppression', '/capabilities/full-color-printing']) {
	for (const reducedMotion of ['no-preference', 'reduce'] as const) {
		test(`shared flip animates both faces on ${route} with ${reducedMotion}`, async ({ page }) => {
			await page.emulateMedia({ reducedMotion });
			await page.goto(route);
			await expect(
				page.locator('[data-fire-suppression-ready="true"], [data-topic-ready="true"]').first()
			).toBeVisible();
			const preview = page.locator('[data-flip-preview]');
			await preview.scrollIntoViewIfNeeded();
			const rotor = preview.locator('[data-flip-rotor]');
			const rotation = () =>
				rotor.evaluate((node) => new DOMMatrix(getComputedStyle(node).transform).m11);
			await expect.poll(rotation).toBe(1);
			const viewport = (await preview.locator('[data-flip-viewport]').boundingBox())!;
			await preview.getByRole('button', { name: 'Turn it over' }).click();
			await expect(preview).toHaveAttribute('data-flip-side', 'back');
			await expect(preview.locator('[data-flip-face="front"]')).toHaveAttribute('inert', '');
			await expect(preview.locator('[data-flip-face="back"]')).toHaveAttribute(
				'aria-hidden',
				'false'
			);
			if (reducedMotion === 'no-preference') {
				await expect
					.poll(async () => Math.abs(await rotation()), { intervals: [16, 16, 16] })
					.toBeLessThan(0.95);
			} else {
				await expect(rotor).toHaveCSS('transition-property', 'none');
			}
			await expect.poll(rotation).toBe(-1);
			await expect(preview.getByRole('button')).toBeFocused();
			await expect(preview.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
			const backface = preview.locator('[data-flip-face="back"]');
			await expect(backface).toHaveCSS('backface-visibility', 'hidden');
			if (route.endsWith('full-color-printing')) {
				await expect(backface.locator('[data-print-duplex]')).toHaveAttribute(
					'data-print-ready',
					'true'
				);
				const front = await preview
					.locator('[data-flip-face="front"] canvas')
					.evaluate((node: HTMLCanvasElement) => node.toDataURL());
				const back = await backface
					.locator('canvas')
					.evaluate((node: HTMLCanvasElement) => node.toDataURL());
				expect(back).not.toBe(front);
			}
			await preview.getByRole('button', { name: 'View the face' }).press('Space');
			await expect.poll(rotation).toBe(1);
			await expect(preview.locator('[data-flip-face="back"]')).toHaveAttribute('inert', '');
			const after = (await preview.locator('[data-flip-viewport]').boundingBox())!;
			expect(after.width).toBeCloseTo(viewport.width, 0);
			expect(after.height).toBeCloseTo(viewport.height, 0);
			if (reducedMotion === 'no-preference') {
				await preview.getByRole('button', { name: 'Turn it over' }).click();
				await expect
					.poll(async () => Math.abs(await rotation()), { intervals: [16] })
					.toBeLessThan(0.95);
				await preview.getByRole('button', { name: 'View the face' }).click();
				await expect.poll(rotation).toBe(1);
				await expect(preview).toHaveAttribute('data-flip-side', 'front');
			}
		});
	}
}

test('shared flipping preserves printing channel registration', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/capabilities/full-color-printing');
	const studio = page.locator('[data-process-section="process"]');
	const artwork = studio.locator('[data-print-channels]');
	await artwork.scrollIntoViewIfNeeded();
	await expect(artwork).toHaveAttribute('data-print-ready', 'true');
	await studio.locator('[data-process-register]').click();
	await expect(artwork).toHaveAttribute('data-print-motion', 'static');
	const pixels = () =>
		artwork.locator('canvas').evaluate((node: HTMLCanvasElement) => node.toDataURL());
	const composite = await pixels();
	await studio.locator('[data-process-ink="C"]').click();
	await expect(artwork).toHaveAttribute('data-print-channels', '0111');
	await expect.poll(pixels).not.toBe(composite);
	await studio.getByRole('button', { name: 'All four inks', exact: true }).click();
	await expect.poll(pixels).toBe(composite);
});
