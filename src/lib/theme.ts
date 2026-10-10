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
		'svg',
		'stockTag',
		'block aspect-1/2 h-auto w-full overflow-visible drop-shadow-md drop-shadow-black/15 dark:drop-shadow-black/40'
	);
	theme.set.variant('path', 'stockPaper', 'fill-current stroke-gray-950/15 stroke-1');
	theme.set.variant('path', 'stockPatch', 'fill-tag-brown stroke-gray-950/15 stroke-1');
	theme.set.variant(
		'div',
		'stockColumns',
		'pointer-events-none absolute inset-0 mask-t-from-70% mask-t-to-100%'
	);
	theme.set.variant(
		'div',
		'stockColumnGrid',
		'grid h-full w-full origin-center grid-cols-4 gap-4 px-4 sm:grid-cols-6 sm:gap-6 sm:px-6 motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-105 motion-safe:group-focus-visible:scale-105'
	);
	theme.set.variant(
		'div',
		'stockColumnTrack',
		'flex w-full flex-col motion-safe:will-change-transform'
	);
	theme.set.variant('div', 'stockColumnCopy', 'flex shrink-0 flex-col gap-6 pb-6');
	theme.set.variant('div', 'stockFan', 'relative flex h-full w-full items-end justify-center');
	theme.set.variant(
		'div',
		'marquee',
		'flex w-full min-w-0 touch-pan-y select-none overflow-hidden rounded-sm py-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 dark:focus-visible:outline-primary-300'
	);
	theme.set.variant('div', 'marqueeTrack', 'relative flex w-max shrink-0 will-change-transform');
	theme.set.variant('div', 'marqueeCopy', 'relative flex shrink-0');
	theme.set.variant(
		'section',
		'dialogSection',
		'border-t border-gray-200 py-12 sm:py-16 dark:border-gray-800'
	);
	theme.set.variant('p', 'dialogBody', 'max-w-2xl text-gray-600 dark:text-gray-300');
	theme.set.variant('figcaption', 'dialogCaption', 'mt-4 text-sm text-gray-600 dark:text-gray-300');
	theme.set.variant('div', 'dialogBleed', '-mx-6 flex min-w-0 sm:-mx-8 lg:-mx-16');
	theme.set.variant('card', 'neutral', 'bg-gray-100 dark:bg-gray-950');
	theme.set.variant('card', 'dialogPanel', 'min-w-0 bg-gray-50 p-6 shadow-none dark:bg-gray-950');
	theme.set.variant(
		'div',
		'dialogArtwork',
		'group my-12 rounded-sm bg-gray-100 p-8 sm:p-12 dark:bg-gray-950'
	);
	theme.set.variant(
		'div',
		'stockIllustration',
		'flex min-h-72 items-center justify-center rounded-sm p-6 sm:min-h-80'
	);
	theme.set.variant('details', 'stockQuestion', 'rounded-sm bg-gray-50 p-6 dark:bg-gray-950');
	theme.set.variant(
		'summary',
		'stockQuestion',
		'cursor-pointer rounded-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 dark:focus-visible:outline-primary-300'
	);
	theme.set.variant(
		'dialog',
		'stockSamples',
		'fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto rounded-none border-0 bg-transparent p-0 shadow-none inset-ring-0 backdrop:bg-gray-950/50 backdrop:backdrop-blur-md'
	);
	theme.set.variant(
		'card',
		'samplePicker',
		'flex max-h-[calc(100dvh-2rem)] w-full max-w-3xl flex-col gap-4 overflow-hidden p-5 sm:max-h-[calc(100dvh-4rem)] sm:p-8'
	);
	theme.set.variant(
		'button',
		'sampleColor',
		'flex min-h-11 items-center justify-start gap-2 whitespace-normal bg-gray-50 px-3 py-2 text-left text-xs text-gray-950 inset-ring-1 inset-ring-gray-200 hover:bg-gray-100 hover:text-gray-950 focus:bg-gray-100 focus:text-gray-950 sm:text-sm dark:bg-gray-950 dark:text-gray-50 dark:inset-ring-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50'
	);
	theme.set.variant('button', 'large', 'min-h-16 px-8 py-5 text-lg');
	theme.set.variant(
		'button',
		'neutral',
		'bg-gray-100 text-gray-950 hover:bg-gray-200 hover:text-gray-950 focus:bg-gray-200 focus:text-gray-950 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-700 dark:hover:text-gray-50 dark:focus:bg-gray-700 dark:focus:text-gray-50'
	);
	theme.set.variant(
		'button',
		'stockSwatch',
		'relative flex flex-col items-center gap-4 whitespace-normal rounded-sm bg-gray-50 p-6 text-center text-gray-950 inset-ring-1 inset-ring-gray-200 hover:bg-gray-100 hover:text-gray-950 focus:bg-gray-100 focus:text-gray-950 dark:bg-gray-950 dark:text-gray-50 dark:inset-ring-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50'
	);
	theme.set.variant(
		'button',
		'stockSwatchSelected',
		'inset-ring-2 inset-ring-primary-500 dark:inset-ring-primary-400'
	);
	theme.set.variant(
		'div',
		'stockFanTag',
		'absolute top-1/2 -mt-3 w-24 origin-bottom -translate-y-1/2 sm:w-32 lg:w-36 motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:-mt-6 motion-safe:group-focus-visible:-mt-6'
	);
	// Keep the shared 4px focus gap outside the tile's additional 4px expansion.
	theme.set.variant(
		'button',
		'neutral-tile',
		'group relative isolate flex h-full min-w-0 flex-col items-stretch justify-between gap-6 overflow-visible rounded-sm bg-transparent p-0 text-left text-gray-950 shadow-none hover:bg-transparent hover:text-gray-950 focus:bg-transparent focus:text-gray-950 motion-safe:focus-visible:outline-offset-8 dark:bg-transparent dark:text-gray-50 dark:hover:bg-transparent dark:hover:text-gray-50 dark:focus:bg-transparent dark:focus:text-gray-50'
	);
	theme.set.variant(
		'canvas',
		'bentoOutline',
		'pointer-events-none absolute inset-0 block h-full w-full text-primary-400 [--bento-outline-secondary:var(--color-secondary-400)] opacity-0 transition-opacity duration-300 group-hover:opacity-60 dark:text-primary-500 dark:[--bento-outline-secondary:var(--color-secondary-500)] dark:group-hover:opacity-90 motion-reduce:transition-none'
	);
	theme.set.variant(
		'span',
		'bentoSurface',
		'pointer-events-none absolute inset-0 -z-10 rounded-sm bg-white inset-ring-1 inset-ring-gray-200 dark:bg-gray-900 dark:inset-ring-gray-800 motion-safe:transition-[inset] motion-safe:duration-300 motion-safe:group-hover:-inset-1 motion-safe:group-focus-visible:-inset-1'
	);
	theme.set.variant(
		'button',
		'neutral-tile-muted',
		'bg-gray-100 hover:bg-gray-100 focus:bg-gray-100 dark:bg-gray-950 dark:hover:bg-gray-950 dark:focus:bg-gray-950'
	);
	theme.set.variant('span', 'bentoSurfaceNeutral', 'bg-gray-100 dark:bg-gray-950');
	theme.set.variant(
		'dialog',
		'imageLightbox',
		'fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto rounded-none border-0 bg-transparent p-0 shadow-none inset-ring-0 backdrop:bg-gray-950/70 backdrop:backdrop-blur-md'
	);

	theme.set.variant(
		'span',
		'bentoCopy',
		'relative block pt-4 pr-18 pl-4 sm:pt-5 sm:pr-19 sm:pl-5 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:-translate-x-1 motion-safe:group-hover:-translate-y-1 motion-safe:group-focus-visible:-translate-x-1 motion-safe:group-focus-visible:-translate-y-1'
	);
	theme.set.variant(
		'div',
		'bentoPreview',
		'relative flex h-72 w-full sm:h-80 lg:h-96 items-center justify-center overflow-visible [clip-path:inset(0_round_0_0_var(--radius-sm)_var(--radius-sm))] motion-safe:transition-[clip-path] motion-safe:duration-300 motion-safe:group-hover:[clip-path:inset(0_calc(-1*var(--spacing))_calc(-1*var(--spacing))_round_0_0_var(--radius-sm)_var(--radius-sm))] motion-safe:group-focus-visible:[clip-path:inset(0_calc(-1*var(--spacing))_calc(-1*var(--spacing))_round_0_0_var(--radius-sm)_var(--radius-sm))]'
	);
	theme.set.variant(
		'div',
		'bentoDialogPreview',
		'relative flex h-56 w-full items-center justify-center overflow-visible sm:h-72 lg:h-80'
	);
	theme.set.variant(
		'span',
		'bentoExpand',
		'pointer-events-none absolute top-4 right-4 z-10 size-11 bg-gray-100 text-gray-700 sm:top-5 sm:right-5 dark:bg-gray-800 dark:text-gray-200 group-hover:bg-primary-500 group-hover:text-white group-focus-visible:bg-primary-500 group-focus-visible:text-white motion-safe:transition motion-safe:duration-300 motion-safe:group-hover:translate-x-1 motion-safe:group-hover:-translate-y-1 motion-safe:group-focus-visible:translate-x-1 motion-safe:group-focus-visible:-translate-y-1'
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
		'absolute h-48 w-24 animate-none sm:h-56 sm:w-28 rounded-sm bg-gray-200 inset-ring-1 inset-ring-gray-300 dark:bg-gray-700 dark:inset-ring-gray-600 motion-safe:transition-transform motion-safe:duration-500'
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
		'absolute h-32 w-48 animate-none sm:h-40 sm:w-60 rounded-sm bg-gray-200 inset-ring-1 inset-ring-gray-300 dark:bg-gray-700 dark:inset-ring-gray-600 motion-safe:transition-transform motion-safe:duration-500'
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
	theme.set.variant('div', 'bentoDialogHeader', 'flex justify-end py-4');
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
	theme.set.variant('section', 'heroMarquee', 'relative');
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
	theme.set.base('container', 'relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-16 xl:max-w-384');
	theme.set.variant('section', 'hero', 'relative isolate overflow-hidden');
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
		'relative z-10 border-0 bg-primary-500 pt-0 text-white dark:bg-primary-500 [&_a]:rounded-sm [&_a]:text-white [&_a:hover]:text-white [&_a:focus]:text-white [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-white [&_p]:text-white dark:[&_a]:text-white dark:[&_a:hover]:text-white dark:[&_a:focus]:text-white dark:[&_a:focus-visible]:outline-white dark:[&_p]:text-white'
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
	theme.set.variant('section', 'surface', 'bg-gray-50 dark:bg-gray-950');
	theme.set.variant('section', 'surfaceAlternate', 'bg-white dark:bg-gray-900');
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
	theme.set.variant(
		'div',
		'colorStudio',
		'group relative flex flex-col items-center overflow-hidden rounded-sm bg-gradient-to-br from-primary-100 via-gray-100 to-secondary-100 p-6 perspective-distant sm:p-8 dark:from-primary-950 dark:via-gray-800 dark:to-secondary-950'
	);
	theme.set.variant(
		'div',
		'colorStudioSide',
		'absolute top-1/2 w-28 -translate-y-1/2 transition-transform duration-700 ease-out sm:w-36 motion-reduce:transition-none'
	);
	theme.set.variant(
		'section',
		'sampleInvitation',
		'bg-gray-950 py-12 text-center text-gray-50 sm:py-16 dark:bg-gray-50 dark:text-gray-950'
	);
	theme.set.variant(
		'div',
		'shippingArtwork',
		'overflow-hidden rounded-sm bg-gradient-to-br from-primary-50 via-gray-100 to-secondary-50 dark:from-primary-950 dark:via-gray-900 dark:to-secondary-950'
	);
};
