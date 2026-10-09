import '../../../routes/layout.css';
import BentoSection from './BentoSection.svelte';
import { expect, it } from 'vitest';
import { initializeTheme } from '#lib/theme.js';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';

it('scrolls a constrained card through a full-screen backdrop and restores focus on Escape', async () => {
	initializeTheme();
	render(BentoSection);
	const trigger = page.getByRole('button', { name: 'Explore Color with a purpose.' });
	await trigger.click();
	const dialog = page.getByRole('dialog', { name: 'Color with a purpose.' });
	await expect.element(dialog).toBeVisible();
	const topGap = window.innerWidth >= 640 ? 64 : 32;
	const card = dialog.element().querySelector<HTMLElement>('[data-bento-card]')!;
	await expect.poll(() => Math.round(card.getBoundingClientRect().top)).toBe(topGap);
	const element = dialog.element();
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
	expect(card.getBoundingClientRect().top).toBeLessThan(0);
	expect(card.getBoundingClientRect().bottom).toBeGreaterThan(window.innerHeight);
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
	await page.getByRole('button', { name: 'Explore Make your mark.' }).click();
	await expect.element(page.getByRole('dialog', { name: 'Make your mark.' })).toBeVisible();
	await page.getByRole('button', { name: 'Close topic', exact: true }).click();
	await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
	await page.getByRole('button', { name: 'Explore Keep every number in order.' }).click();
	const dialog = page.getByRole('dialog', { name: 'Keep every number in order.' });
	await expect.element(dialog).toBeVisible();
	expect(dialog.element().scrollTop).toBe(0);
	await page.getByRole('button', { name: 'Close topic', exact: true }).click();
	await expect.element(dialog).not.toBeInTheDocument();
});
