<script lang="ts">
	import { db, get, ref, onValue, getDatabase, child } from '$lib/firebase';
	import { set } from 'firebase/database';
	import { onMount } from 'svelte';
	import { auth } from '$lib/firebase';
	import { check } from '$lib/state.svelte';
	let loading = $state(false);

	const dbRef = ref(getDatabase());

	let data: any = $state();

	function add100lari() {
		if (!data?.larissamartins) {
			console.error('User not found');
			return;
		}
		console.log(JSON.stringify(data, null, 4));

		const newTotal = data.larissamartins.total + 100;
		loading = true;
		set(ref(db, 'users/larissamartins/total'), newTotal)
			.then(() => {
				check(), (loading = false);
			})
			.catch(() => {
				console.error, (loading = false);
			});
	}

	onMount(() => {
		console.log('auth.currentUser', auth.currentUser);
	});
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
