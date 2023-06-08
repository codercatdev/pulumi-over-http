<script lang="ts">
	export let id = '';
	let deleting = false;

	const onDelete = async () => {
		deleting = true;
		const resp = await fetch(`/api/stacks/${id}`, {
			method: 'DELETE',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		});
		if (resp.status > 200) {
			console.error(resp.statusText);
		} else {
			window.location.href = `/`;
		}
	};
</script>

<form>
	<button
		class="bcu-button bcu-button-sm variant-filled-secondary"
		on:click={() => onDelete()}
		disabled={deleting}
	>
		{#if deleting}
			Deleting...
		{:else}
			Delete Stack: {id}
		{/if}
	</button>
</form>
