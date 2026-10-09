import { theme } from 'sveltewind/theme';
import { classic } from 'sveltewind/themes';

// Keep inherited rectangular surfaces consistent; preserve intentional circles and flush edges.
const normalizeCornerRadius = (classes: string) =>
	classes.replace(
		/\brounded(?:-([trblse]|[tb][rl]|[se][se]))?(?:-(?:xs|sm|md|lg|xl|[2-4]xl))?(?=\s|$)/g,
		(_, side: string | undefined) => (side ? `rounded-${side}-sm` : 'rounded-sm')
	);

/** Initialize shared styles only; keep customer-specific data out of the global theme. */
export const initializeTheme = () => {
	const siteTheme = structuredClone(classic);
	for (const component of Object.values(siteTheme)) {
		component.base = normalizeCornerRadius(component.base);
		for (const name of Object.keys(component.variants ?? {}))
			component.variants![name] = normalizeCornerRadius(component.variants![name]);
	}
	theme.set.theme(siteTheme);
	theme.set.variant(
		'button',
		'neutral-tile',
		'group relative isolate flex h-full min-w-0 flex-col items-stretch justify-between gap-8 overflow-visible rounded-sm bg-transparent p-6 text-left text-gray-950 shadow-none hover:bg-transparent hover:text-gray-950 focus:bg-transparent focus:text-gray-950 sm:p-8 dark:bg-transparent dark:text-gray-50 dark:hover:bg-transparent dark:hover:text-gray-50 dark:focus:bg-transparent dark:focus:text-gray-50'
	);
	theme.set.variant(
		'span',
		'bentoSurface',
		'pointer-events-none absolute inset-0 -z-10 rounded-sm bg-white inset-ring-1 inset-ring-gray-200 dark:bg-gray-900 dark:inset-ring-gray-800 motion-safe:transition-[inset] motion-safe:duration-300 motion-safe:group-hover:-inset-1 motion-safe:group-focus-visible:-inset-1'
	);
	theme.set.variant(
		'span',
		'bentoCopy',
		'relative block space-y-2 pr-14 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:-translate-x-1 motion-safe:group-hover:-translate-y-1 motion-safe:group-focus-visible:-translate-x-1 motion-safe:group-focus-visible:-translate-y-1'
	);
	theme.set.variant(
		'div',
		'bentoPreview',
		'relative flex h-52 w-full items-center justify-center overflow-hidden'
	);
	theme.set.variant(
		'span',
		'bentoExpand',
		'pointer-events-none absolute top-6 right-6 z-10 size-11 bg-gray-100 text-gray-700 sm:top-8 sm:right-8 dark:bg-gray-800 dark:text-gray-200 group-hover:bg-primary-500 group-hover:text-white group-focus-visible:bg-primary-500 group-focus-visible:text-white motion-safe:transition motion-safe:duration-300 motion-safe:group-hover:translate-x-1 motion-safe:group-hover:-translate-y-1 motion-safe:group-focus-visible:translate-x-1 motion-safe:group-focus-visible:-translate-y-1'
	);
	theme.set.variant(
		'span',
		'bentoExpandIcon',
		'flex items-center justify-center [&_path]:transition-transform [&_path]:duration-300 motion-reduce:[&_path]:transition-none motion-safe:group-hover:[&_path:nth-child(-n+2)]:translate-x-0.25 motion-safe:group-hover:[&_path:nth-child(-n+2)]:-translate-y-0.25 motion-safe:group-hover:[&_path:nth-child(n+3)]:-translate-x-0.25 motion-safe:group-hover:[&_path:nth-child(n+3)]:translate-y-0.25 motion-safe:group-focus-visible:[&_path:nth-child(-n+2)]:translate-x-0.25 motion-safe:group-focus-visible:[&_path:nth-child(-n+2)]:-translate-y-0.25 motion-safe:group-focus-visible:[&_path:nth-child(n+3)]:-translate-x-0.25 motion-safe:group-focus-visible:[&_path:nth-child(n+3)]:translate-y-0.25'
	);
	theme.set.variant('skeleton', 'bento', 'animate-none bg-gray-200 dark:bg-gray-700');
	theme.set.variant(
		'skeleton',
		'bentoTag',
		'absolute h-40 w-20 animate-none rounded-sm bg-gray-200 inset-ring-1 inset-ring-gray-300 dark:bg-gray-700 dark:inset-ring-gray-600 motion-safe:transition-transform motion-safe:duration-500'
	);
	theme.set.variant(
		'skeleton',
		'fanLeft',
		'-translate-x-6 -rotate-12 bg-gray-300 dark:bg-gray-600 motion-safe:group-hover:-translate-x-9 motion-safe:group-hover:-rotate-18 motion-safe:group-focus-visible:-translate-x-9 motion-safe:group-focus-visible:-rotate-18'
	);
	theme.set.variant(
		'skeleton',
		'fanRight',
		'translate-x-6 rotate-12 bg-gray-100 dark:bg-gray-800 motion-safe:group-hover:translate-x-9 motion-safe:group-hover:rotate-18 motion-safe:group-focus-visible:translate-x-9 motion-safe:group-focus-visible:rotate-18'
	);
	theme.set.variant(
		'skeleton',
		'bentoLayer',
		'absolute h-24 w-36 animate-none rounded-sm bg-gray-200 inset-ring-1 inset-ring-gray-300 dark:bg-gray-700 dark:inset-ring-gray-600 motion-safe:transition-transform motion-safe:duration-500'
	);
	theme.set.variant(
		'skeleton',
		'layerBack',
		'translate-y-6 rotate-12 bg-gray-300 dark:bg-gray-600 motion-safe:group-hover:translate-y-8 motion-safe:group-hover:rotate-16 motion-safe:group-focus-visible:translate-y-8 motion-safe:group-focus-visible:rotate-16'
	);
	theme.set.variant(
		'skeleton',
		'layerMiddle',
		'translate-y-3 -rotate-6 bg-gray-100 dark:bg-gray-800 motion-safe:group-hover:-translate-y-1.5 motion-safe:group-hover:-rotate-9 motion-safe:group-focus-visible:-translate-y-1.5 motion-safe:group-focus-visible:-rotate-9'
	);
	theme.set.variant(
		'dialog',
		'bento',
		'fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-x-hidden overflow-y-auto overscroll-contain rounded-none border-0 bg-transparent p-0 text-gray-950 shadow-none inset-ring-0 backdrop:bg-gray-950/25 backdrop:backdrop-blur-md backdrop:opacity-100 open:backdrop:backdrop-blur-md starting:open:backdrop:opacity-100 starting:open:backdrop:backdrop-blur-md dark:bg-transparent dark:text-gray-50'
	);
	theme.set.variant(
		'div',
		'bentoDialogHeader',
		'sticky top-0 z-20 flex items-center justify-between gap-6 bg-white py-4 dark:bg-gray-900'
	);
	// Rings define full edges, outlines mark focus, and borders are reserved for side separators.
	theme.set.base(
		'fieldset',
		'min-w-0 rounded-sm p-6 inset-ring-1 inset-ring-gray-200 dark:inset-ring-gray-700'
	);
	theme.set.variant(
		'calendar',
		'bordered',
		'inset-ring-1 inset-ring-gray-200 dark:inset-ring-gray-700'
	);
	theme.set.base(
		'fileUploadDropzone',
		'flex flex-col items-center gap-3 rounded-sm bg-gray-50 p-6 text-center inset-ring-2 inset-ring-gray-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary-600 dark:bg-gray-900 dark:inset-ring-gray-700 dark:focus-within:outline-primary-300'
	);
	theme.set.variant(
		'fileUploadDropzone',
		'active',
		'bg-primary-500/5 inset-ring-primary-500 dark:bg-primary-500/5 dark:inset-ring-primary-400'
	);
	// Validation colors belong to the input's ring, not unused border colors.
	theme.set.variant('input', 'error', 'inset-ring-red-500 focus-visible:inset-ring-red-500');
	theme.set.variant('input', 'success', 'inset-ring-green-500 focus-visible:inset-ring-green-500');
	// Stripe-inspired geometry and type hierarchy; ABTL's palette stays unchanged.
	for (const heading of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']) {
		theme.update.base(heading, 'font-light leading-tight tracking-tight text-balance');
	}
	theme.set.variant(
		'p',
		'heroMetric',
		'mb-8 flex items-baseline gap-2 whitespace-nowrap text-sm font-medium text-gray-600 dark:text-gray-300'
	);
	theme.update.base('card', 'rounded-sm bg-white p-8 shadow-sm dark:bg-gray-900');
	theme.set.base(
		'tagRain',
		'absolute inset-0 z-0 hidden h-full w-full lg:block motion-reduce:hidden'
	);
	theme.set.variant(
		'div',
		'siteFrame',
		'[--site-header-height:calc(var(--spacing)*24+1px)] sm:[--site-header-height:calc(var(--spacing)*26+1px)] lg:[--site-header-height:calc(var(--spacing)*34+1px)]'
	);
	theme.set.variant(
		'div',
		'siteFrameScrolled',
		'lg:[--site-header-height:calc(var(--spacing)*22+1px)]'
	);
	theme.set.variant(
		'div',
		'heroCopy',
		'pointer-events-auto relative flex w-full max-w-3xl flex-col justify-center py-20 sm:py-24 lg:w-3/5 lg:py-28'
	);
	// Clone the opaque backing on every wrapped line instead of covering the whole copy area.
	theme.set.variant(
		'span',
		'heroText',
		'relative -left-3 box-decoration-clone rounded-sm bg-gray-50/70 px-3 py-1 dark:bg-gray-950/70 backdrop-blur'
	);
	theme.set.variant('section', 'heroMarquee', 'relative bg-gray-50 dark:bg-gray-950');
	theme.set.variant('canvas', 'tagRain', 'block h-full w-full opacity-80 dark:opacity-60');
	theme.update.base('dialog', 'rounded-sm p-8 shadow-xl');
	theme.set.variant(
		'dialog',
		'tagViewer',
		'w-full max-w-2xl bg-gray-50 p-6 text-gray-950 backdrop:bg-gray-950/60 dark:bg-gray-950 dark:text-gray-50'
	);
	theme.set.variant('canvas', 'tagViewer', 'my-4 block h-128 max-h-[65svh] w-full sm:h-160');
	theme.update.base('input', 'rounded-sm px-4 py-3 text-base leading-5');
	theme.update.base('popover', 'rounded-sm p-6');
	theme.set.variant('button', 'icon', 'flex size-11 items-center justify-center rounded-sm p-0');
	theme.set.base('container', 'relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-16');
	theme.set.variant(
		'section',
		'hero',
		'relative isolate overflow-hidden bg-gray-50 dark:bg-gray-950'
	);
	// Keep an 80px (5rem) preview below the fold, unless the minimum or content needs more room.
	theme.set.variant(
		'container',
		'hero',
		'pointer-events-none flex min-h-[max(40rem,calc(100svh-var(--site-header-height)-5rem))] items-stretch lg:min-h-[max(45rem,calc(100svh-var(--site-header-height)-5rem))]'
	);
	theme.set.variant('container', 'siteHeader', 'min-h-[calc(var(--site-header-height)-1px)]');
	theme.set.base(
		'heroBrand',
		'relative flex items-center gap-6 border-t border-gray-200/80 py-8 dark:border-gray-800'
	);
	theme.set.variant(
		'p',
		'heroDetail',
		'mb-8 flex flex-wrap items-center gap-3 text-sm font-medium tracking-normal text-gray-600 dark:text-gray-300'
	);
	theme.set.variant(
		'p',
		'heroLead',
		'mt-6 max-w-xl text-lg leading-relaxed text-gray-600 dark:text-gray-300'
	);
	theme.set.variant(
		'p',
		'heroFootnote',
		'mt-6 text-xs leading-relaxed text-gray-500 sm:text-sm dark:text-gray-400'
	);
	theme.set.variant(
		'button',
		'neutral-outline',
		'bg-white/70 text-gray-950 inset-ring-1 inset-ring-gray-300 hover:bg-white hover:text-gray-950 focus:bg-white focus:text-gray-950 dark:bg-gray-900/70 dark:text-gray-50 dark:inset-ring-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50'
	);
	theme.set.base('tagMachine', 'w-full min-w-0 py-6 lg:-mr-8 lg:w-auto');
	theme.set.variant('svg', 'machine', 'block h-auto w-full overflow-visible');
	theme.set.variant('path', 'machineAccent', 'fill-abtl-red-600 stroke-abtl-red-700 stroke-1');
	theme.set.variant('path', 'machineBelt', 'fill-abtl-red-400');
	theme.set.variant(
		'path',
		'machineFront',
		'fill-gray-200 stroke-gray-300 stroke-1 dark:fill-gray-700 dark:stroke-gray-600'
	);
	theme.set.variant('path', 'machineInk', 'fill-abtl-blue-700');
	theme.set.variant('path', 'machinePaper', 'fill-tag-manila stroke-tag-brown stroke-1');
	theme.set.variant('path', 'machinePatch', 'fill-tag-buff stroke-tag-brown stroke-1');
	theme.set.variant('path', 'machineRoll', 'fill-tag-buff stroke-tag-brown stroke-1');
	theme.set.variant('path', 'machineRollFace', 'fill-tag-manila stroke-tag-brown stroke-1');
	theme.set.variant('path', 'machineShadow', 'fill-gray-200/50 dark:fill-gray-800/50');
	theme.set.variant(
		'path',
		'machineSide',
		'fill-gray-300 stroke-gray-400 stroke-1 dark:fill-gray-800 dark:stroke-gray-600'
	);
	theme.set.variant('path', 'machineSpindle', 'fill-white');
	theme.set.variant(
		'path',
		'machineTop',
		'fill-white stroke-gray-300 stroke-1 dark:fill-gray-600 dark:stroke-gray-500'
	);
	theme.set.base(
		'floatingTags',
		'pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-35 dark:opacity-12.5'
	);
	theme.set.base('floatingTag', 'absolute pointer-events-none');
	theme.set.variant('floatingTag', 'far', 'w-10 sm:w-14');
	theme.set.variant('floatingTag', 'middle', 'w-16 sm:w-24');
	theme.set.variant('floatingTag', 'near', 'w-28 sm:w-40');
	theme.set.base(
		'tagSettings',
		'fixed inset-x-4 bottom-4 z-30 max-h-3/4 overflow-auto rounded-sm bg-white p-5 text-sm text-gray-950 shadow-xl inset-ring-1 inset-ring-gray-200 sm:inset-x-auto sm:right-4 sm:w-80 dark:bg-gray-950 dark:text-gray-50 dark:inset-ring-gray-800'
	);
	theme.set.base('tag', 'block aspect-1/2 h-auto w-full');
	theme.set.variant('path', 'tagPatch', 'fill-tag-buff stroke-tag-brown stroke-1');
	theme.set.base('logo', 'inline-block h-auto w-32');
	theme.set.variant('logo', 'onSurface', 'dark:[&_path]:fill-white');
	theme.set.variant('logo', 'site', 'w-20 sm:w-24');
	theme.update.base(
		'button',
		'inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-5 py-3 text-sm leading-5 font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 motion-reduce:transition-none text-white dark:text-white dark:focus-visible:outline-primary-300'
	);
	theme.update.base('p', 'text-base leading-relaxed dark:text-gray-50');
	theme.set.variant(
		'a',
		'accent',
		'font-medium text-primary-600 hover:text-primary-700 dark:text-primary-300 dark:hover:text-primary-200'
	);
	theme.set.variant(
		'a',
		'brand',
		'flex shrink-0 flex-col items-center gap-1 text-gray-950 hover:text-gray-950 dark:text-gray-50 dark:hover:text-gray-50'
	);
	theme.set.variant(
		'a',
		'navigation',
		'py-3 text-sm font-medium hover:text-primary-600 dark:hover:text-primary-300'
	);
	theme.set.variant(
		'a',
		'skip',
		'fixed top-3 left-3 z-30 -translate-y-24 rounded-sm bg-gray-50 px-5 py-3 text-primary-600 focus:translate-y-0 dark:bg-gray-950 dark:text-primary-300'
	);
	theme.set.variant('article', 'industry', 'border-t border-gray-200 pt-6 dark:border-gray-800');
	theme.set.variant('article', 'product', 'space-y-6 rounded-sm bg-white dark:bg-gray-950');
	theme.set.variant('button', 'cta', 'max-w-full gap-3 whitespace-normal');
	theme.set.variant('container', 'section', 'space-y-4 py-20 lg:py-28');
	theme.set.variant(
		'footer',
		'site',
		'relative z-10 border-0 bg-primary-500 pt-0 text-white dark:bg-primary-500 [&_a]:text-white [&_a:hover]:text-white [&_p]:text-white dark:[&_a]:text-white dark:[&_a:hover]:text-white dark:[&_p]:text-white'
	);
	theme.set.variant(
		'h1',
		'hero',
		'text-5xl font-light leading-tight tracking-tight text-gray-950 sm:text-6xl lg:text-7xl dark:text-gray-50'
	);
	theme.set.variant(
		'h2',
		'section',
		'text-3xl font-light leading-tight tracking-tight text-gray-950 sm:text-4xl lg:text-5xl dark:text-gray-50'
	);
	theme.set.variant(
		'h3',
		'item',
		'mt-6 mb-3 text-2xl font-normal leading-tight tracking-tight text-gray-950 dark:text-gray-50'
	);
	theme.set.variant(
		'header',
		'site',
		'sticky top-0 z-20 border-0 border-b border-gray-200 bg-white backdrop-blur-none dark:border-gray-800 dark:bg-gray-950'
	);
	theme.set.variant(
		'img',
		'hero',
		'block h-auto w-full rounded-sm mix-blend-multiply dark:mix-blend-normal'
	);
	theme.set.variant(
		'span',
		'productionTotal',
		'font-semibold text-abtl-blue-700 tabular-nums dark:text-primary-300'
	);
	theme.set.variant('p', 'body', 'text-base leading-relaxed');
	theme.set.variant('p', 'description', 'my-6 max-w-xl text-lg leading-relaxed');
	theme.set.variant('p', 'eyebrow', 'mb-4 text-base font-semibold tracking-normal');
	theme.set.variant('p', 'footer', 'text-sm leading-relaxed text-gray-600 dark:text-gray-300');
	theme.set.variant('p', 'lead', 'mt-6 max-w-xl text-lg leading-relaxed lg:text-xl');
	// Important insets override Popover's anchor positioning for the viewport-sized menu.
	theme.set.variant(
		'popover',
		'navigation',
		'inset-0! m-0! h-dvh max-h-none w-full max-w-none rounded-none bg-white p-0 shadow-none inset-ring-0 dark:bg-gray-950 data-anchored:[position-anchor:auto] data-anchored:[position-area:none] lg:hidden'
	);
	theme.set.variant(
		'section',
		'contrast',
		'bg-gray-900 dark:bg-gray-50 [&_h2]:text-gray-50 [&_p]:text-gray-50 dark:[&_h2]:text-gray-950 dark:[&_p]:text-gray-950'
	);
	theme.set.variant('section', 'surface', 'bg-white dark:bg-gray-950');
	theme.set.variant('span', 'brandDetail', 'text-xs font-bold tracking-widest uppercase');
	theme.set.variant(
		'span',
		'brandName',
		'text-2xl leading-none font-bold tracking-tighter xl:text-3xl'
	);
	theme.set.variant(
		'span',
		'index',
		'text-xs tracking-wide text-primary-600 dark:text-primary-300'
	);
	theme.set.variant(
		'svg',
		'arrow',
		'size-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none'
	);
};
