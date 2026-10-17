<script lang="ts">
	// Imports
	import AttachmentsContent from './_components/AttachmentsContent.svelte';
	import { Main } from '#lib/components';
</script>

<svelte:head>
	<title>Attachments | Allen-Bailey Tag &amp; Label</title>
	<meta
		name="description"
		content="Explore tag patches, brass and zinc eyelets, steel and copper wire, white string and twine, and white or black elastic. Plan the finishing details for your tags."
	/>
</svelte:head>

<Main id="main-content" tabindex={-1}>
	<AttachmentsContent />
</Main>
