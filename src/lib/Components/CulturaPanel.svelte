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

	let {
		user = $bindable(),
		toggleSports,
		giveCoin,
		receiveCoin,
		setMedia,
		setTreinamento,
		setCumbuca
	} = $props();
</script>

<div class="flex flex-col items-center gap-5">
	<h3>ADM Cultura</h3>
	<div class="flex gap-5 *:w-1/3">
		<div class="flex flex-col gap-2 text-center">
			<p>Média 360º</p>
			<input
				bind:value={newMedia}
				type="number"
				name="media"
				id="media"
				class="w-full appearance-none rounded-xl border-0 text-black placeholder:opacity-50"
				placeholder="Média"
			/>
			<button
				onclick={() => setMedia(user.id, newMedia)}
				class="bg-secondary flex w-full items-center justify-center gap-2 rounded-xl p-2"
				><Save /><span>Salvar</span></button
			>
		</div>
		<div class="flex flex-col items-center gap-2">
			<p>Move Sports</p>
			<button
				disabled={user.cultura.sports.presente}
				onclick={() => toggleSports(user.id)}
				class="bg-secondary w-full rounded-xl p-2 {user.cultura.sports.presente
					? 'opacity-50'
					: ''}">Ativo</button
			>
			<button
				disabled={!user.cultura.sports.presente}
				onclick={() => toggleSports(user.id)}
				class="bg-secondary w-full rounded-xl p-2 {user.cultura.sports.presente
					? ''
					: 'opacity-50'}">Inativo</button
			>
		</div>
		<div class="flex flex-col items-center gap-2">
			<p>Move Coin</p>
			<button
				onclick={() => receiveCoin(user.id)}
				class="bg-secondary flex w-full items-center justify-center gap-2 rounded-xl p-2"
				><ArrowDn /><span>Recebeu</span></button
			>
			<button
				onclick={() => giveCoin(user.id)}
				class="bg-secondary flex w-full items-center justify-center gap-2 rounded-xl p-2"
				><ArrowUp /><span>Entregou</span></button
			>
		</div>
	</div>
	<div class="flex flex-col items-center gap-2">
		<p>Presença</p>
		<div class="flex gap-5">
			<input
				bind:value={newTreinamento}
				type="number"
				class="rounded-xl border-0 text-black placeholder:opacity-50"
				name="treinamento"
				id="treinamento"
				placeholder="Treinamento (%)"
			/>
			<input
				bind:value={newCumbuca}
				type="number"
				class="rounded-xl border-0 text-black placeholder:opacity-50"
				name="cumbuca"
				id="cumbuca"
				placeholder="Cumbuca (%)"
			/>
		</div>
		<div class="flex w-full gap-5">
			<button
				onclick={() => setTreinamento(user.id, newTreinamento)}
				class="bg-secondary flex w-full items-center justify-center gap-2 rounded-xl p-2"
				><Save /><span>Salvar</span></button
			>
			<button
				onclick={() => setCumbuca(user.id, newCumbuca)}
				class="bg-secondary flex w-full items-center justify-center gap-2 rounded-xl p-2"
				><Save /><span>Salvar</span></button
			>
		</div>
	</div>
</div>
