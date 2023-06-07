<script lang="ts">
	import type { PageData } from './$types';
	import CreateSite from '$lib/CreateSite.svelte';

	export let data: PageData;
</script>

<section class="flex w-full justify-center p-8">
	<div class="w-2/3 flex flex-col gap-2 px-2">
		{#if data?.stacks?.length}
			{#each data.stacks as stack}
				<div class="bcu-card variant-ghost-primary p-2 flex justify-between">
					<span>Name: <a href={`/${stack.name}`}>{stack.name}</a> </span>
					<span>Updated: {stack.lastUpdate}</span>
					<span>In Progress: {stack.updateInProgress}</span>
					<span>Current: {stack.current}</span>
				</div>
			{/each}
		{:else}
			<div class="bcu-alert">No Sites Found.</div>
		{/if}
	</div>
	<div class="w-1/3">
		<CreateSite />
	</div>
</section>
