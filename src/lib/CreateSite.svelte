<script lang="ts">
	let creating = false;
	let content = 'Hello World!';

	const onCreate = async () => {
		creating = true;
		const resp = await fetch('/api/stacks', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id: Date.now(), content })
		});
		const respJson = await resp.json();
		if (resp.status > 200) {
			alert('Error occured, see console.');
			console.error(content);
			creating = false;
		} else {
			window.location.href = `/${respJson.id}`;
		}
	};
</script>

<form class="w-full flex gap-2">
	<textarea class="flex-1 text-black" bind:value={content} />
	<button class="bcu-button variant-filled-primary" on:click={() => onCreate()} disabled={creating}>
		{#if creating}
			Creating...
		{:else}
			Create Site
		{/if}
	</button>
</form>
