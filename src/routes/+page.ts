import type { PageLoad } from "./$types";

export const load = (async ({ fetch }) => {
	const stacksRes = await fetch('/api/stacks');
	const stacks = await stacksRes.json();

	return {
		stacks: stacks?.sort((a: { lastUpdate: string | number | Date; }, b: { lastUpdate: string | number | Date; }) => a?.lastUpdate && b?.lastUpdate && new Date(b.lastUpdate).valueOf() - new Date(a.lastUpdate).valueOf())
	}
}) satisfies PageLoad;
