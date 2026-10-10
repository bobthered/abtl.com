<script lang="ts">
	// Imports
	import { BentoTopicContent, Container, Main, Section } from '#lib/components';
	import type { PageProps } from './$types';

	// $props()
	let { data }: PageProps = $props();
</script>

<svelte:head>
	<meta name="description" content={data.topic.description} />
</svelte:head>

<Main id="main-content" tabindex={-1}>
	<Section variants={['surface']}>
		{#if data.topic.id === 'colors' || data.topic.id === 'shipping' || data.topic.id === 'variable-data'}
			<BentoTopicContent topic={data.topic} isStandalone />
		{:else}
			<Container variants={['section']}>
				<BentoTopicContent topic={data.topic} isStandalone />
			</Container>
		{/if}
	</Section>
</Main>
