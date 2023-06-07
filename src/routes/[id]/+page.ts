import type { PageLoad } from "./$types";

export const load = (async ({ fetch, params }) => {
	const stacksRes = await fetch(`/api/stacks/${params.id}`);
	if (stacksRes.status > 200) {
		console.error(stacksRes.status, stacksRes.statusText)
	}
	const stacks = await stacksRes.json();
	return {
		url: stacks?.url
	}
}) satisfies PageLoad;
