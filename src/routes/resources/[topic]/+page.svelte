<script lang="ts">
	// Imports
	import { LandingPage } from '#lib/components';
	import type { PageProps } from './$types';

	// $props()
	let { data }: PageProps = $props();
</script>

<LandingPage content={data.content} />
