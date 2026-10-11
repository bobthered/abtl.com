<script lang="ts">
	// Imports
	import BentoSection from './_components/BentoSection/BentoSection.svelte';
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { Main } from '#lib/components';
	import { page } from '$app/state';
	import type { PageProps } from './$types';
	import ProductionMetrics from './_components/ProductionMetrics/ProductionMetrics.svelte';
	import SiteHero from './_components/SiteHero/SiteHero.svelte';
	import { type Topic, topicHref } from '#lib/data/topics.js';

	// helpers
	const navigateTopic = (topic: Topic | null) => {
		if (topic) void goto(topicHref(topic), { shallow: true, state: { bentoTopic: topic.id } });
		else if (page.shallow && page.state.bentoTopic) history.back();
	};

	// $props()
	let { data }: PageProps = $props();

	// $derived
	const topicId = $derived(browser && page.shallow ? (page.state.bentoTopic ?? null) : null);
</script>

<Main id="main-content" tabindex={-1}>
	<SiteHero />
	<BentoSection orderedTopics={data.bentoTopics} {topicId} onNavigate={navigateTopic} />
	<ProductionMetrics />
</Main>
