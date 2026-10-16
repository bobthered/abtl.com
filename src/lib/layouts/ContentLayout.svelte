<script lang="ts">
	// Imports
	import { Container, Div, Section } from '#lib/components';
	import type { Snippet } from 'svelte';

	// $props()
	let {
		callToAction,
		callToActionAttributes = {},
		children,
		introduction,
		isStandalone = true
	}: {
		callToAction: Snippet;
		callToActionAttributes?: Record<string, string>;
		children: Snippet;
		introduction: Snippet;
		isStandalone?: boolean;
	} = $props();
</script>

<Div data-content-layout>
	{#if isStandalone}
		<Section variants={['surface']} data-content-title>
			<Container class="py-12 sm:py-16 lg:py-28" data-topic-introduction>
				{@render introduction()}
			</Container>
		</Section>
	{:else}
		<Div class="pt-12 pb-12 sm:pt-20 sm:pb-16" data-topic-introduction>
			{@render introduction()}
		</Div>
	{/if}
	<Div data-content-body>{@render children()}</Div>
	<Section
		{...callToActionAttributes}
		variants={isStandalone ? ['sampleInvitation'] : ['dialogSection', 'sampleInvitation']}
		class={isStandalone ? '' : '-mx-6 sm:-mx-8 lg:-mx-16'}
		data-content-cta
	>
		<Container class="flex flex-col items-center gap-6 text-center">
			{@render callToAction()}
		</Container>
	</Section>
</Div>
