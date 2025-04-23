<script lang="ts">
	//import Adminbtn from '$lib/Components/Adminbtn.svelte';
	//import Adminlog from '$lib/Components/Adminlog.svelte';
	import Userheader from '$lib/Components/Userheader.svelte';
	import Adminbtn from '$lib/Components/Adminbtn.svelte';
	//import { userArray, check } from '$lib/state.svelte';
	// import { user, add, resetAll, remove } from '$lib/state.svelte';
	import { isAdmin } from '$lib/state.svelte';
	let loading = $state(false);

	// ALL THINGS NEED TO UPDATE POINTS:
	import { onMount } from 'svelte';
	import { runTransaction } from 'firebase/database';
	import { ref, db } from '$lib/firebase';
	import { check, userArray, sumConquistasCalc } from '$lib/state.svelte';
	import type { UserConquista } from '$lib/types.svelte';
	let imgsrc: string = $state('');
	let u = $state(userArray.value[5]);
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
	function updateUI() {
		u = userArray.value[5];
		user.id = u.id;
		user.ingress = u.ingress;
		user.name = u.name;
		user.fase = u.fase;
		user.nivel = u.nivel;
		user.total = u.total;
		user.current = u.current;
		user.conquistas = u.conquistas;
		imgsrc = `/assets/${user.fase}${user.nivel}.png`;
		sumConquistasCalc(5);
	}
	async function addSomething(n: number, uid: string) {
		loading = true;
		try {
			await runTransaction(ref(db, `users/${uid}/total`), (total) => {
				return total + n;
			});
			await check();
			updateUI();
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	}
	onMount(() => {
		check().then(() => {
			updateUI();
		});
	});
</script>

<div class="my-2 flex w-[1000px] flex-col gap-5">
	<Userheader {user} {imgsrc} />
	<!-- <Adminbtn {add} {resetAll} />
	<Adminlog {remove} {user} /> -->
	{#if isAdmin.value}
		<div>
			<h2>Admin stuff</h2>
			<div class="*:bg-primary/30 flex flex-col gap-3 *:w-fit *:cursor-pointer *:rounded-lg *:p-2">
				<button onclick={() => addSomething(100, user.id)}>Add 100</button>
				<button onclick={() => addSomething(50, user.id)}>Add 50</button>
				<button onclick={() => addSomething(-25, user.id)}>Subtract 25</button>
			</div>
		</div>
	{/if}
</div>
