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
		logText,
		logPage,
		pageDirection,
		hasMore,
		homepage
	} from '$lib/state.svelte';
	import type { UserType } from '$lib/types.svelte';
	import Userheader from '$lib/Components/Userheader.svelte';
	import Leaderboard from '$lib/Components/Leaderboard.svelte';
	import Adminpanel from '$lib/Components/Adminpanel.svelte';
	import Log from '$lib/Components/Log.svelte';
	// @ts-ignore
	import Star from 'virtual:icons/mdi/star-four-points';
	import { getCultura } from '$lib/currentUser.svelte';

	let username = $derived(page.params.username);
	let message = $state('loading');
	let loading = $state(true);
	let userData = $state<{ name: string; total: number } | null>(null);
	let imgsrc: string = $state('');
	let u: any = $state();
	let user = $state({} as UserType);

	async function updateUI() {
		console.log('updatingUI');
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
		user.arrayId = u.arrayId;
		user.cultura = u.cultura;
		imgsrc = `/assets/${user.gender}/${user.fase}${user.nivel}.png`;
		sumConquistasCalc(userId!);
	}

	async function addConquista(conqUid: string, uid: string) {
		loading = true;
		logPage.value = 1;
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
		logPage.value = 1;
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
		logPage.value = 1;
		try {
			if (actionId) {
				await set(push(ref(getDatabase(), `logs/${uid}`)), {
					action: actionId,
					value: actionId === 'errovalor' || actionId === 'horacurso' ? n : null
				});
			}
			let newTotal = 0;
			await runTransaction(ref(db, `users/${uid}/total`), (total) => {
				if (total + n < 0) {
					total = 0;
					return total;
				}
				newTotal = total + n;

				return total + n;
			});
			await runTransaction(ref(db, `totals/${uid}`), (total) => {
				if (total + n < 0) {
					total = 0;
					return total;
				} else if (total + n !== newTotal) {
					total = newTotal;
					return total;
				} else {
					return total + n;
				}
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

	let person: any = $state();
	let userId: number | undefined | null = $state();

	async function load() {
		console.log('Loading data');
		try {
			if (userArray.value.length === 0) {
				console.log('userArray is empty');
				await check();
			} else {
				console.log('userArray is not empty');
			}
			await checkLog(username);

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
			await getCultura(person.id);
			updateUI();
		} catch (err) {
			message = 'User not found';
		} finally {
			loading = false;
		}
	}

	async function clearLog(uid: string) {
		console.log('Clearing Log');
		loading = true;
		try {
			logPage.value = 1;
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

	async function remove(pushkey: string, uid: string, actionId: string, type: string) {
		loading = true;
		logPage.value = 1;
		try {
			if (type === 'conq') {
				await runTransaction(ref(db, `users/${uid}/conquistas/${actionId}/number`), (conquista) => {
					conquista--;
					return conquista;
				});
			} else if (type === 'point') {
				let points = logText[actionId]?.points ?? 0;
				await runTransaction(ref(db, `users/${uid}/total`), (total) => {
					total -= points;
					return total;
				});
			}
			await set(ref(db, `logs/${uid}/${pushkey}`), null);
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
		homepage.value = false;
		if (!username) return;
		loading = true;
		(async () => {
			await load();
		})();
	});
	async function nextPage() {
		if (!hasMore.value) return;
		pageDirection.value = 'next';
		logPage.value += 1;
		await checkLog(user.id);
	}
	async function prevPage() {
		if (logPage.value > 1) {
			pageDirection.value = 'prev';
			logPage.value -= 1;
			await checkLog(user.id);
		}
	}

	// FIXME: ajuste do card do personagem quando em widescreen
</script>

<div
	class="my-2 flex w-full flex-col gap-5 md:w-[44rem] 2xl:w-full 2xl:max-w-[1500px] 2xl:flex-row 2xl:gap-20"
>
	{#if userData && user && user.cultura}
		<div class="flex flex-col gap-5">
			<Userheader {user} {imgsrc} />
			<Log {user} {remove} {prevPage} {nextPage} />
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
		<div class="relative flex w-full justify-center text-center">
			<Star class="text-accent drop-shadow-accent animate-spin text-xl drop-shadow-[0_0_10px]" />
		</div>
	{/if}
</div>
