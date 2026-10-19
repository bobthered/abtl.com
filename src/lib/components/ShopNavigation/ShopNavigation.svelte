<script lang="ts">
	// Imports
	import { A, ActionLabel, Button, Div, Form, Nav, P, Popover } from '#lib/components';
	import { afterNavigate } from '$app/navigation';
	import { ChevronDown } from '#lib/icons';
	import type { ComponentProps } from 'svelte';
	import { onMount } from 'svelte';
	import { subtleReveal } from 'sveltewind/transitions';
	import { twMerge } from 'tailwind-merge';

	// consts
	let closeTimer: ReturnType<typeof setTimeout> | undefined;

	// helpers
	const cancelClose = () => clearTimeout(closeTimer);
	const close = () => {
		cancelClose();
		isVisible = false;
		onSelect?.();
	};
	const handleFocusOut = (event: FocusEvent) => {
		if (!root?.contains(event.relatedTarget as Node | null)) scheduleClose();
	};

	const open = () => {
		cancelClose();
		isVisible = true;
	};
	const scheduleClose = () => {
		cancelClose();
		closeTimer = setTimeout(() => {
			isVisible = false;
		}, 150);
	};

	// $props()
	let { isReducedMotion = false, onSelect }: { isReducedMotion?: boolean; onSelect?: () => void } =
		$props();

	// $state
	let isVisible = $state(false);
	let root = $state<HTMLDivElement | null>(null);

	// $effects
	onMount(() => () => cancelClose());
	afterNavigate(() => {
		isVisible = false;
	});
</script>

{#snippet trigger(attributes: ComponentProps<typeof Button>)}
	<Button
		{...attributes}
		class="gap-2"
		aria-label="Shop menu"
		onclick={(event) => {
			event.preventDefault();
			isVisible = true;
		}}
	>
		Shop<ChevronDown
			class={twMerge(
				'size-3 transition-transform duration-200 motion-reduce:transition-none',
				isVisible ? 'rotate-180' : ''
			)}
			aria-hidden="true"
		/>
	</Button>
{/snippet}
<Div
	bind:element={root}
	onmouseenter={open}
	onmouseleave={scheduleClose}
	onfocusout={handleFocusOut}
>
	<Popover
		onmouseenter={cancelClose}
		onmouseleave={scheduleClose}
		bind:isVisible
		{trigger}
		gap={0}
		transition={[subtleReveal, { duration: isReducedMotion ? 0 : 240 }]}
		class="z-30 m-0 w-72 max-w-full overflow-visible border-0 bg-transparent p-0 pt-6 shadow-none inset-ring-0 dark:bg-transparent"
	>
		<Div
			data-shop-panel
			class="rounded-sm bg-white p-6 text-gray-950 shadow-lg inset-ring-1 inset-ring-gray-200 dark:bg-gray-900 dark:text-gray-50 dark:inset-ring-gray-800"
		>
			<P variants={['eyebrow']}>Your shop</P>
			<Nav aria-label="Shop navigation" class="mt-4 grid gap-4">
				<A
					href="/shop"
					onclick={() => {
						setTimeout(close, 0);
					}}
					variants={['ghost', 'navigationItem']}
				>
					<ActionLabel class="w-full justify-between">Reorder products</ActionLabel>
				</A>
				<A
					href="/shop/cart"
					onclick={() => {
						setTimeout(close, 0);
					}}
					variants={['ghost', 'navigationItem']}
				>
					<ActionLabel class="w-full justify-between">View cart</ActionLabel>
				</A>
				<Form
					method="POST"
					action="/account/sign-out"
					class="border-t border-gray-200 pt-4 dark:border-gray-800"
				>
					<Button type="submit" variants={['ghost', 'navigationItem']}>
						<ActionLabel class="w-full justify-between">Sign out</ActionLabel>
					</Button>
				</Form>
			</Nav>
		</Div>
	</Popover>
</Div>
