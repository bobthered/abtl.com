import { expect, test } from '@playwright/test';

const variants = {
	eyelets: ['3/16" brass', '3/8" brass', '3/16" zinc', '1/4" zinc'],
	wire: ['21 gauge steel', '23 gauge steel', '26 gauge steel', '21 gauge copper'],
	string: ['#5 white', '#9 white', '#9 twine'],
	elastic: ['White', 'Black']
};

for (const colorScheme of ['light', 'dark'] as const) {
	test(`attachment sections show the supplied options in ${colorScheme} mode`, async ({ page }) => {
		await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
		await page.goto('/capabilities/attachments');
		await expect(page).toHaveTitle('Attachments | Allen-Bailey Tag & Label');
		await expect(page.locator('[data-attachment-section]')).toHaveCount(5);
		await expect(page.getByRole('link', { name: /^Discuss/i })).toHaveCount(0);
		await expect(page.locator('[data-attachment-section]').first()).toHaveAttribute(
			'data-attachment-ready',
			'true',
			{ timeout: 60000 }
		);
		for (const [id, name] of [
			['patch', 'Patch'],
			['eyelets', 'Eyelets'],
			['wire', 'Wire'],
			['string', 'String'],
			['elastic', 'Elastic']
		]) {
			const section = page.locator(`[data-attachment-section="${id}"]`);
			await expect(section.getByRole('heading', { name, exact: true })).toBeVisible();
		}
		for (const [id, labels] of Object.entries(variants)) {
			const items = page.locator(`[data-attachment-section="${id}"] li`);
			await expect(items).toHaveText(labels);
			const section = page.locator(`[data-attachment-section="${id}"]`);
			for (const label of labels) {
				const button = section.getByRole('button', { name: label, exact: true });
				await button.focus();
				await page.keyboard.press('Enter');
				await expect(button).toHaveAttribute('aria-pressed', 'true');
				await expect(section.locator('[data-attachment-artwork]')).toHaveAttribute(
					'data-attachment-variant',
					label
				);
			}
		}
		for (const width of [1440, 390]) {
			await page.setViewportSize({ width, height: 1000 });
			const attachmentsHeading = await page
				.getByRole('heading', { level: 1 })
				.evaluate((node) => getComputedStyle(node).fontSize);
			const attachmentWidth = await page
				.locator('main')
				.getByRole('heading', { level: 1 })
				.evaluate((node) => node.parentElement!.getBoundingClientRect().width);
			expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
				true
			);
			await page.goto('/capabilities/synthetic-materials');
			expect(
				await page
					.getByRole('heading', { level: 1 })
					.evaluate((node) => getComputedStyle(node).fontSize)
			).toBe(attachmentsHeading);
			expect(
				await page
					.getByRole('heading', { level: 1 })
					.evaluate((node) => node.parentElement!.getBoundingClientRect().width)
			).toBe(attachmentWidth);
			await page.goto('/capabilities/attachments');
		}
		await page.screenshot({
			path: `.svelte-kit/attachments-${colorScheme}-mobile.png`,
			fullPage: true
		});
	});
}

test('attachment sections and specifications are discoverable without JavaScript', async ({
	browser,
	page
}) => {
	await page.goto('/capabilities/attachments');
	const context = await browser.newContext({ javaScriptEnabled: false });
	const standalone = await context.newPage();
	await standalone.goto(new URL('/capabilities/attachments', page.url()).href);
	await expect(standalone.locator('[data-attachment-section]')).toHaveCount(5);
	for (const [id, labels] of Object.entries(variants))
		await expect(standalone.locator(`[data-attachment-section="${id}"] li`)).toHaveText(labels);
	await context.close();
});

test('string finishing styles update the tag while material samples stay simple', async ({
	page
}) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/capabilities/attachments');
	const section = page.locator('[data-attachment-section="string"]');
	await expect(section).toHaveAttribute('data-attachment-ready', 'true');
	await expect(section.locator('[data-attachment-fastening="looped"]')).toHaveCount(1);
	await expect(
		section.locator('[data-attachment-choice] [data-attachment-material="string"]')
	).toHaveCount(3);
	await section.getByRole('button', { name: 'Knotted', exact: true }).click();
	await expect(section.locator('[data-attachment-fastening="knotted"]')).toHaveCount(1);
	await expect(section.locator('[data-attachment-fastening="looped"]')).toHaveCount(0);
	await expect(section.getByRole('button', { name: 'Knotted', exact: true })).toHaveAttribute(
		'aria-pressed',
		'true'
	);
	await section.getByRole('button', { name: 'Looped', exact: true }).focus();
	await page.keyboard.press('Enter');
	await expect(section.locator('[data-attachment-fastening="looped"]')).toHaveCount(1);
	await expect(
		section.locator('[data-attachment-choice] [data-attachment-material="string"]')
	).toHaveCount(3);
	await expect(
		page.locator('[data-attachment-section="wire"] [data-attachment-fastening="wired"]')
	).toHaveCount(1);
});
