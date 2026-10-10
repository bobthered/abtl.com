<script lang="ts">
	// Imports
	import {
		A,
		Br,
		Button,
		Container,
		Div,
		H3,
		P,
		Section,
		Span,
		WarehouseScene
	} from '#lib/components';
	import { ArrowRight, Boxes, Check, PackageCheck, RotateCcw, Truck } from '#lib/icons';
	import type { Snippet } from 'svelte';

	// consts
	const allocations = [2, 4, 6];
	const stages = ['Produce', 'Warehouse', 'Release'];

	// helpers
	const releaseStock = () => {
		if (stock < quantity) return;
		stock -= quantity;
		releases += 1;
	};
	const resetStock = () => {
		releases = 0;
		stock = 24;
	};

	// $props()
	let { isStandalone = false }: { isStandalone?: boolean } = $props();

	// $state
	let isStocked = $state(true);
	let quantity = $state(4);
	let releases = $state(0);
	let stock = $state(24);
</script>

{#snippet constrained(children: Snippet)}
	{#if isStandalone}<Container>{@render children()}</Container>{:else}{@render children()}{/if}
{/snippet}

{#snippet volume()}
	<Section
		variants={['dialogSection']}
		data-warehouse-section="volume"
		aria-labelledby="warehouse-volume-heading"
	>
		<Div class="grid items-center gap-12 lg:grid-cols-5 lg:gap-16">
			<Div class="lg:col-span-2">
				<P variants={['eyebrow']}>Make more at once</P>
				<H3 id="warehouse-volume-heading" class="text-4xl sm:text-5xl"
					>Think bigger.<Br />Ship in chapters.</H3
				>
				<P variants={['dialogBody']} class="mt-6"
					>A larger production run creates efficiencies that lower your unit price. You don't have
					to receive it all at once. We can warehouse your finished tags and labels, then ship
					portions as you need them.</P
				>
				<Div
					data-scroll-reveal
					class="mt-8 flex items-center gap-3 text-primary-600 dark:text-primary-300"
					><Boxes class="size-5 shrink-0" aria-hidden="true" /><Span class="text-sm font-medium"
						>One production run. Multiple releases.</Span
					></Div
				>
			</Div>
			<Div
				data-scroll-reveal
				class="overflow-hidden rounded-sm bg-gray-100 p-6 sm:p-10 lg:col-span-3 dark:bg-gray-900"
			>
				<Div class="flex items-center justify-between gap-4"
					><Span class="text-sm font-medium">Produced together</Span><Span
						class="text-xs text-gray-500 dark:text-gray-400">Released over time</Span
					></Div
				>
				<Div class="mt-8 grid grid-cols-12 gap-1.5" aria-hidden="true">
					{#each Array.from({ length: 36 }, (_, i) => i) as item (item)}
						<Div
							class={`aspect-square rounded-sm motion-safe:transition-colors motion-safe:duration-700 ${item < 12 ? 'bg-primary-500' : item < 24 ? 'bg-secondary-500' : 'bg-primary-300 dark:bg-primary-700'}`}
						/>
					{/each}
				</Div>
				<Div class="mt-8 grid grid-cols-3 gap-3">
					{#each ['First release', 'Next release', 'Held for later'] as label, index (label)}
						<Div class="rounded-sm bg-white p-3 text-center dark:bg-gray-950"
							><Span
								class={`mb-3 block h-1 rounded-sm ${index === 1 ? 'bg-secondary-500' : 'bg-primary-500'}`}
							/><P class="text-xs font-medium sm:text-sm">{label}</P></Div
						>
					{/each}
				</Div>
				<P class="mt-6 text-xs text-gray-500 dark:text-gray-400"
					>A simplified view of a split-shipment order. Quantities and release plans are arranged
					with your team.</P
				>
			</Div>
		</Div>
	</Section>
{/snippet}

{#snippet shelf()}
	<Section
		variants={['dialogSection']}
		data-warehouse-section="shelf"
		aria-labelledby="warehouse-shelf-heading"
	>
		<Div class="max-w-3xl"
			><P variants={['eyebrow']}>Your next order is already made</P><H3
				id="warehouse-shelf-heading"
				class="text-4xl sm:text-5xl">From our shelf.<Br />Into your workflow.</H3
			><P variants={['dialogBody']} class="mt-6"
				>When finished product is on the shelf, there's no new production run standing between you
				and a release. Tell us what you need shipped. Your warehoused stock is available for
				immediate release.</P
			></Div
		>
		<Div class="mt-10 grid overflow-hidden rounded-sm bg-gray-100 lg:grid-cols-3 dark:bg-gray-900">
			<Div data-scroll-reveal class="relative min-w-0 lg:col-span-2">
				<WarehouseScene class="min-h-80 sm:min-h-112" release={releases} {stock} />
				<Span class="absolute bottom-5 left-6 text-xs text-gray-500 dark:text-gray-400"
					>Illustrative warehouse & carton counts</Span
				>
			</Div>
			<Div class="flex flex-col justify-center gap-6 p-6 sm:p-8">
				<Div aria-live="polite" aria-atomic="true"
					><P variants={['eyebrow']}>On the shelf</P><P
						class="mt-2 text-6xl font-medium tabular-nums"
						data-warehouse-count
						>{stock}<Span class="ml-2 text-base text-gray-500 dark:text-gray-400">cartons</Span></P
					></Div
				>
				<Div
					><P class="mb-3 text-sm font-medium">Try a release</P><Div
						class="flex flex-wrap gap-2"
						role="group"
						aria-label="Demo release quantity"
					>
						{#each allocations as amount (amount)}<Button
								variants={['neutral', ...(quantity === amount ? ['stockSwatchSelected'] : [])]}
								aria-pressed={quantity === amount}
								onclick={() => (quantity = amount)}>{amount} cartons</Button
							>{/each}
					</Div></Div
				>
				<Button onclick={releaseStock} disabled={stock < quantity} data-warehouse-release-button
					>Release from stock <ArrowRight class="size-4" aria-hidden="true" /></Button
				>
				<P class="text-sm text-gray-600 dark:text-gray-300" role="status" data-warehouse-status
					>{releases === 0
						? 'Choose a quantity and watch it leave the shelf.'
						: `${24 - stock} cartons released. ${stock} remain for your next request.`}</P
				>
				<Button variants={['ghost']} class="self-start" onclick={resetStock}
					><RotateCcw class="size-4" aria-hidden="true" />Reset demo</Button
				>
				<P class="text-xs text-gray-500 dark:text-gray-400"
					>This demo does not place an order or request a shipment.</P
				>
			</Div>
		</Div>
	</Section>
{/snippet}

{#snippet timing()}
	<Section
		variants={['dialogSection']}
		data-warehouse-section="timing"
		aria-labelledby="warehouse-timing-heading"
	>
		<Div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
			<Div
				><P variants={['eyebrow']}>Move the waiting upstream</P><H3
					id="warehouse-timing-heading"
					class="text-4xl sm:text-5xl">Don't start the press.<Br />Start the shipment.</H3
				><P variants={['dialogBody']} class="mt-6"
					>Production takes place before the need becomes urgent. Warehousing moves that step out of
					your next release, so your team can draw on finished inventory instead of waiting for it
					to be made.</P
				><P class="mt-6 text-sm text-gray-500 dark:text-gray-400"
					>Release availability depends on remaining stock. Shipping arrangements and transit time
					are separate from production.</P
				></Div
			>
			<Div data-scroll-reveal class="rounded-sm bg-gray-100 p-6 sm:p-10 dark:bg-gray-900">
				<Div class="flex flex-wrap gap-2" role="group" aria-label="Compare order workflows"
					><Button
						variants={['neutral', ...(!isStocked ? ['stockSwatchSelected'] : [])]}
						aria-pressed={!isStocked}
						onclick={() => (isStocked = false)}>New production</Button
					><Button
						variants={['neutral', ...(isStocked ? ['stockSwatchSelected'] : [])]}
						aria-pressed={isStocked}
						onclick={() => (isStocked = true)}>Warehoused stock</Button
					></Div
				>
				<Div class="mt-8 space-y-4">
					{#each stages as stage, index (stage)}
						<Div
							class={`flex items-center gap-4 rounded-sm p-4 motion-safe:transition-all motion-safe:duration-500 ${isStocked && index < 2 ? 'bg-white/60 text-gray-500 dark:bg-gray-950/50 dark:text-gray-400' : 'bg-primary-500 text-white'}`}
							><Span
								class="flex size-9 shrink-0 items-center justify-center rounded-sm bg-current/10"
								>{#if isStocked && index < 2}<Check
										class="size-5"
										aria-hidden="true"
									/>{:else if index === 2}<Truck class="size-5" aria-hidden="true" />{:else}<Boxes
										class="size-5"
										aria-hidden="true"
									/>{/if}</Span
							><Span class="flex-1 font-medium">{stage}</Span><Span class="text-xs"
								>{isStocked && index < 2
									? 'Already done'
									: index === 2
										? 'Next shipment'
										: 'Still ahead'}</Span
							></Div
						>
					{/each}
				</Div>
				<P class="mt-6 text-sm" aria-live="polite" data-warehouse-workflow
					>{isStocked
						? 'The production work is behind you. Release from available stock.'
						: 'A new run starts with production, before finished goods are ready to ship.'}</P
				>
			</Div>
		</Div>
	</Section>
{/snippet}

<Div data-warehouse-content>
	{@render constrained(volume)}
	{@render constrained(shelf)}
	{@render constrained(timing)}
	<Section
		variants={['sampleInvitation']}
		class={isStandalone ? '' : '-mx-6 sm:-mx-8 lg:-mx-16'}
		data-warehouse-section="contact"
	>
		<Container class="flex flex-col items-center gap-6">
			<Div data-scroll-reveal><PackageCheck class="size-8" aria-hidden="true" /></Div><P
				variants={['eyebrow']}
				class="text-gray-300 dark:text-gray-600">Plan the run. Choose the releases.</P
			><H3 class="max-w-3xl text-4xl sm:text-5xl"
				>Make room for what's next.<Br />We'll hold the tags.</H3
			><P class="max-w-xl text-lg text-gray-300 dark:text-gray-600"
				>Tell us what you use, how much you need, and how often you need it. Let's plan a production
				order and a warehousing arrangement around your workflow.</P
			><A
				variants={['button.base', 'button.variant.large', 'button.variant.neutral']}
				href="mailto:sales@abtl.com?subject=Warehousing%20%26%20scheduled%20releases&body=Tags%20or%20labels%3A%0AEstimated%20total%20quantity%3A%0ATypical%20release%20quantity%3A%0ARelease%20frequency%3A%0AShip-to%20locations%3A"
				>Plan your stock & releases <ArrowRight class="size-5" aria-hidden="true" /></A
			>
		</Container>
	</Section>
</Div>
