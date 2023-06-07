<script lang="ts">
	let creating = false;
	let content = '';

	const onCreate = async () => {
		creating = true;
		console.log('CONTENT');
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
			console.error(content);
		} else {
			window.location.href = `/${respJson.id}`;
		}
	};
</script>

<form>
	<input type="text" class=" text-black" bind:value={content} />
	<button class="bcu-button variant-filled-primary" on:click={() => onCreate()} disabled={creating}>
		{#if creating}
			Creating...
		{:else}
			Create Site
		{/if}
	</button>
</form>
