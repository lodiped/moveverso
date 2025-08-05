<script lang="ts">
	// @ts-ignore
	import ArrowDn from 'virtual:icons/mdi/arrow-down';
	// @ts-ignore
	import ArrowUp from 'virtual:icons/mdi/arrow-up';
	// @ts-ignore
	import Save from 'virtual:icons/mdi/floppy';

	let newMedia: number | undefined = $state();
	let newTreinamento: number | undefined = $state();
	let newCumbuca: number | undefined = $state();
	let newSportsPoints: number | undefined = $state();

	let {
		user = $bindable(),
		giveCoin,
		receiveCoin,
		setMedia,
		setTreinamento,
		setCumbuca,
		setHP,
		sportsPoints
	} = $props();
</script>

<div class="flex w-full flex-col items-center gap-3 px-2 lg:px-0">
	<h3>Cultura Admin</h3>
	<div class="flex w-full gap-3 *:w-1/3">
		<div class="flex flex-col gap-3 text-center">
			<p>Média 360º</p>
			<input
				bind:value={newMedia}
				type="number"
				name="media"
				id="media"
				class="bg-primary/20 w-full appearance-none rounded-xl border border-white/20 py-3"
				placeholder="Média"
			/>
			<button
				onclick={() => setMedia(user.id, newMedia)}
				class="bg-primary/30 flex w-full items-center justify-center gap-2 rounded-xl py-3"
				><Save /><span>Salvar</span></button
			>
		</div>
		<div class="flex flex-col items-center gap-3">
			<p>Move Sports</p>
			<div class="flex w-full gap-3">
				<div class="flex w-full flex-col items-center gap-3">
					<button
						disabled={user ? user.cultura.sports.hp >= 3 : false}
						onclick={() => setHP(user.id, '+')}
						class="bg-primary/30 w-full cursor-pointer rounded-xl py-3 disabled:cursor-default {user
							.cultura.sports.hp < 3
							? ''
							: 'opacity-50'}">+</button
					>
					<button
						disabled={user ? user.cultura.sports.hp <= 0 : false}
						onclick={() => setHP(user.id, '-')}
						class="bg-primary/30 w-full cursor-pointer rounded-xl py-3 disabled:cursor-default {user
							.cultura.sports.hp > 0
							? ''
							: 'opacity-50'}">-</button
					>
				</div>
				<div class="flex w-full flex-col items-center gap-3">
					<input
						bind:value={newSportsPoints}
						placeholder="pontos"
						class="bg-primary/20 w-full appearance-none rounded-xl border border-white/20 py-3"
					/>
					<button
						onclick={() => sportsPoints(user.id, newSportsPoints)}
						class="bg-primary/30 flex h-full w-full cursor-pointer items-center justify-center rounded-xl py-3"
						><Save /></button
					>
				</div>
			</div>
		</div>
		<div class="flex flex-col items-center gap-3">
			<p>Move Coin</p>
			<button
				onclick={() => receiveCoin(user.id)}
				class="bg-primary/30 flex w-full items-center justify-center gap-2 rounded-xl py-3"
				><ArrowDn /><span>Recebeu</span></button
			>
			<button
				onclick={() => giveCoin(user.id)}
				class="bg-primary/30 flex w-full items-center justify-center gap-2 rounded-xl py-3"
				><ArrowUp /><span>Entregou</span></button
			>
		</div>
	</div>
	<div class="flex w-full flex-col items-center gap-3">
		<p>Presença</p>
		<div class="flex w-full gap-3">
			<input
				bind:value={newTreinamento}
				type="number"
				class="bg-primary/20 w-full appearance-none rounded-xl border border-white/20"
				name="treinamento"
				id="treinamento"
				placeholder="Treinamento (%)"
			/>
			<input
				bind:value={newCumbuca}
				type="number"
				class="bg-primary/20 w-full appearance-none rounded-xl border border-white/20"
				name="cumbuca"
				id="cumbuca"
				placeholder="Cumbuca (%)"
			/>
		</div>
		<div class="flex w-full gap-3">
			<button
				onclick={() => setTreinamento(user.id, newTreinamento)}
				class="bg-primary/30 flex w-full items-center justify-center gap-2 rounded-xl py-3"
				><Save /><span>Salvar</span></button
			>
			<button
				onclick={() => setCumbuca(user.id, newCumbuca)}
				class="bg-primary/30 flex w-full items-center justify-center gap-2 rounded-xl py-3"
				><Save /><span>Salvar</span></button
			>
		</div>
	</div>
</div>
