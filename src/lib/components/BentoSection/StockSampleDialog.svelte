<script lang="ts">
	// Imports
	import { A, Button, Card, Dialog, Div, H2, H3, P, Span } from '#lib/components';
	import { Check, X } from '#lib/icons';
	import { dismissOutside } from '#lib/attachments';
	import { fade } from 'svelte/transition';
	import { stockColorGroups } from './stockColors';

	// consts
	const allColorIds = stockColorGroups.flatMap((group) => group.colors.map((color) => color.id));

	// helpers
	const motionDuration = () =>
		typeof window === 'undefined' || matchMedia('(prefers-reduced-motion: reduce)').matches
			? 0
			: 180;
	const toggleAllColors = () => {
		selectedColorIds = isAllSelected ? [] : [...allColorIds];
	};
	const toggleColor = (id: string) => {
		selectedColorIds = selectedColorIds.includes(id)
			? selectedColorIds.filter((selectedId) => selectedId !== id)
			: [...selectedColorIds, id];
	};

	// $props()
	let { isVisible = $bindable(false) }: { isVisible?: boolean } = $props();

	// $state
	let dialogElement = $state<HTMLDialogElement | null>(null);
	let selectedColorIds = $state<string[]>([]);

	// $derived
	const isAllSelected = $derived(selectedColorIds.length === allColorIds.length);
	// Resolve the selected colors before constructing the request.
	const selectedColors = $derived(
		stockColorGroups.flatMap((group) =>
			group.colors.filter((color) => selectedColorIds.includes(color.id))
		)
	);
	const sampleHref = $derived.by(() => {
		const body = [
			'Hello Allen-Bailey team,',
			'',
			"I'd like to request stock color samples.",
			'',
			`Requested colors: ${selectedColors.map((color) => color.name).join(', ')}`,
			'Name:',
			'Company:',
			'Shipping address:',
			'Project details (optional):'
		].join('\n');
		return `mailto:sales@abtl.com?subject=${encodeURIComponent('Stock color sample request')}&body=${encodeURIComponent(body)}`;
	});

	// $effects
	$effect(() => {
		if (!dialogElement) return;
		const root = document.documentElement;
		const isAlreadyLocked = root.classList.contains('overflow-hidden');
		root.classList.add('overflow-hidden');
		return () => {
			if (!isAlreadyLocked) root.classList.remove('overflow-hidden');
		};
	});
</script>

<Dialog
	bind:element={dialogElement}
	bind:isVisible
	variants={['stockSamples']}
	aria-labelledby="stock-sample-title"
	aria-describedby="stock-sample-description"
	inTransition={[fade, { duration: motionDuration() }]}
	outTransition={[fade, { duration: motionDuration() }]}
	{@attach dismissOutside({
		contentSelector: '[data-sample-picker-card]',
		onDismiss: () => (isVisible = false)
	})}
>
	<Div class="flex min-h-full items-center justify-center p-4 sm:p-8">
		<Card variants={['samplePicker']} data-sample-picker-card>
			<Div class="flex shrink-0 items-start justify-between gap-4">
				<Div>
					<H2 id="stock-sample-title" class="text-2xl font-semibold">Request Samples</H2>
					<P id="stock-sample-description" class="mt-2 text-sm text-gray-600 dark:text-gray-300"
						>Choose one color or several to compare.</P
					>
				</Div>
				<Button
					variants={['neutral', 'icon']}
					aria-label="Close sample request"
					onclick={() => (isVisible = false)}><X class="size-5" aria-hidden="true" /></Button
				>
			</Div>
			<Div class="flex shrink-0 justify-end">
				<Button variants={['neutral']} onclick={toggleAllColors}
					>{isAllSelected ? 'Clear all' : 'Select all'}</Button
				>
			</Div>
			<Div class="min-h-0 overflow-y-auto p-1" data-sample-color-list>
				{#each stockColorGroups as group (group.id)}
					<Div class="mb-4 last:mb-0" role="group" aria-labelledby={`sample-group-${group.id}`}>
						<H3
							id={`sample-group-${group.id}`}
							class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">{group.name}</H3
						>
						<Div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
							{#each group.colors as color (color.id)}
								<Button
									variants={[
										'sampleColor',
										...(selectedColorIds.includes(color.id) ? ['stockSwatchSelected'] : [])
									]}
									aria-pressed={selectedColorIds.includes(color.id)}
									aria-label={`Select ${color.name} for samples`}
									onclick={() => toggleColor(color.id)}
									data-stock-swatch={color.id}
								>
									<Span
										class={`${color.className} size-4 shrink-0 rounded-full bg-current inset-ring-1 inset-ring-gray-950/20`}
										aria-hidden="true"
										data-color-dot
									/>
									<Span class="grow">{color.name}</Span>
									{#if selectedColorIds.includes(color.id)}<Check
											class="size-4 shrink-0 text-primary-500"
											aria-hidden="true"
										/>{/if}
								</Button>
							{/each}
						</Div>
					</Div>
				{/each}
			</Div>
			<Div
				class="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-4 dark:border-gray-800"
			>
				<P class="text-sm text-gray-600 dark:text-gray-300" aria-live="polite"
					>{selectedColors.length
						? `${selectedColors.length} ${selectedColors.length === 1 ? 'color' : 'colors'} selected`
						: 'Select colors to continue'}</P
				>
				{#if selectedColors.length}
					<A href={sampleHref} variants={['button.base']} data-stock-sample-request
						>Email sample request</A
					>
				{:else}
					<Button disabled>Email sample request</Button>
				{/if}
				<P class="w-full text-xs text-gray-600 dark:text-gray-300"
					>Opens your email app. Add your shipping details before sending.</P
				>
			</Div>
		</Card>
	</Div>
</Dialog>
