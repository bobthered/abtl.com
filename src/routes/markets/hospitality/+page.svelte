<script lang="ts">
	// Imports
	import HospitalityContent from './_components/HospitalityContent.svelte';
	import { Main } from '#lib/components';
</script>

<svelte:head>
	<title>Hospitality | Allen-Bailey Tag &amp; Label</title>
	<meta
		name="description"
		content="Explore custom hospitality tag applications, from luggage claims and valet to coat checks, lost-and-found, laundry, amenities, and guest-room door hangers."
	/>
</svelte:head>

<Main id="main-content" tabindex={-1}><HospitalityContent /></Main>
