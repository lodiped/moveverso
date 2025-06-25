<script lang="ts">
	import { untrack } from 'svelte';
	import type { UserType } from '$lib/types.svelte';
	import { page } from '$app/state';
	import { runTransaction, set, getDatabase, push } from 'firebase/database';
	import { db, ref, get } from '$lib/firebase';
	import { listenTotals, contabilList, bpoList, getCulturaBpo } from '$lib/currentUser.svelte';
	import {
		bpoArray,
		checkBpo,
		sumConquistasBpo,
		role,
		checkLog,
		logText,
		logPage,
		pageDirection,
		hasMore,
		homepage,
		homeLoading
	} from '$lib/state.svelte';
	import Userheader from '$lib/Components/Userheader.svelte';
	import Adminpanel from '$lib/Components/Adminpanel.svelte';
	import Log from '$lib/Components/Log.svelte';
	// @ts-ignore
	import Star from 'virtual:icons/mdi/star-four-points';

	let sector = $derived(page.url.pathname.split('/')[1]);
	let username = $derived(page.params.username);
	let loading = $state(true);
	let userData = $state<{ name: string; total: number } | null>(null);
	let imgsrc: string = $state('');
	let u: any = $state();
	let user = $state({} as UserType);
	let userId: number | undefined | null = $state();

	async function updateUI() {
		console.log('updatingUI');
		u = bpoArray.value[userId!];
		user.id = u.id;
		user.ingressMs = u.ingressMs;
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
		sumConquistasBpo(userId!);
	}

	// TODO: add Move Sports conquista
	async function addConquista(conqUid: string, uid: string) {
		loading = true;
		logPage.value = 1;
		try {
			await set(push(ref(getDatabase(), `logs/${uid}`)), {
				action: conqUid
			});
			await runTransaction(ref(db, `bpo/${uid}/conquistas/${conqUid}/number`), (conquista) => {
				conquista++;
				return conquista;
			});
			await checkBpo();
			await checkLog(uid);
			await updateUI();
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	}

	async function setMedia(uid: string, input: number) {
		loading = true;
		logPage.value = 1;
		try {
			if (input > 10 || input < 0) {
				throw new Error('Média não pode ser maior que dez 10 ou menor que 0');
			}
			input.toFixed(1);
			await set(ref(db, `cultura/${uid}/media`), input);
			await checkBpo();
			await checkLog(uid);
			await updateUI();
		} catch (error) {
			console.error(error);
			alert(error);
		} finally {
			loading = false;
		}
	}

	async function setTreinamento(uid: string, input: number) {
		loading = true;
		logPage.value = 1;
		try {
			if (input > 100 || input < 0) {
				throw new Error('Porcentagem não pode ser maior que dez 100 ou menor que 0');
			}
			input.toFixed(2);
			await set(ref(db, `cultura/${uid}/presenca/treinamento`), input);
			await checkBpo();
			await checkLog(uid);
			await updateUI();
		} catch (error) {
			console.error(error);
			alert(error);
		} finally {
			loading = false;
		}
	}

	async function setCumbuca(uid: string, input: number) {
		loading = true;
		logPage.value = 1;
		try {
			if (input > 100 || input < 0) {
				throw new Error('Porcentagem não pode ser maior que dez 100 ou menor que 0');
			}
			input.toFixed(2);
			await set(ref(db, `cultura/${uid}/presenca/cumbuca`), input);
			await checkBpo();
			await checkLog(uid);
			await updateUI();
		} catch (error) {
			console.error(error);
			alert(error);
		} finally {
			loading = false;
		}
	}

	async function toggleSports(uid: string) {
		loading = true;
		logPage.value = 1;
		try {
			await set(ref(db, `cultura/${uid}/sports/presente`), !user.cultura.sports.presente);
			await checkBpo();
			await checkLog(uid);
			await updateUI();
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	}

	async function receiveCoin(uid: string) {
		loading = true;
		logPage.value = 1;
		try {
			await runTransaction(ref(db, `cultura/${uid}/coins/recebidas`), (coin) => {
				coin++;
				return coin;
			});
			await checkBpo();
			await updateUI();
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	}

	async function giveCoin(uid: string) {
		loading = true;
		logPage.value = 1;
		try {
			await runTransaction(ref(db, `cultura/${uid}/coins/entregues`), (coin) => {
				coin++;
				return coin;
			});
			await checkBpo();
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
			const snap = await get(ref(db, `bpo/${uid}/conquistas`));
			const raw = snap.exists() ? snap.val() : {};

			const resetMap: Record<string, { number: number }> = Object.fromEntries(
				Object.entries(raw).map(([key, val]: [string, any]) => [key, { ...val, number: 0 }])
			);

			await set(ref(db, `bpo/${uid}/conquistas`), resetMap);
			await checkBpo();
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
					value: actionId === 'diafechamento' ? n : null
				});
			}
			let newTotal = 0;
			await runTransaction(ref(db, `bpo/${uid}/total`), (total) => {
				if (total + n < 0) {
					total = 0;
					return total;
				}
				newTotal = total + n;

				return total + n;
			});
			await runTransaction(ref(db, `totals/${uid}/value`), (total) => {
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
			await checkBpo();
			await updateUI();
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	}

	let erroModal = $state(false);

	let person: any = $state();

	async function load() {
		console.log('Loading data');
		try {
			if (bpoArray.value.length === 0) {
				console.log('userArray is empty');
				await checkBpo();
			} else {
				console.log('userArray is not empty');
			}
			if (role.value !== 'guest') {
				await checkLog(username);
			}

			const idx = bpoArray.value.findIndex((u) => u.id === username);
			if (idx < 0) {
				console.error('User not found');
				return;
			}

			userId = idx;
			person = bpoArray.value[idx];
			userData = {
				name: person.name,
				total: person.total
			};
			await getCulturaBpo(person.id);
			updateUI();
		} catch (err) {
			console.error('User not found', err);
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
			await checkBpo();
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
				await runTransaction(ref(db, `bpo/${uid}/conquistas/${actionId}/number`), (conquista) => {
					conquista--;
					return conquista;
				});
			} else if (type === 'point') {
				let points = logText[actionId]?.points ?? 0;
				let newPoints: number;
				await runTransaction(ref(db, `bpo/${uid}/total`), (total) => {
					total -= points;
					newPoints = total;
					return total;
				});
				await runTransaction(ref(db, `totals/${uid}/total`), (total) => {
					if (total < 0) {
						total = 0;
						return total;
					} else if (total !== newPoints) {
						total = newPoints;
						return total;
					} else {
						return total;
					}
				});
			}
			await set(ref(db, `logs/${uid}/${pushkey}`), null);
			await checkLog(uid);
			await checkBpo();
			await updateUI();
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		if (untrack(() => bpoList.value.length === 0)) untrack(() => listenTotals());
		homepage.value = false;
		if (!username) return;
		loading = true;
		(async () => {
			await load();
			homeLoading.value = false;
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
		<div class="flex flex-col gap-5 lg:w-full">
			<Userheader
				{user}
				{imgsrc}
				{toggleSports}
				{giveCoin}
				{receiveCoin}
				{setTreinamento}
				{setCumbuca}
				{setMedia}
				{sector}
			/>
			<Log {user} {remove} {prevPage} {nextPage} />
			{#if role.value === 'admin'}
				<Adminpanel
					{loading}
					{clearLog}
					{clearConquistas}
					{addPoints}
					{addConquista}
					{erroModal}
					{user}
				/>
			{/if}
		</div>
		<div class="flex w-full flex-col gap-5">
			<div class="flex w-full flex-col items-center px-2 lg:px-0">
				<h2 class="text-center">BPO</h2>
				<div class="flex w-full max-w-[750px] flex-col items-center gap-2 backdrop-blur-xs">
					<div class="flex w-full items-center justify-center">
						<span class="w-[7%] text-end text-sm">Nº.</span>
						<span class="w-[57%] px-2 text-sm">Nome</span>
						<span class="w-[11%] text-end text-sm">Nível</span>
						<span class="w-[11%] text-end text-sm">Fase</span>
						<span class="w-[13%] text-end text-sm">Total</span>
					</div>
					{#each bpoList.value as user, i}
						<div
							class="nth-2:bg-accent/30 nth-2:drop-shadow-accent/50 nth-3:bg-primary/25 nth-4:bg-accent/8 flex w-full items-center justify-center rounded-lg px-1 nth-2:drop-shadow-[0_0_15px]"
						>
							<span class="w-[7%] pr-0.5 text-end opacity-50">{i + 1}.</span>
							<a
								onclick={() => {
									logPage.value = 1;
								}}
								href={`/bpo/${user.id}`}
								class="bg-primary/30 hover:bg-primary/50 w-[57%] rounded-lg p-1 px-2 text-left transition-all"
								>{user.name}</a
							>
							<span class="w-[11%] text-end">{user.nivel}</span>
							<span class="w-[11%] text-end">{user.fase}</span>
							<span class="w-[13%] text-end">{user.total}</span>
						</div>
					{/each}
				</div>
			</div>
			<div class="flex w-full flex-col items-center px-2 lg:px-0">
				<h2 class="-z-10 text-center">Contábil</h2>
				<div class="flex w-full max-w-[750px] flex-col items-center gap-2 backdrop-blur-xs">
					<div class="flex w-full items-center justify-center">
						<span class="w-[7%] text-end text-sm">Nº.</span>
						<span class="w-[57%] px-2 text-sm">Nome</span>
						<span class="w-[11%] text-end text-sm">Nível</span>
						<span class="w-[11%] text-end text-sm">Fase</span>
						<span class="w-[13%] text-end text-sm">Total</span>
					</div>
					{#each contabilList.value as user, i}
						<div
							class="nth-2:bg-accent/30 nth-2:drop-shadow-accent/50 nth-3:bg-primary/25 nth-4:bg-accent/8 flex w-full items-center justify-center rounded-lg px-1 nth-2:drop-shadow-[0_0_15px]"
						>
							<span class="w-[7%] pr-0.5 text-end opacity-50">{i + 1}.</span>
							<a
								onclick={() => {
									logPage.value = 1;
								}}
								href={`/contabil/${user.id}`}
								class="bg-primary/30 hover:bg-primary/50 w-[57%] rounded-lg p-1 px-2 text-left transition-all"
								>{user.name}</a
							>
							<span class="w-[11%] text-end">{user.nivel}</span>
							<span class="w-[11%] text-end">{user.fase}</span>
							<span class="w-[13%] text-end">{user.total}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{:else}
		<div class="relative flex w-full justify-center text-center">
			<Star class="text-accent drop-shadow-accent animate-spin text-xl drop-shadow-[0_0_10px]" />
		</div>
	{/if}
</div>
