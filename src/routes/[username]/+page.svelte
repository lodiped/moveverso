<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { runTransaction, get } from 'firebase/database';
	import { db, ref } from '$lib/firebase';
	import { userArray, check, sumConquistasCalc, isAdmin } from '$lib/state.svelte';
	import type { UserConquista } from '$lib/types.svelte';
	import Userheader from '$lib/Components/Userheader.svelte';
	import Leaderboard from '$lib/Components/Leaderboard.svelte';

	let person: any = $state();
	let userId: number | undefined | null = $state();

	let username = page.params.username;
	let message = $state('loading');
	let loading = $state(false);
	let userData = $state<{ name: string; total: number } | null>(null);
	let imgsrc: string = $state('');
	let u: any = $state();
	let user = $state(
		{} as {
			id: string;
			ingress: string;
			name: string;
			fase: number;
			nivel: number;
			total: number;
			current: number;
			conquistas: UserConquista[];
		}
	);

	async function updateUI() {
		u = userArray.value[userId!];
		user.id = u.id;
		user.ingress = u.ingress;
		user.name = u.name;
		user.fase = u.fase;
		user.nivel = u.nivel;
		user.total = u.total;
		user.current = u.current;
		user.conquistas = u.conquistas;
		imgsrc = `/assets/${user.fase}${user.nivel}.png`;
		sumConquistasCalc(userId!);
	}

	async function addSomething(n: number, uid: string) {
		loading = true;
		try {
			await runTransaction(ref(db, `users/${uid}/total`), (total) => {
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

	onMount(async () => {
		loading = true;
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
	});
</script>

<div class="my-2 flex w-[1000px] flex-col gap-5">
	{#if userData}
		<Userheader {user} {imgsrc} />
		{#if isAdmin.value}
			<div>
				<h2>Admin stuff</h2>
				<div
					class="*:bg-primary/30 {loading
						? 'pointer-events-none cursor-default opacity-50'
						: ''} flex flex-col gap-3 *:w-fit *:cursor-pointer *:rounded-lg *:p-2"
				>
					<button onclick={() => addSomething(100, user.id)}>Add 100</button>
					<button onclick={() => addSomething(50, user.id)}>Add 50</button>
					<button onclick={() => addSomething(-25, user.id)}>Subtract 25</button>
				</div>
			</div>
		{/if}
		<Leaderboard />
	{:else}
		<div class="w-full text-center">{message}</div>
	{/if}
</div>
