<script lang="ts">
	import { untrack } from 'svelte';
	import type { UserType } from '$lib/types.svelte';
	import { page } from '$app/state';
	import { runTransaction, set, getDatabase, push } from 'firebase/database';
	import { db, ref, get } from '$lib/firebase';
	import {
		bpoList,
		contabilList,
		getCulturaContabil,
		listenTotals,
		getBandColor
	} from '$lib/currentUser.svelte';
	import {
		contabilArray,
		checkContabil,
		sumConquistasContabil,
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
	import CulturaPanel from '$lib/Components/CulturaPanel.svelte';
	import Adminpanel from '$lib/Components/Adminpanel.svelte';
	import Log from '$lib/Components/Log.svelte';
	// @ts-ignore
	import Star from 'virtual:icons/mdi/star-four-points';

	let username = $derived(page.params.username);
	let loading = $state(true);
	let userData = $state<{ name: string; total: number } | null>(null);
	let imgsrc: string = $state('');
	let pulseirasrc: string = $state('');
	let u: any = $state();
	let user = $state<UserType>({
		id: '',
		ingressMs: 0,
		ingress: '',
		name: '',
		fase: 0,
		nivel: 0,
		email: '',
		xp: 0,
		total: 0,
		current: 0,
		gender: '',
		arrayId: 0,
		cultura: {
			media: '',
			coins: { entregues: 0, recebidas: 0 },
			presenca: { cumbuca: 0, treinamento: 0 },
			sports: { conq: false, presente: false, hp: 0, pontos: 0 }
		},
		log: [],
		conquistas: []
	});
	let userId: number | undefined | null = $state();
	let sector = 'contabil';

	async function updateUI() {
		console.log('updatingUI @ updateUI() in contabil/[username]/+page.svelte');
		u = contabilArray.value[userId!];
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
		user.email = u.email;
		imgsrc = `/assets/${user.gender}/${user.fase}${user.nivel}.webp`;
		if (getBandColor(user.ingressMs)) {
			pulseirasrc = `/assets/${user.fase}${user.gender}${getBandColor(user.ingressMs)}.webp`;
		} else {
			pulseirasrc = '';
		}
		if (user.cultura.sports.hp <= 0 && user.cultura.sports.presente) {
			try {
				await get(ref(db, `cultura/${userId!}/sports/presente`));
				user.cultura.sports.presente = false;
			} catch (error) {
				console.error(error);
			}
		}
		if (user.cultura.sports.hp > 0 && !user.cultura.sports.presente) {
			try {
				await get(ref(db, `cultura/${userId!}/sports/presente`));
				user.cultura.sports.presente = true;
			} catch (error) {
				console.error(error);
			}
		}
		sumConquistasContabil(userId!);
	}

	// TODO: add Move Sports conquista
	async function addConquista(conqUid: string, uid: string) {
		loading = true;
		logPage.value = 1;
		try {
			await set(push(ref(getDatabase(), `logs/${uid}`)), {
				action: conqUid
			});
			await runTransaction(ref(db, `contabil/${uid}/conquistas/${conqUid}/number`), (conquista) => {
				conquista++;
				return Math.round(conquista);
			});
			await checkContabil();
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
				alert('Média nao pode ser maior que dez 10 ou menor que 0');
				throw new Error('Média não pode ser maior que dez 10 ou menor que 0');
			}
			input.toFixed(1);
			await set(ref(db, `cultura/${uid}/media`), input);
			await checkContabil();
			await checkLog(uid);
			await updateUI();
		} catch (error) {
			console.error(error);
			alert(error);
		} finally {
			loading = false;
		}
	}

	async function sportsPoints(uid: string, input: number) {
		loading = true;
		logPage.value = 1;
		try {
			if (input > 0 || input < 10000) {
				input = Math.round(input);
				await set(ref(db, `cultura/${uid}/sports/pontos`), input);
			} else {
				alert('Pontos nao podem ser maior que 10000 ou menor que 0');
				throw new Error('Pontos nao podem ser maior que 10000 ou menor que 0');
			}
			await checkContabil();
			await checkLog(uid);
			await updateUI();
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	}

	async function setTreinamento(uid: string, input: number) {
		loading = true;
		logPage.value = 1;
		try {
			if (input > 100 || input < 0) {
				alert('Porcentagem nao pode ser maior que dez 100 ou menor que 0');
				throw new Error('Porcentagem não pode ser maior que dez 100 ou menor que 0');
			}
			input.toFixed(2);
			await set(ref(db, `cultura/${uid}/presenca/treinamento`), input);
			await checkContabil();
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
				alert('Porcentagem nao pode ser maior que dez 100 ou menor que 0');
				throw new Error('Porcentagem não pode ser maior que dez 100 ou menor que 0');
			}
			input.toFixed(2);
			await set(ref(db, `cultura/${uid}/presenca/cumbuca`), input);
			await checkContabil();
			await checkLog(uid);
			await updateUI();
		} catch (error) {
			console.error(error);
			alert(error);
		} finally {
			loading = false;
		}
	}

	async function setHP(uid: string, input: string) {
		if (input !== '+' && input !== '-') {
			throw new Error('Input must be + or -');
		}
		logPage.value = 1;
		try {
			await runTransaction(ref(db, `cultura/${uid}/sports/hp`), (hp) => {
				if (input === '+' && user.cultura.sports.hp <= 3) {
					hp++;
				}
				if (input === '-' && user.cultura.sports.hp > 0) {
					hp--;
				}
				return Math.round(hp);
			});
			await checkContabil();
			await checkLog(uid);
			await updateUI();
		} catch (error) {
			console.error(error);
		}
	}

	async function toggleSports(uid: string) {
		loading = true;
		logPage.value = 1;
		try {
			await set(ref(db, `cultura/${uid}/sports/presente`), !user.cultura.sports.presente);
			await checkContabil();
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
				return Math.round(coin);
			});
			await checkContabil();
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
				return Math.round(coin);
			});
			await checkContabil();
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
			const snap = await get(ref(db, `contabil/${uid}/conquistas`));
			const raw = snap.exists() ? snap.val() : {};

			const resetMap: Record<string, { number: number }> = Object.fromEntries(
				Object.entries(raw).map(([key, val]: [string, any]) => [key, { ...val, number: 0 }])
			);

			await set(ref(db, `contabil/${uid}/conquistas`), resetMap);
			await checkContabil();
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
					value:
						actionId === 'errovalor' || actionId === 'horacurso' || actionId === 'controleAtv'
							? n
							: null
				});
			}
			let newTotal = 0;
			await runTransaction(ref(db, `contabil/${uid}/total`), (total) => {
				newTotal = total + n;

				return Math.round(total + n);
			});
			await runTransaction(ref(db, `totals/${uid}/value`), (total) => {
				if (total + n !== newTotal) {
					total = newTotal;
					return Math.round(total);
				} else {
					return Math.round(total + n);
				}
			});
			await checkLog(uid);
			await checkContabil();
			await listenTotals();
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
		console.log('Loading data @ load() in contabil/[username]/+page.svelte');
		try {
			if (contabilArray.value.length === 0) {
				console.log('usersArray is empty @ load() in contabil/[username]/+page.svelte');
				await checkContabil();
			} else {
				console.log('usersArray is not empty @ load() in contabil/[username]/+page.svelte');
			}
			if (role.value !== 'guest') {
				await checkLog(username);
			}

			const idx = contabilArray.value.findIndex((u) => u.id === username);
			if (idx < 0) {
				console.error('User not found');
				return;
			}

			userId = idx;
			person = contabilArray.value[idx];
			userData = {
				name: person.name,
				total: person.total
			};
			await getCulturaContabil(person.id);
			updateUI();
		} catch (err) {
			console.error('User not found', err);
		} finally {
			loading = false;
		}
	}

	async function clearLog(uid: string) {
		console.log('Clearing Log @ clearLog() in contabil/[username]/+page.svelte');
		loading = true;
		try {
			logPage.value = 1;
			await addPoints(-user.total, uid);
			await clearConquistas(uid);
			await set(ref(db, `logs/${uid}`), '');
			await checkLog(uid);
			await checkContabil();
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
				await runTransaction(
					ref(db, `contabil/${uid}/conquistas/${actionId}/number`),
					(conquista) => {
						conquista--;
						return conquista;
					}
				);
			}
			if (type === 'point') {
				let points: number;
				if (logText[actionId].points) {
					points = logText[actionId]?.points;
				} else {
					try {
						let snap = await get(ref(db, `logs/${uid}/${pushkey}/value`));
						points = snap.val();
					} catch (error) {
						console.error(error);
					}
				}
				let newPoints: number;
				await runTransaction(ref(db, `contabil/${uid}/total`), (total) => {
					total -= points;
					newPoints = total;
					return newPoints;
				});
				await runTransaction(ref(db, `totals/${uid}/value`), (total) => {
					if (total !== newPoints) {
						total = newPoints;
						return total;
					} else {
						return total;
					}
				});
			}
			await set(ref(db, `logs/${uid}/${pushkey}`), null);
			await checkLog(uid);
			await checkContabil();
			await updateUI();
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	}

	let ready = $state(false);

	$effect(() => {
		if (untrack(() => contabilList.value.length === 0)) untrack(() => listenTotals());
		untrack(() => (homepage.value = false));
		if (untrack(() => !username)) return;
		untrack(() => (loading = true));
		(async () => {
			await load();
			untrack(() => (ready = true));
			untrack(() => (homeLoading.value = false));
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
	{#if ready}
		<div class="flex flex-col gap-5 lg:w-full">
			<Userheader {sector} {user} {imgsrc} {pulseirasrc} />
			{#if role.value === 'cultura' || role.value === 'admin'}
				<CulturaPanel
					bind:user
					{giveCoin}
					{receiveCoin}
					{setMedia}
					{setTreinamento}
					{setCumbuca}
					{setHP}
					{sportsPoints}
				/>
			{/if}
			<Log {user} {remove} {prevPage} {nextPage} />
			{#if role.value === 'admin' || role.value === 'contabil'}
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
				<h2 class="text-center">Contábil</h2>
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
							class="nth-2:bg-accent/30 nth-2:drop-shadow-accent/50 nth-3:bg-primary/25 nth-4:bg-accent/8 flex w-full items-center justify-center rounded-lg px-1 nth-2:drop-shadow-[0_0_15px] {user.id ===
							page.params.username
								? 'bg-primary/30 border-2'
								: 'nth-4:bg-accent/8'}"
						>
							<span class="w-[7%] pr-0.5 text-end opacity-50">{i + 1}.</span>
							<a
								onclick={() => {
									logPage.value = 1;
								}}
								href={`/contabil/${user.id}`}
								class="bg-primary/30 hover:bg-primary/50 w-[57%] rounded-lg p-1 px-2 text-left"
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
				<h2 class="-z-10 text-center">BPO</h2>
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
							class="nth-2:bg-accent/30 nth-2:drop-shadow-accent/50 nth-3:bg-primary/25 nth-4:bg-accent/8 flex w-full items-center justify-center rounded-lg px-1 nth-2:drop-shadow-[0_0_15px] {user.id ===
							page.params.username
								? 'bg-primary/30 border-2'
								: 'nth-4:bg-accent/8'}"
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
		</div>
	{:else}
		<div class="relative flex w-full justify-center text-center">
			<Star class="text-accent drop-shadow-accent animate-spin text-xl drop-shadow-[0_0_10px]" />
		</div>
	{/if}
</div>
