import { readFile, writeFile } from 'node:fs/promises';

// Keep order counts in SvelteKit's server-only directory; explicitly whitelist public fields.
const source = new URL('../src/lib/server/shipments/', import.meta.url);
const target = new URL('../src/lib/data/shipments/', import.meta.url);
const featured = JSON.parse(await readFile(new URL('featured.json', source), 'utf8'));
const points = JSON.parse(await readFile(new URL('points.json', source), 'utf8'));
const publicLocation = ({ country, countryName, id, latitude, longitude, name, state }) => ({
	country,
	...(countryName ? { countryName } : {}),
	id,
	latitude,
	longitude,
	name,
	state
});
await writeFile(
	new URL('featured.json', target),
	JSON.stringify({
		domestic: featured.domestic.map(publicLocation),
		international: featured.international.map(publicLocation)
	}) + '\n'
);
await writeFile(
	new URL('points.json', target),
	JSON.stringify(points.map(([latitude, longitude]) => [latitude, longitude])) + '\n'
);
