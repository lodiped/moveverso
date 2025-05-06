<script lang="ts">
	import { page } from '$app/state';
	import { runTransaction, set, getDatabase, push } from 'firebase/database';
	import { db, ref, get } from '$lib/firebase';
	import {
		userArray,
		check,
		sumConquistasCalc,
		isAdmin,
		checkLog,
		decodePushKeyTime,
		userLog,
		date
	} from '$lib/state.svelte';
	import type { UserType } from '$lib/types.svelte';
	import Userheader from '$lib/Components/Userheader.svelte';
	import Leaderboard from '$lib/Components/Leaderboard.svelte';
	import Adminpanel from '$lib/Components/Adminpanel.svelte';

	let person: any = $state();
	let userId: number | undefined | null = $state();

	let username = $derived(page.params.username);
	let message = $state('loading');
	let loading = $state(true);
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
		user.xp = u.xp;
		user.total = u.total;
		user.current = u.current;
		user.gender = u.gender;
		user.conquistas = u.conquistas;
		imgsrc = `/assets/${user.fase}${user.nivel}.png`;
		sumConquistasCalc(userId!);
	}

	async function addConquista(conqUid: string, uid: string) {
		loading = true;
		try {
			await set(push(ref(getDatabase(), `logs/${uid}`)), {
				action: conqUid
			});
			await runTransaction(ref(db, `users/${uid}/conquistas/${conqUid}/number`), (conquista) => {
				conquista++;
				return conquista;
			});
			await check();
			await checkLog(uid);
			await updateUI();
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	}

	async function clearConquistas(uid: string) {
		loading = true;
		try {
			const snap = await get(ref(db, `users/${uid}/conquistas`));
			const raw = snap.exists() ? snap.val() : {};

			const resetMap: Record<string, { number: number }> = Object.fromEntries(
				Object.entries(raw).map(([key, val]: [string, any]) => [key, { ...val, number: 0 }])
			);

			await set(ref(db, `users/${uid}/conquistas`), resetMap);
			await check();
			await updateUI();
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	}

	async function addPoints(n: number, uid: string, actionId?: string) {
		if (typeof n !== 'number') return;
		loading = true;
		try {
			if (actionId) {
				await set(push(ref(getDatabase(), `logs/${uid}`)), {
					action: actionId,
					value: actionId === 'errovalor' || actionId === 'horacurso' ? n : null
				});
			}
			await runTransaction(ref(db, `users/${uid}/total`), (total) => {
				if (total + n < 0) {
					total = 0;
					return total;
				}

				return total + n;
			});
			await checkLog(uid);
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

	async function clearLog(uid: string) {
		loading = true;
		try {
			await addPoints(-user.total, uid);
			await clearConquistas(uid);
			await set(ref(db, `logs/${uid}`), '');
			await checkLog(uid);
			await check();
			await updateUI();
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		if (!username) return;
		loading = true;
		(async () => {
			await load();
			await checkLog(user.id);
		})();
	});
</script>

<div
	class="my-2 flex w-[1000px] flex-col gap-5 2xl:w-full 2xl:max-w-[1500px] 2xl:flex-row 2xl:gap-20"
>
	{#if userData}
		<div class="flex flex-col gap-5">
			<Userheader {user} {imgsrc} />
			<div class="flex flex-col gap-5">
				{#each userLog.value as log}
					<div class="flex justify-between">
						<div>
							<p class="flex gap-5">
								<span class={log.points > 0 ? 'text-green-600' : 'text-red-600'}>{log.points}</span>
								<span>{log.text}</span>
							</p>
							<p class="text-sm opacity-50">{date(log.id)}</p>
						</div>
						{#if isAdmin.value}
							<button class="cursor-pointer rounded-lg border border-red-500 p-2 hover:bg-red-500"
								>X</button
							>
						{/if}
					</div>
				{/each}
			</div>
			{#if isAdmin.value}
				<Adminpanel
					{loading}
					{clearLog}
					{clearConquistas}
					{addPoints}
					{addConquista}
					{erroModal}
					{user}
					{cost}
				/>
			{/if}
		</div>
		<Leaderboard />
	{:else}
		<div class="w-full text-center">{message}</div>
	{/if}
</div>
