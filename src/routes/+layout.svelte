<script lang="ts">
	import { signInWithPopup } from 'firebase/auth';
	import { googleProvider } from '$lib/firebase';
	import { signOut } from 'firebase/auth';
	import { get, ref, getDatabase, set, remove } from 'firebase/database';
	import { auth } from '$lib/firebase';
	import '../app.css';
	import {
		role,
		homepage,
		loading,
		homeLoading,
		nivelCalc,
		faseCalc,
		currentCalc
	} from '$lib/state.svelte';
	import { list } from '$lib/currentUser.svelte';
	import moveverso from '$lib/assets/moveverso.png';
	import moveversowide from '$lib/assets/moveversowide.png';
	import Sair from 'virtual:icons/mdi/logout';
	import Star from 'virtual:icons/mdi/star-four-points';
	import Close from 'virtual:icons/mdi/close-circle-outline';
	import CloseThick from 'virtual:icons/mdi/close-thick';
	import Google from 'virtual:icons/mdi/google';
	import Users from 'virtual:icons/mdi/account-multiple';
	import Back from 'virtual:icons/mdi/arrow-left';
	let loadingLocal = $state(false);
	let removeModal = $state(false);
	let editColaboradoresTab = $state(0);

	let logoutModal = $state(false);
	async function handleLogout() {
		loadingLocal = true;
		try {
			await signOut(auth);
		} catch (err) {
			console.error(err);
			return;
		} finally {
			role.value = 'guest';
			loadingLocal = false;
			logoutModal = false;
			return;
		}
	}
	let date = new Date();

	// \/ \/ \/ \/ \/ \/ START - FINALIZAR BUTTON - START \/ \/ \/ \/ \/ \/

	let finalizando = $state(false);
	let finalizarModal = $state(false);

	async function finalizar() {
		finalizando = true;
		let currentMonth = date.getMonth() + 1;
		let hasMonthlyRecord = false;
		let monthlyRecordMs = 0;
		try {
			let snapshot = await get(ref(getDatabase(), `historicoIdx`));
			let array = [];
			if (snapshot) array = snapshot.val() ?? [];
			for (let i = 0; i < array.length; i++) {
				if (array.length <= 0) break;
				let checkMonth = new Date(array[i] * 1000).getMonth() + 1;
				if (currentMonth === checkMonth) {
					hasMonthlyRecord = true;
					monthlyRecordMs = array[i];
					break;
				}
			}
			let dateMs: number = +(Date.now() / 1000).toFixed(0);

			try {
				let newsnapshot = await get(ref(getDatabase(), `totals`));
				let totalsToRecord = newsnapshot ? newsnapshot.val() : null;
				if (totalsToRecord === null) {
					throw new Error('Totals nao encontrados');
				}
				if (hasMonthlyRecord) {
					try {
						await remove(ref(getDatabase(), `historico/${monthlyRecordMs}`));
						await remove(ref(getDatabase(), `historicoIdx/${array.indexOf(monthlyRecordMs)}`));
						await set(ref(getDatabase(), `historico/${dateMs}`), totalsToRecord);
						await set(ref(getDatabase(), `historicoIdx/${array.length - 1}`), dateMs);
						window.location.reload();
					} catch (err) {
						console.error(err);
					}
				} else {
					await set(ref(getDatabase(), `historicoIdx/${array.length}`), dateMs);
					await set(ref(getDatabase(), `historico/${dateMs}`), totalsToRecord);
					window.location.reload();
				}
			} catch (error) {
				console.error(error);
				finalizando = false;
			}
			finalizando = false;
		} catch (error) {
			console.error(error);
			finalizando = false;
		} finally {
			finalizarModal = false;
		}
	}

	// /\ /\ /\ /\ /\ /\ END - FINALIZAR BUTTON - END /\ /\ /\ /\ /\ /\

	// EDITAR COLABORADORES \/

	let editarUserModal = $state(false);
	let newUser = $state({});
	let newName = $state('');
	let newSurname = $state('');
	let newEmail = $state('');
	let newGender = $state('');
	let newId = $state('');
	let newRole = $state('');

	let ingressDate: number = $state(0);
	let pickedTime: string = $state('');

	function checkRole() {
		if (role.value === 'admin') {
			console.log(newRole);
			return newRole;
		}
		return role.value;
	}
	function getTime() {
		if (!pickedTime) return;
		const dateObejct = new Date(pickedTime);
		const ms = dateObejct.getTime();
		ingressDate = Number((ms / 1000).toFixed(0));
		return true;
	}

	function createId(newName: string, newSurname: string) {
		let id = '';
		id = newName.toLowerCase().replace(/\s/g, '') + newSurname.toLowerCase().replace(/\s/g, '');
		console.log('id: ', id);
		if (!checkIds(id)) return false;
		if (id.includes(' ')) return false;
		newId = id;
	}
	function createName(newName: string, newSurname: string) {
		let name = '';
		name = newName + ' ' + newSurname;
		return name;
	}
	function checkIds(id: string) {
		return true;
	}

	async function addUser(
		newName: string,
		newSurname: string,
		newEmail: string,
		newGender: string,
		role: string | null
	) {
		let actions = async () => {
			console.log('adding user');
			getTime();
			if (!getTime()) return;
			createId(newName, newSurname);
			console.log(newId);
			if (!newId) return;
			if (role === 'guest' || role === null) return;
			console.log('not Guest');
			if (role === 'contabil') {
				await set(ref(getDatabase(), `contabil/${newId}`), {
					conquistas: {
						conqelogio: {
							number: 0
						},
						conqformacao: {
							number: 0
						},
						conqmaiordoano: {
							number: 0
						},
						conqmaiordomes: {
							number: 0
						},
						conqmesideia: {
							number: 0
						},
						conqmesplanilha: {
							number: 0
						},
						conqmestarefa: {
							number: 0
						},
						conqsports: {
							number: 0
						}
					},
					total: 0,
					log: '',
					gender: newGender,
					name: createName(newName, newSurname),
					email: newEmail,
					ingress: ingressDate
				});
			}
			if (role === 'bpo') {
				await set(ref(getDatabase(), `bpo/${newId}`), {
					conquistas: {
						conq3fechamento: {
							number: 0
						},
						conqedu: {
							number: 0
						},
						conqelogio: {
							number: 0
						},
						conqfechamento: {
							number: 0
						},
						conqideia: {
							number: 0
						},
						conqplaybpo: {
							number: 0
						},
						conqsports: {
							number: 0
						}
					},
					total: 0,
					log: '',
					gender: newGender,
					name: newName,
					email: newEmail,
					ingress: ingressDate
				});
			}
			await set(ref(getDatabase(), `cultura/${newId}`), {
				coins: {
					entregues: 0,
					recebidas: 0
				},
				media: 0,
				presenca: {
					cumbuca: 100,
					treinamento: 100
				},
				sports: {
					conq: false,
					presente: false,
					hp: 0,
					pontos: 0
				}
			});
			await set(ref(getDatabase(), `logs/${newId}`), '');
			await set(ref(getDatabase(), `totals/${newId}`), {
				type: role,
				value: 0,
				name: createName(newName, newSurname)
			});
		};
		actions().then(() => {
			window.location.reload();
		});
	}

	let userToRemove = $state('');
	let idToRemove = $state('');
	async function removeUser(userId: any) {
		let actions = async () => {
			try {
				await remove(ref(getDatabase(), `contabil/${userId}`));
				await remove(ref(getDatabase(), `bpo/${userId}`));
			} catch (err) {
				console.error(err);
				return;
			}
			await remove(ref(getDatabase(), `cultura/${userId}`));
			await remove(ref(getDatabase(), `logs/${userId}`));
			await remove(ref(getDatabase(), `totals/${userId}`));
		};
		actions()
			.catch((err) => {
				console.error(err);
				return;
			})
			.then(() => {
				window.location.reload();
			});
	}

	// FIM EDITAR COLABORES /\

	let { children } = $props();

	async function handleGoogleSignIn() {
		try {
			const result = await signInWithPopup(auth, googleProvider);
			const user = result.user;
			console.log('GOOGLE STUFF: ', user);
		} catch (error) {
			console.log(error);
		}
	}
</script>

<svelte:head>
	<title>Moveverso</title>
	<!-- linha abaixo está dentro do {@html} porque dá erro (inerte) no value="notranslate" -->
	{@html `<meta name="google" value="notranslate" />`}
	<meta name="google" content="notranslate" />
	<link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
</svelte:head>

<div class="flex min-h-[100vh] w-full flex-col items-center gap-15">
	<div class="absolute -z-1 h-[400px] w-full bg-gradient-to-b from-black to-black/0"></div>
	<a
		href="/"
		class="relative mt-10 -mb-10 transition-all {homepage.value
			? 'w-[320px] md:w-[650px]'
			: 'w-[200px] md:w-[450px]'}"
	>
		<img src={moveverso} class="drop-shadow-accent/50 drop-shadow-[0_0_20px] md:hidden" alt="" />
		<img
			src={moveversowide}
			class="drop-shadow-accent/50 hidden drop-shadow-[0_0_20px] md:block"
			alt=""
		/>
	</a>
	{@render children()}
	<div
		class="static bottom-0 h-[150px] w-full bg-gradient-to-t from-black to-black/0 {loading.value ||
		loadingLocal ||
		homeLoading.value ||
		homepage.value
			? 'hidden'
			: ''}"
	></div>
</div>

{#if role.value !== 'guest'}
	<div class="fixed right-2 bottom-2 flex flex-col gap-2">
		{#if role.value === 'admin' || role.value === 'bpo' || role.value === 'contabil'}
			<button
				onclick={() => {
					editarUserModal = true;
				}}
				class="text-accent bg-accent/10 hover:drop-shadow-accent glass-bg flex items-center justify-center gap-3 rounded-full p-3 px-6 transition-all hover:-translate-y-1 hover:drop-shadow-[0_0_10px] active:translate-y-0"
				><div><Users class="text-xl" /></div>
				<span>Colaboradores</span></button
			>
			<button
				onclick={() => {
					finalizarModal = true;
				}}
				class="text-accent bg-accent/10 hover:drop-shadow-accent glass-bg flex items-center justify-center gap-3 rounded-full p-3 px-6 transition-all hover:-translate-y-1 hover:drop-shadow-[0_0_10px] active:translate-y-0"
			>
				{#if finalizando}
					<Star
						class="text-accent drop-shadow-accent w-[10ch] animate-spin text-xl drop-shadow-[0_0_10px]"
					/>
				{:else}
					Finalizar Mês
				{/if}
			</button>
		{/if}
		<button
			onclick={() => (logoutModal = true)}
			class="text-accent hover:drop-shadow-accent actice:translate-y-0 flex items-center justify-center gap-3 px-6 hover:drop-shadow-[0_0_10px] {loadingLocal
				? 'pointer-events-none opacity-50'
				: ''} bg-accent/10 glass-bg cursor-pointer rounded-full p-3 transition-all hover:-translate-y-1"
		>
			<span>Sair</span>
			<Sair />
		</button>
	</div>
{:else}
	<div class="fixed right-2 bottom-2 flex flex-col gap-2">
		<button
			onclick={handleGoogleSignIn}
			class="text-accent hover:drop-shadow-accent actice:translate-y-0 flex items-center justify-center gap-3 px-6 hover:drop-shadow-[0_0_10px] {loadingLocal
				? 'pointer-events-none opacity-50'
				: ''} bg-accent/10 glass-bg cursor-pointer rounded-full p-3 transition-all hover:-translate-y-1"
		>
			<Google />
			<span>Entrar</span>
		</button>
	</div>
{/if}

{#if logoutModal}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		onclick={() => (logoutModal = false)}
		class="fixed flex h-screen w-screen items-center justify-center bg-black/20"
	>
		<div
			onclick={(e) => e.stopPropagation()}
			class="bg-secondary/30 relative flex max-w-[80ch] flex-col items-center gap-10 rounded-xl p-10 backdrop-blur"
		>
			Tem certeza que deseja sair?
			<button class="bg-primary/30 rounded-lg p-3 px-5" onclick={() => handleLogout()}>Sim</button>
			<button
				class=" text-primary absolute top-2 right-2 rounded-full text-2xl"
				onclick={() => (logoutModal = false)}
				><Close />
			</button>
		</div>
	</div>
{/if}

{#if finalizarModal}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		onclick={() => (finalizarModal = false)}
		class="fixed flex h-screen w-screen items-center justify-center bg-black/20"
	>
		<div
			onclick={(e) => e.stopPropagation()}
			class="bg-secondary/30 relative z-50 flex max-w-[80ch] flex-col items-center gap-10 rounded-xl p-10 backdrop-blur"
		>
			Tem certeza que deseja finalizar o mês? Esta ação irá enviar os dados para a base de dados dos
			históricos.
			<button class="bg-primary/30 rounded-lg p-3 px-5" onclick={async () => await finalizar()}
				>Confirmar Finalização</button
			>
			<button
				class=" text-primary absolute top-2 right-2 rounded-full text-2xl"
				onclick={() => (finalizarModal = false)}
				><Close />
			</button>
		</div>
	</div>
{/if}

{#if editarUserModal}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		onclick={() => {
			newName = '';
			newSurname = '';
			newEmail = '';
			newGender = '';
			newId = '';
			newRole = '';
			editColaboradoresTab = 0;
			editarUserModal = false;
		}}
		class="fixed flex h-screen w-screen items-center justify-center bg-black/20"
	>
		<div
			onclick={(e) => e.stopPropagation()}
			class="relative z-50 mx-[1rem] flex w-fit max-w-[80ch] items-center gap-10 rounded-xl bg-neutral-600/30 p-10 backdrop-blur"
		>
			<button
				onclick={() => {
					newName = '';
					newSurname = '';
					newEmail = '';
					newGender = '';
					newId = '';
					newRole = '';
					editColaboradoresTab = 0;
					editarUserModal = false;
				}}
				class="absolute top-2 right-2 content-['']"
			>
				<Close class="text-2xl" />
			</button>
			{#if editColaboradoresTab !== 0}
				<button
					onclick={() => {
						newName = '';
						newSurname = '';
						newEmail = '';
						newGender = '';
						newId = '';
						newRole = '';
						editColaboradoresTab = 0;
					}}
					class="absolute top-2 left-2 content-['']"><Back class="text-2xl" /></button
				>
			{/if}
			{#if editColaboradoresTab === 0}
				<div class="flex w-full flex-col items-center gap-2">
					<h2>Gerenciar Colaboradores</h2>
					<button
						onclick={() => {
							editColaboradoresTab = 1;
						}}
						class="glass-bg rounded-full p-2 px-4">Adicionar Colaboradores</button
					>
					<button
						onclick={() => {
							editColaboradoresTab = 2;
						}}
						class="glass-bg rounded-full p-2 px-4">Remover Colaboradores</button
					>
				</div>
			{:else if editColaboradoresTab === 1}
				<div class="flex flex-col gap-2">
					<h2>Adicionar Colaboradores</h2>
					<form onsubmit={() => addUser(newName, newSurname, newEmail, newGender, checkRole())}>
						<div class="flex w-full flex-col gap-2">
							<div class="flex flex-col">
								<label for="data">Data de Ingresso</label>
								<input
									type="date"
									name="data"
									class="rounded-full border-0 bg-white/20"
									id="data"
									bind:value={pickedTime}
									required
								/>
							</div>
							<div class="flex flex-col">
								<label for="nome">Nome</label>
								<input
									type="text"
									class="rounded-full border-0 bg-white/20"
									name="nome"
									id="nome"
									bind:value={newName}
									required
								/>
							</div>
							<div class="flex flex-col">
								<label for="sobrenome">Sobrenome</label>
								<input
									type="text"
									class="rounded-full border-0 bg-white/20"
									name="sobrenome"
									id="sobrenome"
									bind:value={newSurname}
									required
								/>
							</div>
							<div class="flex flex-col">
								<label for="email">E-mail (@movenegocios.com.br)</label>
								<input
									type="email"
									class="rounded-full border-0 bg-white/20"
									bind:value={newEmail}
									name="email"
									id="email"
									required
								/>
							</div>
							<div class="flex flex-col">
								<label for="gender">Arte</label>
								<fieldset class="mt-2 flex w-full justify-around">
									<div>
										<input
											required
											type="radio"
											name="gender"
											bind:group={newGender}
											id="choicem"
											value="m"
											class="hidden"
										/>
										<label for="choicem">
											<img
												src="/assets/m/11.webp"
												class="max-w-[10ch] rounded-xl drop-shadow-[0_0_5px] drop-shadow-black/50 transition-all hover:scale-105 {newGender ===
												'm'
													? 'border-accent/50 scale-105 border-2'
													: newGender === 'f'
														? 'opacity-50'
														: ''}"
												alt=""
											/>
										</label>
									</div>
									<div>
										<input
											required
											type="radio"
											name="gender"
											bind:group={newGender}
											id="choicef"
											value="f"
											class="hidden"
										/>
										<label for="choicef">
											<img
												src="/assets/f/11.webp"
												class="max-w-[10ch] rounded-xl drop-shadow-[0_0_5px] drop-shadow-black/50 transition-all hover:scale-105 {newGender ===
												'f'
													? 'border-accent/50 scale-105 border-2'
													: newGender === 'm'
														? 'opacity-50'
														: ''}"
												alt=""
											/>
										</label>
									</div>
								</fieldset>
							</div>
							{#if role.value === 'admin'}
								<div class="flex flex-col">
									<label for="role">Área</label>
									<fieldset class="flex w-full flex-col justify-around">
										<div>
											<input
												required
												type="radio"
												name="role"
												bind:group={newRole}
												id="choicebpo"
												value="bpo"
											/>
											<label for="choicebpo">BPO Financeiro</label>
										</div>
										<div>
											<input
												required
												type="radio"
												name="role"
												bind:group={newRole}
												id="choicecontabil"
												value="contabil"
											/>
											<label for="choicecontabil">Contabilidade</label>
										</div>
									</fieldset>
								</div>
							{/if}
						</div>
						<input
							type="submit"
							value="Adicionar"
							class="glass-bg mt-4 w-full cursor-pointer rounded-full p-3 px-5 transition-all hover:-translate-y-1 hover:drop-shadow-[0_0_10px] hover:drop-shadow-white active:translate-y-0 active:drop-shadow-none"
						/>
					</form>
					<button onclick={() => (editColaboradoresTab = 0)} class="glass-bg rounded-full p-3"
						>Voltar</button
					>
				</div>
			{:else if editColaboradoresTab === 2}
				<div class="flex flex-col gap-10">
					<h2>Remover Colaboradores</h2>
					<div class="flex flex-col gap-1">
						{#each list.value as colaborador, i}
							<button
								onclick={() => {
									userToRemove = colaborador.name;
									idToRemove = colaborador.id;
									removeModal = true;
								}}
								class="group glass-bg h-[2rem] rounded-full bg-white/10 hover:bg-red-500"
							>
								<span class="block group-hover:hidden">
									{colaborador.name}
								</span>
								<span class="hidden h-[1rem] justify-center group-hover:flex"><CloseThick /></span>
							</button>
						{/each}
					</div>
					<button onclick={() => (editColaboradoresTab = 0)} class="glass-bg rounded-full p-3"
						>Voltar</button
					>
				</div>
			{/if}
		</div>
	</div>
{/if}

{#if removeModal}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		onclick={() => {
			idToRemove = '';
			userToRemove = '';
			removeModal = false;
		}}
		class="fixed flex h-screen w-screen items-center justify-center bg-black/20"
	>
		<div
			onclick={(e) => e.stopPropagation()}
			class="relative z-50 flex max-w-[80ch] items-center gap-10 rounded-xl bg-neutral-600/30 p-10 backdrop-blur"
		>
			<div class="flex max-w-[50ch] flex-col gap-2">
				<p class="text-xl">Tem certeza que deseja remover {userToRemove}?</p>
				<p class="text-neutral-400">Esta ação irá remover permanentemente os dados e o histórico</p>
				<button
					class="glass-bg rounded-full bg-red-500/20 p-3 px-5 transition-all hover:-translate-y-1 hover:bg-red-500 hover:drop-shadow-[0_0_10px] hover:drop-shadow-red-500 active:translate-y-0"
					onclick={() => removeUser(idToRemove)}>Confirmar</button
				>
				<button
					onclick={() => {
						idToRemove = '';
						userToRemove = '';
						removeModal = false;
					}}
					class="glass-bg rounded-full p-3 px-5 hover:-translate-y-1">Voltar</button
				>
			</div>
		</div>
	</div>
{/if}
