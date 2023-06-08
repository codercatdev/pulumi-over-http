<script lang="ts">
	import type { PageData } from './$types';
	import CreateSite from '$lib/CreateSite.svelte';

	export let data: PageData;
</script>

<section class="flex w-full justify-center p-8">
	<div class="flex flex-col gap-2 px-2 w-full max-w-2xl">
		<CreateSite />
		{#if data?.stacks?.length}
			{#each data.stacks as stack}
				<div class="bcu-card variant-ghost-primary p-2 flex justify-between">
					<span>Stack: <a href={`/${stack.name}`}>{stack.name}</a> </span>
					<span>Updated: {stack.lastUpdate}</span>
				</div>
			{/each}
		{:else}
			<div class="bcu-alert">No Sites Found.</div>
		{/if}
	</div>
</section>
