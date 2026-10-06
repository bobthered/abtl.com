import { theme } from 'sveltewind/theme';
import { classic } from 'sveltewind/themes';

/** Initialize shared styles only; keep customer-specific data out of the global theme. */
export function initializeTheme() {
	theme.set.theme(structuredClone(classic));
	theme.set.base(
		'container',
		'mx-auto w-[min(1280px,calc(100%-128px))] px-0 max-[1100px]:w-[calc(100%-64px)] max-[800px]:w-[calc(100%-40px)]'
	);
}
