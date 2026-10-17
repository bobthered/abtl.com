import { expect, test } from '@playwright/test';
import { applications } from './routes/markets/hospitality/_components/applications';

for (const colorScheme of ['light', 'dark'] as const) {
	for (const width of [390, 1440]) {
		test(`hospitality previews work at ${width}px in ${colorScheme}`, async ({ page }) => {
			await page.setViewportSize({ width, height: 1000 });
			await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
			await page.goto('/markets/hospitality');
			await expect(page.locator('[data-hospitality-ready]')).toHaveAttribute(
				'data-hospitality-ready',
				'true'
			);
			await expect(page).toHaveTitle('Hospitality | Allen-Bailey Tag & Label');
			await expect(page.locator('[data-content-body] > section')).toHaveCount(3);
			await expect(page.locator('[data-content-cta] a')).toHaveAttribute('href', '/contact');
			await page.getByRole('textbox', { name: 'Property name' }).fill('Your Grand Hotel');
			await page.getByRole('textbox', { name: 'Claim number' }).fill('04732');
			const claim = page.locator('[data-hospitality-claim]');
			await expect(claim.locator('[data-hospitality-number]')).toHaveText(Array(7).fill('04732'));
			await expect(claim.locator('[data-hospitality-property]')).toHaveText('Your Grand Hotel');

			await expect(claim.locator('[data-luggage-label]')).toHaveCount(6);
			const labelBefore = (await claim.locator('[data-luggage-label="1"]').boundingBox())!;
			const claimBefore = (await claim.boundingBox())!;
			await claim.getByRole('button', { name: 'Peel a luggage label' }).click();
			await expect(claim.locator('[data-luggage-claim]')).toHaveAttribute(
				'data-luggage-label-separated',
				'true'
			);
			const labelAfter = (await claim.locator('[data-luggage-label="1"]').boundingBox())!;
			const claimAfter = (await claim.boundingBox())!;
			expect(labelAfter.x - claimAfter.x - (labelBefore.x - claimBefore.x)).toBeGreaterThan(5);
			await expect(claim).toHaveAttribute('data-claim-separated', 'false');
			const panelBefore = (await claim.boundingBox())!;
			const height = panelBefore.height;
			const before = (await claim.locator('[data-luggage-stub]').boundingBox())!;
			await claim.getByRole('button', { name: 'Separate the claim check' }).click();
			await expect(claim).toHaveAttribute('data-claim-separated', 'true');
			const after = (await claim.locator('[data-luggage-stub]').boundingBox())!;
			// The illustration separates while the surrounding viewport stays fixed.
			const panelAfter = (await claim.boundingBox())!;
			expect(after.y - panelAfter.y - (before.y - panelBefore.y)).toBeGreaterThan(5);
			expect((await claim.boundingBox())!.height).toBe(height);
			await expect(claim.locator('[data-hospitality-number]')).toHaveText(Array(7).fill('04732'));
			await claim.getByRole('button', { name: 'Rejoin the example' }).press('Space');
			await expect(claim).toHaveAttribute('data-claim-separated', 'false');
			await claim.getByRole('button', { name: 'Replace the luggage label' }).click();
			await expect(claim.locator('[data-luggage-claim]')).toHaveAttribute(
				'data-luggage-label-separated',
				'false'
			);
			const group = page.getByRole('radiogroup', { name: 'Hospitality tag application' });
			await expect(group.getByRole('radio')).toHaveCount(applications.length);
			const applicationPreview = page.locator('[data-hospitality-application]');
			const applicationHeight = (await applicationPreview.boundingBox())!.height;
			for (const application of applications) {
				await group.getByRole('radio', { name: application.name, exact: true }).check();
				await expect(applicationPreview).toHaveAttribute(
					'data-hospitality-application',
					application.id
				);
				await expect(applicationPreview).toContainText(application.printTitle);
				await expect(
					page.getByRole('heading', { name: application.title, exact: true })
				).toBeVisible();
				expect((await applicationPreview.boundingBox())!.height).toBe(applicationHeight);
			}
			await group.getByRole('radio').first().press('ArrowRight');
			await expect(group.getByRole('radio').nth(1)).toBeChecked();
			const door = page.locator('[data-hospitality-door]');
			await door.getByRole('button', { name: 'Turn it over' }).click();
			await expect(door.locator('[data-flip-preview]')).toHaveAttribute('data-flip-side', 'back');
			await expect(door.locator('[data-flip-face="back"]')).toContainText('PLEASE SERVICE ROOM');
			await expect(door.locator('[data-flip-face="back"] [data-hospitality-property]')).toHaveText(
				'Your Grand Hotel'
			);
			expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
				true
			);
			await page.screenshot({
				path: `.svelte-kit/hospitality-${width}-${colorScheme}.png`,
				fullPage: true
			});
		});
	}
}

test('hospitality applications remain discoverable without JavaScript', async ({ browser }) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();
	await page.goto('/markets/hospitality');
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	await expect(page.getByRole('heading', { name: /Their bag/ })).toBeAttached();
	for (const application of applications) {
		await expect(page.getByRole('radio', { name: application.name, exact: true })).toBeAttached();
	}
	await expect(page.locator('[data-hospitality-claim] [data-hospitality-number]')).toHaveText(
		Array(7).fill('02841')
	);
	await expect(page.locator('[data-hospitality-door] [data-flip-preview]')).toHaveAttribute(
		'data-flip-side',
		'front'
	);
	await context.close();
});

test('variable-data tickets share the six-label layout and retain real matching codes', async ({
	page
}) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/capabilities/variable-data');
	await expect(page.locator('[data-topic-ready="true"]').first()).toBeVisible();
	const ticket = page.locator('[data-variable-ticket]');
	await expect(ticket).toHaveAttribute('data-variable-ticket', '612000');
	await expect(ticket.locator('[data-luggage-label]')).toHaveCount(6);
	await expect(ticket.locator('[data-variable-matrix]')).toHaveCount(7);
	await expect(ticket.locator('[data-variable-reference]')).toHaveText([
		'612000-1',
		'612000-2',
		'612000-3',
		'612000-4',
		'612000-5',
		'612000-6',
		'612000'
	]);
	for (const code of await ticket.locator('[data-variable-matrix]').all()) {
		await expect(code).toHaveCSS('mix-blend-mode', 'multiply');
		expect(await code.getAttribute('data-encoded-value')).toMatch(/^001\/612000(?:-[1-6])?$/);
	}
	await page.getByRole('radio', { name: 'Sample 002, reference 612001' }).check();
	await expect(ticket).toHaveAttribute('data-variable-ticket', '612001');
	await expect(ticket.locator('[data-variable-matrix]').first()).toHaveAttribute(
		'data-encoded-value',
		'002/612001-1'
	);
	await expect(ticket.locator('[data-variable-matrix]').last()).toHaveAttribute(
		'data-encoded-value',
		'002/612001'
	);
});
