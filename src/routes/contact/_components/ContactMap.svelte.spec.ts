import '../../layout.css';
import ContactMap from './ContactMap.svelte';
import { expect, it, vi } from 'vitest';
import { initializeTheme } from '#lib/theme.js';
import { render } from 'vitest-browser-svelte';

const state = vi.hoisted(() => ({
	maps: [] as google.maps.MapOptions[],
	circles: [] as google.maps.CircleOptions[],
	clear: vi.fn()
}));
vi.mock('../_lib/maps', () => ({
	loadGoogleMaps: async () =>
		[
			{
				Map: class {
					constructor(element: HTMLElement, options: google.maps.MapOptions) {
						element.dataset.mockGoogleMap = 'true';
						state.maps.push(options);
					}
					setOptions(options: google.maps.MapOptions) {
						state.maps.push(options);
					}
				},
				Circle: class {
					constructor(options: google.maps.CircleOptions) {
						state.circles.push(options);
					}
					setOptions(options: google.maps.CircleOptions) {
						state.circles.push(options);
					}
					setMap() {}
				},
				RenderingType: { RASTER: 'RASTER' }
			},
			{
				Geocoder: class {
					async geocode() {
						return { results: [{ geometry: { location: { lat: () => 0, lng: () => 0 } } }] };
					}
				}
			}
		] as unknown as [google.maps.MapsLibrary, google.maps.GeocodingLibrary]
}));

it('updates Google map styling from actual site theme tokens and cleans up on unmount', async () => {
	initializeTheme();
	const originalTheme = document.documentElement.dataset.theme;
	document.documentElement.dataset.theme = 'light';
	vi.stubGlobal('google', { maps: { event: { clearInstanceListeners: state.clear } } });
	const view = render(ContactMap, { apiKey: 'test-only-key' });
	try {
		await expect
			.poll(() => document.querySelector('[data-contact-map]')?.getAttribute('data-map-ready'))
			.toBe('true');
		const light = state.maps.at(-1)!;
		expect(light.styles?.some((style) => style.featureType === 'water')).toBe(true);
		const lightWater = JSON.stringify(light.styles?.find((style) => style.featureType === 'water'));
		const lightBackground = light.backgroundColor;
		const pin = state.circles.at(-1)!;
		expect(pin.fillColor).toMatch(/^#[0-9a-f]{6}$/);
		expect(pin.strokeColor).toMatch(/^#[0-9a-f]{6}$/);
		expect(pin.fillColor).not.toBe(pin.strokeColor);
		document.documentElement.dataset.theme = 'dark';
		await expect.poll(() => state.maps.at(-1)?.backgroundColor).not.toBe(lightBackground);
		expect(
			JSON.stringify(state.maps.at(-1)?.styles?.find((style) => style.featureType === 'water'))
		).not.toBe(lightWater);
		expect(document.querySelector('iframe')).toBeNull();
	} finally {
		await view.unmount();
		if (originalTheme) document.documentElement.dataset.theme = originalTheme;
		else delete document.documentElement.dataset.theme;
		vi.unstubAllGlobals();
	}
	expect(state.clear).toHaveBeenCalledOnce();
});
