<script lang="ts">
	// Imports
	import type { LayoutProps } from './$types';

	// $props()
	let { children }: LayoutProps = $props();
</script>

{@render children()}
