import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

const standardPath = readFileSync('src/lib/assets/tag-shape.svg', 'utf8').match(
	/\sd="([^"]+)"/
)![1];

for (const colorScheme of ['light', 'dark'] as const) {
	for (const width of [390, 1440]) {
		test(`tree tags show dedicated standard and die-cut previews at ${width}px in ${colorScheme}`, async ({
			page
		}) => {
			await page.setViewportSize({ width, height: 1000 });
			await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
			await page.goto('/markets/tree-tags');
			await expect(page.locator('[data-tree-tags-ready]')).toHaveAttribute(
				'data-tree-tags-ready',
				'true'
			);
			await expect(page).toHaveTitle('Tree Tags | Allen-Bailey Tag & Label');
			await expect(page.locator('[data-content-body] > section')).toHaveCount(2);
			await expect(page.locator('[data-content-cta] a')).toHaveAttribute('href', '/contact');

			const standardSection = page.locator('#tree-standard');
			const dieCutSection = page.locator('#tree-die-cut');
			const standard = standardSection.locator('[data-tree-shape-preview="standard"]');
			const dieCut = dieCutSection.locator('[data-tree-shape-preview="tree"]');
			await expect(standardSection.getByRole('textbox')).toHaveCount(3);
			await expect(dieCutSection.getByRole('textbox')).toHaveCount(0);
			await expect(page.getByRole('radio')).toHaveCount(0);
			await expect(page.locator('[data-tree-material]')).toHaveCount(0);
			await expect(
				standard.locator('[data-flip-face="front"] [data-tree-outline]')
			).toHaveAttribute('d', standardPath);
			await expect(standard.locator('[data-flip-face="front"] [data-tree-patch]')).toHaveCount(1);
			await expect(
				dieCut.locator('[data-flip-face="front"] [data-tree-outline]')
			).not.toHaveAttribute('d', standardPath);
			const height = (await standard.boundingBox())!.height;
			await standardSection
				.getByRole('textbox', { name: 'Farm or company name' })
				.fill('Forest Ridge Nursery');
			await standardSection
				.getByRole('textbox', { name: 'Tree type', exact: true })
				.fill('Balsam Fir');
			await standardSection.getByRole('textbox', { name: 'Record number' }).fill('F-2094');
			for (const preview of [standard, dieCut]) {
				for (const side of ['front', 'back']) {
					const face = preview.locator(`[data-flip-face="${side}"]`);
					await expect(face.locator('[data-tree-company]')).toHaveText('Forest Ridge Nursery');
					await expect(face.locator('[data-tree-name]')).toHaveText('Balsam Fir');
					await expect(face.locator('[data-tree-number]')).toHaveText('F-2094');
				}
			}
			await standard.getByRole('button', { name: 'Turn it over' }).click();
			await expect(standard.locator('[data-flip-preview]')).toHaveAttribute(
				'data-flip-side',
				'back'
			);
			await expect(dieCut.locator('[data-flip-preview]')).toHaveAttribute(
				'data-flip-side',
				'front'
			);
			await dieCut.getByRole('button', { name: 'Turn it over' }).press('Space');
			await expect(dieCut.locator('[data-flip-preview]')).toHaveAttribute('data-flip-side', 'back');
			expect((await standard.boundingBox())!.height).toBe(height);

			expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
				true
			);
			await page.screenshot({
				path: `.svelte-kit/tree-tags-${width}-${colorScheme}.png`,
				fullPage: true
			});
		});
	}
}

test('tree tags render both formats and default details without JavaScript', async ({
	browser
}) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();
	await page.goto('/markets/tree-tags');
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	await expect(page.locator('[data-content-body] > section')).toHaveCount(2);
	await expect(page.locator('#tree-standard').getByRole('textbox')).toHaveCount(3);
	await expect(page.getByRole('radio')).toHaveCount(0);
	for (const preview of await page.locator('[data-flip-preview]').all()) {
		await expect(preview).toHaveAttribute('data-flip-side', 'front');
	}
	await expect(
		page.locator('#tree-standard [data-flip-face="front"] [data-tree-outline]')
	).toHaveAttribute('d', standardPath);
	await expect(
		page.locator('#tree-die-cut [data-flip-face="front"] [data-tree-outline]')
	).not.toHaveAttribute('d', standardPath);
	await context.close();
});
