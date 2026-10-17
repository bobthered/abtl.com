import { expect, test } from '@playwright/test';
import sharp from 'sharp';
import { stockColors } from './lib/data/stockColors';

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
		const introduction = page.getByRole('heading', { level: 1 }).locator('..');
		await expect(introduction.locator('a, button, input')).toHaveCount(0);
		const colors = page.getByRole('radiogroup', { name: 'Patch stock color' });
		await expect(colors.getByRole('radio')).toHaveCount(stockColors.length);
		for (const color of stockColors) {
			await colors.getByRole('radio', { name: color.name, exact: true }).check();
			await expect(
				page.locator('[data-attachment-artwork="patch"] [data-attachment-patch]')
			).toHaveClass(new RegExp(color.className));
			await expect(page.getByText(`Patch color: ${color.name}`, { exact: true })).toBeVisible();
		}
		await expect(page.locator('[data-attachment-artwork] [data-attachment-patch]')).toHaveCount(5);
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
			const items = page.locator(`[data-attachment-section="${id}"] [data-attachment-choice]`);
			await expect(items).toHaveText(labels);
			const section = page.locator(`[data-attachment-section="${id}"]`);
			for (const label of labels) {
				const button = section.getByRole('radio', { name: label, exact: true });
				await button.focus();
				await page.keyboard.press('Space');
				await expect(button).toBeChecked();
				await expect(section.locator('[data-attachment-artwork]')).toHaveAttribute(
					'data-attachment-variant',
					label
				);
			}
		}
		// Compare the eyelet center with the actual backdrop after hiding the tag.
		// A background-colored disk would differ from this backdrop in either theme.
		const tag = page.locator('[data-attachment-artwork="eyelets"] [data-attachment-tag]');
		const svg = page.locator('[data-attachment-artwork="eyelets"] svg');
		await svg.scrollIntoViewIfNeeded();
		await tag.evaluate((node) => node.classList.remove('drop-shadow-lg'));
		const box = (await svg.boundingBox())!;
		const scale = Math.min(box.width / 400, box.height / 440);
		const left = Math.round((box.width - 400 * scale) / 2 + 199.3568 * scale);
		const top = Math.round((box.height - 440 * scale) / 2 + 130.778112 * scale);
		const hole = await sharp(await svg.screenshot())
			.extract({ left, top, width: 1, height: 1 })
			.raw()
			.toBuffer();
		await tag.evaluate((node) => node.setAttribute('visibility', 'hidden'));
		const backdrop = await sharp(await svg.screenshot())
			.extract({ left, top, width: 1, height: 1 })
			.raw()
			.toBuffer();
		expect([...hole]).toEqual([...backdrop]);
		await tag.evaluate((node) => {
			node.removeAttribute('visibility');
			node.classList.add('drop-shadow-lg');
		});
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
		await expect(
			standalone.locator(`[data-attachment-section="${id}"] [data-attachment-choice]`)
		).toHaveText(labels);
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
	await section.getByRole('radio', { name: 'Knotted', exact: true }).click();
	await expect(section.locator('[data-attachment-fastening="knotted"]')).toHaveCount(1);
	await expect(section.locator('[data-attachment-fastening="looped"]')).toHaveCount(0);
	await expect(section.getByRole('radio', { name: 'Knotted', exact: true })).toBeChecked();
	await section.getByRole('radio', { name: 'Looped', exact: true }).focus();
	await page.keyboard.press('Space');
	await expect(section.locator('[data-attachment-fastening="looped"]')).toHaveCount(1);
	await expect(
		section.locator('[data-attachment-choice] [data-attachment-material="string"]')
	).toHaveCount(3);
	await expect(
		page.locator('[data-attachment-section="wire"] [data-attachment-fastening="wired"]')
	).toHaveCount(1);
});
