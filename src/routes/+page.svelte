<script lang="ts">
	import { users } from '$lib/state.svelte';
</script>

<div class="flex flex-col items-center justify-center">
	{#each users as user, i}
		<div class="flex">
			<button>{i + 1},{user.name},{user.total}</button>
		</div>
	{/each}
</div>
