<script lang="ts">
	import { db, get, ref, onValue, getDatabase, child } from '$lib/firebase';
	import { set } from 'firebase/database';
	import { onMount } from 'svelte';
	let loading = $state(false);

	const dbRef = ref(getDatabase());

	let data: any = $state();

	function add100lari() {
		if (!data?.larissamartins) {
			console.error('User not found');
			return;
		}

		const newTotal = data.larissamartins.total + 100;
		loading = true;
		set(ref(db, 'users/larissamartins/total'), newTotal)
			.then(() => {
				check(), (loading = false);
			})
			.catch(console.error);
	}

	async function check() {
		try {
			loading = true;
			const snapshot = await get(child(dbRef, '/users'));
			data = snapshot.exists() ? snapshot.val() : null;
			console.log(data.larissamartins);
			loading = false;
		} catch (error) {
			console.error(error);
		}
	}

	onMount(() => {});
</script>

<!-- <div class="flex flex-col items-center justify-center">
	{#each users as user, i}
		<div class="flex">
			<button>{i + 1},{user.name},{user.total}</button>
		</div>
	{/each}
</div> -->
<div class="flex flex-col gap-2">
	<button
		onclick={() => {
			check();
		}}>Log Lari</button
	>
	<button
		onclick={() => {
			check();
		}}>Log Andreus</button
	>
	<button
		onclick={() => {
			add100lari();
		}}>Set Lari</button
	>
	<button>Set Andreus</button>
	{#if loading}
		<div class="w-full text-center">loading</div>
	{/if}
</div>
