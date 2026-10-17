<script lang="ts">
	// Imports
	import FireSuppressionContent from './_components/FireSuppressionContent.svelte';
	import { Main } from '#lib/components';
</script>

<svelte:head>
	<title>Fire Suppression | Allen-Bailey Tag &amp; Label</title>
	<meta
		name="description"
		content="Explore inspection, alarm, back flow, status and service tags, fire-service labels, and extinguisher collars. Plan a coordinated tag and label range with Allen-Bailey."
	/>
</svelte:head>

<Main id="main-content" tabindex={-1}>
	<FireSuppressionContent />
</Main>
