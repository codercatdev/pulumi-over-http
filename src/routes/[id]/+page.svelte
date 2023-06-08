<script lang="ts">
	import type { PageData } from './$types';
	import DeleteStack from '$lib/DeleteStack.svelte';

	export let data: PageData;
</script>

<section class="flex flex-col w-full justify-center p-8">
	<div class="flex flex-col gap-2 px-2">
		<a href="/">Go Back</a>
		<DeleteStack id={data.id} />

		{#if data?.url}
			<div class="flex gap-2">
				Site: <a href={`http://${data.url}/index.html`} target="_blank">{data.url}</a>
			</div>
			Preview:
			<iframe
				src={`http://${data.url}/index.html`}
				title="S3 Example"
				class="w-full h-full aspect-video"
			/>
		{:else}
			<div class="bcu-alert">No Sites Found.</div>
		{/if}
	</div>
</section>

<style>
	iframe {
		background-color: white;
		border: 1px blue;
	}
</style>
