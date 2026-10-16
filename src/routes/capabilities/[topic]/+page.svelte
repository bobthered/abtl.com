<script lang="ts">
	// Imports
	import BentoTopicContent from './_components/BentoTopicContent.svelte';
	import { Main } from '#lib/components';
	import type { PageProps } from './$types';

	// $props()
	let { data }: PageProps = $props();
</script>

<svelte:head>
	<meta name="description" content={data.topic.description} />
</svelte:head>

<Main id="main-content" tabindex={-1}>
	<BentoTopicContent topic={data.topic} isStandalone />
</Main>
