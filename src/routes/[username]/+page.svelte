<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { runTransaction, get } from 'firebase/database';
	import { db, ref } from '$lib/firebase';
	import { userArray, check, sumConquistasCalc, isAdmin } from '$lib/state.svelte';
	import type { UserConquista, UserType } from '$lib/types.svelte';
	import Userheader from '$lib/Components/Userheader.svelte';
	import Leaderboard from '$lib/Components/Leaderboard.svelte';

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
	let cost = $state(0);

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
			<h2 class="w-full text-center">Administração</h2>
			<div class="flex w-full">
				<h3 class="w-1/2 text-center">Pontuações</h3>
				<h3 class="w-1/2 text-center">Conquistas</h3>
			</div>
			<div class="flex gap-2">
				<div
					class="*:bg-primary/30 {loading
						? 'pointer-events-none cursor-default opacity-50'
						: ''} flex w-full flex-col gap-3 *:w-full *:cursor-pointer *:rounded-lg *:p-2"
				>
					<button onclick={() => addSomething(100, user.id)}> 100% das tarefas concluídas </button>
					<button onclick={() => addSomething(70, user.id)}> 90% das tarefas concluídas </button>
					<button onclick={() => addSomething(50, user.id)}> 80% das tarefas concluídas </button>
					<button onclick={() => addSomething(30, user.id)}> 70% das tarefas concluídas </button>
					<button onclick={() => addSomething(30, user.id)}>
						Controle de Atividades atualizado
					</button>
					<button onclick={() => addSomething(10, user.id)}> Elogio do cliente </button>
					<button onclick={() => addSomething(10, user.id)}> Ideia de melhoria aplicada </button>
					<button onclick={() => addSomething(15, user.id)}> Maior número de ideias no mês </button>
					<button onclick={() => addSomething(20, user.id)}> Melhor ideia do mês </button>
					<button onclick={() => addSomething(100, user.id)}>
						Indicação de cliente que fecha contrato
					</button>
					<button onclick={() => addSomething(20, user.id)}> Atualização profissional </button>
					<button onclick={() => addSomething(-10, user.id)}> Reclamação de cliente </button>
					<button onclick={() => addSomething(-10, user.id)}> Erro cometido </button>
					<button onclick={() => (erroModal = !erroModal)}> Prejuízo financeiro por erro </button>
				</div>

				<div
					class="*:bg-primary/30 {loading
						? 'pointer-events-none cursor-default opacity-50'
						: ''} flex w-full flex-col gap-3 *:w-full *:cursor-pointer *:rounded-lg *:p-2"
				>
					<button>1 Ano de Move Negócios</button>
				</div>
			</div>
		{/if}
		<Leaderboard />
	{:else}
		<div class="w-full text-center">{message}</div>
	{/if}
</div>

{#if erroModal}
	<div class="fixed inset-0 flex items-center justify-center bg-black/30">
		<div class="flex flex-col gap-2">
			<h1 class="text-center">Prejuízo financeiro por erro</h1>
			<p>R$10,00 = 1 ponto</p>
			<div class="flex flex-col gap-2">
				<input type="number" name="cost" id="cost" bind:value={cost} placeholder="Custo" />
				<button
					onclick={() => addSomething(-cost * 0.1, user.id)}
					class="cursor-pointer hover:font-bold hover:opacity-50"
				>
					Prejuízo financeiro por erro <span class="text-red-600">-1</span>
				</button>
				<button
					class="cursor-pointer hover:font-bold hover:opacity-50"
					onclick={() => (erroModal = !erroModal)}>Fechar</button
				>
			</div>
		</div>
	</div>
{/if}
