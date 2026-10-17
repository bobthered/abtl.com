import { expect, test } from '@playwright/test';
import { tagExamples } from './_components/examples';

for (const colorScheme of ['light', 'dark'] as const) {
	for (const width of [390, 1440]) {
		test(`shellfish formats and records work at ${width}px in ${colorScheme}`, async ({ page }) => {
			await page.setViewportSize({ width, height: 1000 });
			await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
			await page.goto('/markets/shellfish');
			await expect(page.locator('[data-shellfish-ready]')).toHaveAttribute(
				'data-shellfish-ready',
				'true'
			);
			await expect(page).toHaveTitle('Shellfish | Allen-Bailey Tag & Label');
			await expect(page.locator('[data-content-body] > section')).toHaveCount(3);
			await expect(page.locator('[data-content-cta] a')).toHaveAttribute('href', '/contact');
			await page
				.getByRole('textbox', { name: 'Company or harvester name' })
				.fill('Example Shellfish Co.');
			await page
				.getByRole('textbox', { name: 'Harvest area', exact: true })
				.fill('Example growing area');
			const standard = page.locator('[data-shellfish-standard]');
			const front = standard.locator('[data-flip-face="front"]');
			const standardHeight = (await standard.boundingBox())!.height;
			await expect(front.locator('[data-shellfish-company]')).toHaveText('Example Shellfish Co.');
			await expect(front.locator('[data-shellfish-area]')).toHaveText('Example growing area');
			await expect(front.locator('[data-shellfish-patch]')).toHaveCount(1);
			for (const example of tagExamples) {
				await page.getByRole('radio', { name: example.name, exact: true }).check();
				await expect(front).toContainText(example.heading);
				await expect(page.locator('[data-shellfish-pinfed]')).toContainText(example.heading);
			}
			const clams = page.getByRole('radio', { name: 'Clams', exact: true });
			await clams.check();
			await expect(front.locator('[data-shellfish-species]')).toHaveText('Clams');
			await clams.press('ArrowRight');
			await expect(page.getByRole('radio', { name: 'Mussels', exact: true })).toBeChecked();
			await expect(front.locator('[data-shellfish-species]')).toHaveText('Mussels');
			await standard.getByRole('button', { name: 'Turn it over' }).click();
			await expect(standard.locator('[data-flip-preview]')).toHaveAttribute(
				'data-flip-side',
				'back'
			);
			await expect(standard.locator('[data-flip-face="back"]')).toContainText('APPROVED COPY');
			expect((await standard.boundingBox())!.height).toBe(standardHeight);

			const sheet = page.locator('[data-shellfish-sheet]');
			await expect(sheet.locator('[data-shellfish-sheet-tag]')).toHaveCount(6);
			await expect(sheet.locator('[data-shellfish-company]')).toHaveText(
				Array(6).fill('Example Shellfish Co.')
			);
			await expect(sheet.locator('[data-shellfish-area]')).toHaveText(
				Array(6).fill('Example growing area')
			);
			await expect(sheet.locator('[data-shellfish-species]')).toHaveText(Array(6).fill('Mussels'));
			const paper = sheet.locator('[data-shellfish-paper]');
			expect(
				Number(await paper.getAttribute('width')) / Number(await paper.getAttribute('height'))
			).toBeCloseTo(8.5 / 11, 6);
			const pinfed = page.locator('[data-shellfish-pinfed]');
			const track = pinfed.locator('[data-shellfish-feed]');
			const panelBefore = (await pinfed.boundingBox())!;
			const before = (await track.boundingBox())!;
			await pinfed.getByRole('button', { name: 'Advance the strip' }).click();
			await expect(track).toHaveAttribute('data-shellfish-feed', 'advanced');
			const panelAfter = (await pinfed.boundingBox())!;
			const after = (await track.boundingBox())!;
			expect(after.y - panelAfter.y - (before.y - panelBefore.y)).toBeLessThan(-50);
			expect(panelAfter.height).toBe(panelBefore.height);
			await expect(pinfed.locator('[data-shellfish-company]')).toHaveText(
				Array(5).fill('Example Shellfish Co.')
			);
			await pinfed.getByRole('button', { name: 'Reset the feed' }).press('Space');
			await expect(track).toHaveAttribute('data-shellfish-feed', 'start');
			expect(await track.evaluate((node) => getComputedStyle(node).transitionProperty)).toBe(
				'none'
			);
			expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
				true
			);
			await page.screenshot({
				path: `.svelte-kit/shellfish-${width}-${colorScheme}.png`,
				fullPage: true
			});
		});
	}
}

test('shellfish examples retain visible content without JavaScript', async ({ browser }) => {
	const context = await browser.newContext({
		javaScriptEnabled: false,
		viewport: { width: 390, height: 1000 }
	});
	const page = await context.newPage();
	await page.goto('/markets/shellfish');
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	await expect(page.getByRole('radio', { name: 'Harvester tags', exact: true })).toBeChecked();
	await expect(page.locator('[data-flip-face="front"] [data-shellfish-company]')).toHaveText(
		'Your Shellfish Company'
	);
	await expect(page.locator('[data-content-cta] a')).toHaveAttribute('href', '/contact');
	await expect(page.locator('[data-shellfish-sheet-tag]')).toHaveCount(6);
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
	await context.close();
});

test('pinfed feed animates while its viewport stays fixed', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'no-preference' });
	await page.goto('/markets/shellfish');
	await expect(page.locator('[data-shellfish-ready]')).toHaveAttribute(
		'data-shellfish-ready',
		'true'
	);
	const panel = page.locator('[data-shellfish-pinfed]');
	await panel.scrollIntoViewIfNeeded();
	const height = (await panel.boundingBox())!.height;
	const track = panel.locator('[data-shellfish-feed]');
	await panel.getByRole('button', { name: 'Advance the strip' }).click();
	await expect(track).toHaveAttribute('data-shellfish-feed', 'advanced');
	expect(await track.evaluate((node) => getComputedStyle(node).transitionDuration)).toBe('0.7s');
	await expect
		.poll(() =>
			track.evaluate((node) =>
				Math.round(Number.parseFloat(getComputedStyle(node).translate.split(' ')[1]))
			)
		)
		.toBe(-192);
	expect((await panel.boundingBox())!.height).toBe(height);
});
