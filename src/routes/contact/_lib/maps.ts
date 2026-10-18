import { importLibrary, setOptions } from '@googlemaps/js-api-loader';

let libraries: Promise<[google.maps.MapsLibrary, google.maps.GeocodingLibrary]> | undefined;
export const loadGoogleMaps = (key: string) => {
	if (!libraries) {
		setOptions({ key, v: 'quarterly' });
		libraries = Promise.all([importLibrary('maps'), importLibrary('geocoding')]);
	}
	return libraries;
};
