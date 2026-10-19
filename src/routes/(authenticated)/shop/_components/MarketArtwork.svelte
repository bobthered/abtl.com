<script lang="ts">
	// Imports
	import BeerArtwork from '../../../markets/beverage/_components/BeerArtwork.svelte';
	import { Div } from '#lib/components';
	import HospitalityArtwork from '../../../markets/hospitality/_components/HospitalityArtwork.svelte';
	import MerchandiseTag from '../../../markets/merchandise-tags/_components/MerchandiseTag.svelte';
	import ProductArtwork from '../../../markets/fire-suppression/_components/ProductArtwork.svelte';
	import ShellfishArtwork from '../../../markets/shellfish/_components/ShellfishArtwork.svelte';
	import { tags } from '../../../markets/fire-suppression/_components/products';
	import TreeTagArtwork from '../../../markets/tree-tags/_components/TreeTagArtwork.svelte';

	// $props()
	let { market }: { market: string } = $props();
</script>

<Div
	class="relative flex aspect-3/2 items-center justify-center overflow-hidden rounded-sm bg-gradient-to-br from-primary-100 via-gray-100 to-secondary-100 dark:from-primary-950 dark:via-gray-900 dark:to-secondary-950"
	aria-hidden="true"
	data-market-artwork={market}
>
	<Div class="absolute -top-12 -right-12 size-48 rounded-full bg-primary-400/10 blur-2xl" />
	<Div class="absolute -bottom-12 -left-12 size-48 rounded-full bg-secondary-400/15 blur-2xl" />
	<Div class="relative aspect-square h-full max-w-full p-2">
		{#if market === 'fire-suppression'}
			<ProductArtwork format="tag" product={tags[0]} isBackdropVisible={false} />
		{:else if market === 'shellfish'}
			<ShellfishArtwork
				area="Your harvest area"
				company="Your Shellfish Company"
				heading="HARVESTER TAG"
				species="Oysters"
			/>
		{:else if market === 'beverage'}
			<BeerArtwork concept="coast" title="COASTLINE" />
		{:else if market === 'hospitality'}
			<HospitalityArtwork fields={['GUEST NAME', 'BAG COUNT']} />
		{:else if market === 'merchandise-tags'}
			<MerchandiseTag colorClass="text-tag-manila" colorId="manila" />
		{:else if market === 'tree-tags'}
			<TreeTagArtwork shape="tree" />
		{/if}
	</Div>
</Div>
