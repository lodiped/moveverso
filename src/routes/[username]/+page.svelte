<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { runTransaction, get } from 'firebase/database';
	import { db, ref } from '$lib/firebase';
	import { userArray, check, sumConquistasCalc, isAdmin } from '$lib/state.svelte';
	import type { UserConquista, UserType } from '$lib/types.svelte';
	import Userheader from '$lib/Components/Userheader.svelte';
	import Leaderboard from '$lib/Components/Leaderboard.svelte';
	import Adminpanel from '$lib/Components/Adminpanel.svelte';

	let person: any = $state();
	let userId: number | undefined | null = $state();

	let username = $derived(page.params.username);
	let message = $state('loading');
	let loading = $state(false);
	let userData = $state<{ name: string; total: number } | null>(null);
	let imgsrc: string = $state('');
	let u: any = $state();
	let user = $state({} as UserType);

	async function updateUI() {
		u = userArray.value[userId!];
		user.id = u.id;
		user.ingress = u.ingress;
		user.name = u.name;
		user.fase = u.fase;
		user.nivel = u.nivel;
		user.total = u.total;
		user.current = u.current;
		user.gender = u.gender;
		user.conquistas = u.conquistas;
		imgsrc = `/assets/${user.fase}${user.nivel}.png`;
		sumConquistasCalc(userId!);
	}

	async function addSomething(n: number, uid: string) {
		if (typeof n !== 'number') return;
		loading = true;
		try {
			await runTransaction(ref(db, `users/${uid}/total`), (total) => {
				if (total + n < 0) {
					total = 0;
					return total;
				}

				return total + n;
			});
			await check();
			await updateUI();
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	}

	let erroModal = $state(false);
	let cost = $state();

	async function load() {
		try {
			await check();

			const idx = userArray.value.findIndex((u) => u.id === username);
			if (idx < 0) {
				message = 'User not found';
				return;
			}

			userId = idx;
			person = userArray.value[idx];
			userData = {
				name: person.name,
				total: person.total
			};
			updateUI();
		} catch (err) {
			message = 'User not found';
		} finally {
			loading = false;
		}
	}

	onMount(async () => {
		loading = true;
		await load();
	});

	$effect(() => {
		if (!username) return;

		(async () => {
			await load();
		})();
	});
</script>

<div class="my-2 flex w-[1000px] flex-col gap-5">
	{#if userData}
		<Userheader {user} {imgsrc} />
		{#if isAdmin.value}
			<Adminpanel {loading} {addSomething} {erroModal} {user} {cost} />
		{/if}
		<Leaderboard />
	{:else}
		<div class="w-full text-center">{message}</div>
	{/if}
</div>
