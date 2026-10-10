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
		{#if ['colors', 'shipping', 'variable-data', 'warehousing', 'full-color-printing', 'synthetic-materials'].includes(data.topic.id)}
			<BentoTopicContent topic={data.topic} isStandalone />
		{:else}
			<Container variants={['section']}>
				<BentoTopicContent topic={data.topic} isStandalone />
			</Container>
		{/if}
	</Section>
</Main>
