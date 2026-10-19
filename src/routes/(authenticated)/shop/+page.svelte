<script lang="ts">
	// Imports
	import {
		A,
		Button,
		Container,
		Div,
		Form,
		H1,
		H2,
		H3,
		Input,
		Label,
		Main,
		P,
		Section,
		Select
	} from '#lib/components';
	import type { PageProps } from './$types';
	import ProductArtwork from '../../markets/fire-suppression/_components/ProductArtwork.svelte';

	// $props()
	let { data, form }: PageProps = $props();
</script>

<svelte:head>
	<title>Reorder Your Products | Allen-Bailey</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>
<Main id="main-content" tabindex={-1}>
	<Section id="previous-orders" variants={['surface']} aria-labelledby="previous-orders-heading">
		<Container class="py-12 sm:py-16">
			<P variants={['eyebrow']}>Your shop / Order history</P><H1
				id="previous-orders-heading"
				class="text-3xl sm:text-4xl"
			>
				Reorder your products.
			</H1>
			<P class="mt-4 max-w-2xl text-gray-600 dark:text-gray-300">
				Search order and PO numbers, SKUs, descriptions, references, artwork, or dates. Narrow the
				results by product type and order date to find the exact item you need.
			</P>

			<P class="mt-4 text-sm text-gray-500 dark:text-gray-400">
				Demo order history / No live ordering or payments.
			</P>
			{#if form?.message}<Div
					role="status"
					class="mt-8 rounded-sm bg-white p-6 inset-ring-1 inset-ring-primary-300 dark:bg-gray-900"
				>
					<H2 class="text-2xl">{form.draft ? 'Review your selection' : 'Check your request'}</H2>
					<P class="mt-3">{form.message}</P>
					{#if form.draft}<P class="mt-4 font-medium">{form.draft.type}: {form.draft.product}</P><P
							class="mt-2"
						>
							Quantity: {form.draft.quantity.toLocaleString()}
						</P><P class="mt-2">{form.draft.reference}</P><P class="mt-2 whitespace-pre-wrap">
							{form.draft.details}
						</P><P class="mt-4 text-sm text-gray-600 dark:text-gray-300">
							Current pricing, availability, and artwork must be confirmed before an order can be
							placed.
						</P>{/if}
				</Div>{/if}
			<Form
				method="GET"
				action="/shop#previous-orders"
				class="my-8 grid items-end gap-4 rounded-sm bg-gray-50 p-6 md:grid-cols-2 lg:grid-cols-4 dark:bg-gray-950"
			>
				<Div class="md:col-span-2">
					<Label for="order-search">Search previous orders</Label><Input
						id="order-search"
						name="q"
						type="search"
						value={data.filters.q}
						maxlength={120}
						placeholder="Order, PO, SKU, description, artwork, or date"
						class="mt-2 w-full"
					/>
				</Div>
				<Div class="md:col-span-2">
					<Label for="order-type">Product type</Label><Select
						id="order-type"
						name="type"
						value={data.filters.type}
						options={[
							{ label: 'All product types', value: '' },
							...data.products.map((product) => ({ label: product.name, value: product.id }))
						]}
						class="mt-2 w-full"
					/>
				</Div>
				<Div>
					<Label for="order-from">Order date from</Label><Input
						id="order-from"
						name="from"
						type="date"
						value={data.filters.from}
						class="mt-2 w-full"
					/>
				</Div>
				<Div>
					<Label for="order-to">Order date to</Label><Input
						id="order-to"
						name="to"
						type="date"
						value={data.filters.to}
						class="mt-2 w-full"
					/>
				</Div>
				<Div>
					<Label for="order-sort">Sort results</Label><Select
						id="order-sort"
						name="sort"
						value={data.filters.sort}
						options={[
							{ label: 'Newest first', value: 'newest' },
							{ label: 'Oldest first', value: 'oldest' },
							{ label: 'SKU', value: 'sku' }
						]}
						class="mt-2 w-full"
					/>
				</Div>
				<Div class="flex flex-wrap items-center gap-4">
					<Button type="submit">Search orders</Button><A href="/shop#previous-orders">
						Reset filters
					</A>
				</Div>
			</Form>
			{#if data.filterError}<P role="alert" class="mb-4 text-red-600 dark:text-red-300">
					{data.filterError}
				</P>{/if}
			<P class="mb-4 text-sm text-gray-600 dark:text-gray-300" role="status">
				{data.pagination.total} matching {data.pagination.total === 1
					? 'product'
					: 'products'}{#if data.pagination.total > 0}
					&nbsp;/ Showing {data.pagination.first}-{data.pagination.last}{/if}
			</P>
			<Div class="grid gap-4">
				{#each data.orders as order (order.id)}
					<Div
						class="grid items-start gap-4 rounded-sm bg-gray-50 p-4 inset-ring-1 inset-ring-gray-200 sm:p-6 lg:grid-cols-12 dark:bg-gray-950 dark:inset-ring-gray-800"
					>
						<Div class="flex gap-4 lg:col-span-7">
							<Div
								class="flex size-24 shrink-0 items-center justify-center rounded-sm bg-gradient-to-br from-primary-100 to-secondary-100 sm:size-32 dark:from-primary-950 dark:to-secondary-950"
								aria-hidden="true"
							>
								<ProductArtwork
									format={order.product.format}
									product={order.product}
									isBackdropVisible={false}
								/>
							</Div>
							<Div class="min-w-0">
								<P class="text-xs text-gray-500 dark:text-gray-400">SKU {order.sku}</P><H3
									class="mt-1 text-xl"
								>
									{order.product.name}
								</H3><P class="mt-2">{order.description}</P><P
									class="mt-2 text-sm text-gray-600 dark:text-gray-300"
								>
									{order.reference}
								</P><P class="mt-2 text-xs text-gray-500 dark:text-gray-400">
									Illustrative preview / not an approved proof
								</P>
							</Div>
						</Div>
						<Div class="text-sm lg:col-span-2">
							<P class="font-medium">{order.orderNumber}</P><P class="mt-2">
								PO: {order.poNumber}
							</P><P class="mt-2 text-gray-600 dark:text-gray-300">Ordered: {order.date}</P><P
								class="mt-2 break-words text-gray-600 dark:text-gray-300"
							>
								Artwork: {order.artwork}
							</P><P class="mt-2 text-gray-600 dark:text-gray-300">
								Previous quantity: {order.quantity.toLocaleString()}
							</P>
						</Div>
						<Form
							method="POST"
							action="?/reorder"
							aria-label={`Reorder ${order.sku}`}
							class="grid gap-4 lg:col-span-3"
						>
							<Input type="hidden" name="orderId" value={order.id} />
							<Div>
								<Label for={`quantity-${order.id}`}>Reorder quantity</Label><Input
									id={`quantity-${order.id}`}
									name="quantity"
									type="number"
									min={1}
									max={9999999}
									step={1}
									required
									value={order.quantity}
									class="mt-2 w-full"
								/>
							</Div>
							<Button type="submit">Review reorder</Button>
						</Form>
					</Div>
				{:else}<Div class="rounded-sm bg-gray-50 p-8 dark:bg-gray-950">
						<H3 class="text-xl">
							{data.query || data.filters.type || data.filters.from || data.filters.to
								? 'No matching orders.'
								: 'No previous orders yet.'}
						</H3><P class="mt-3">
							Try different filters or contact us for help finding an older order.
						</P>
					</Div>{/each}
			</Div>
			{#if data.pagination.pageCount > 1}<Div
					class="mt-6 flex flex-wrap items-center justify-between gap-4"
					role="navigation"
					aria-label="Order result pages"
				>
					<P class="text-sm">Page {data.pagination.page} of {data.pagination.pageCount}</P>
					<Div class="flex gap-4">
						{#if data.previousHref}<A
								href={data.previousHref}
								variants={['button.base', 'button.variant.neutral-outline']}
							>
								Previous page
							</A>{/if}{#if data.nextHref}<A
								href={data.nextHref}
								variants={['button.base', 'button.variant.neutral-outline']}
							>
								Next page
							</A>{/if}
					</Div>
				</Div>{/if}
		</Container>
	</Section>
</Main>
