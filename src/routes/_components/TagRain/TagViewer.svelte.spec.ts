import { initializeTheme } from '#lib/theme.js';
import { expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import type { TagSelection } from './physics';
import TagViewer from './TagViewer.svelte';
import { createTagViewer } from './viewer';

vi.mock('./viewer', () => ({
	createTagViewer: vi.fn(() => ({ destroy: vi.fn(), setSide: vi.fn() }))
}));

const selection: TagSelection = {
	atlas: {} as TagSelection['atlas'],
	backArtwork: 0,
	color: '#ffffff',
	frontArtwork: 0,
	name: 'inspection record 01',
	patchThickness: 0.01,
	rotation: { x: 0, y: 0, z: 0, w: 1 },
	thickness: 0.02
};

it('lets visitors flip the selected design and dismiss the modal', async () => {
	initializeTheme();
	const onclose = vi.fn();
	render(TagViewer, { onclose, selection });
	await expect.element(page.getByRole('dialog')).toBeVisible();
	await expect.poll(() => vi.mocked(createTagViewer).mock.results.length).toBeGreaterThan(0);
	const preview = vi.mocked(createTagViewer).mock.results.at(-1)!.value;
	await page.getByRole('button', { name: 'Show back', exact: true }).click();
	await expect.element(page.getByRole('img', { name: 'inspection record 01, back' })).toBeVisible();
	expect(preview.setSide).toHaveBeenLastCalledWith(true);
	await page.getByRole('button', { name: 'Show front', exact: true }).click();
	await expect
		.element(page.getByRole('img', { name: 'inspection record 01, front' }))
		.toBeVisible();
	expect(preview.setSide).toHaveBeenLastCalledWith(false);
	await page.getByRole('button', { name: 'Dismiss', exact: true }).click();
	await expect.poll(() => onclose.mock.calls.length).toBe(1);
});

it('releases the preview renderer when the viewer is removed', async () => {
	initializeTheme();
	vi.mocked(createTagViewer).mockClear();
	const component = render(TagViewer, { onclose: vi.fn(), selection });
	await expect.poll(() => vi.mocked(createTagViewer).mock.results.length).toBe(1);
	const preview = vi.mocked(createTagViewer).mock.results[0].value;
	await component.unmount();
	expect(preview.destroy).toHaveBeenCalledOnce();
});
