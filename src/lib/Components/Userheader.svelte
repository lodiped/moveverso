<script lang="ts">
	import { titlesfem, titles, totalConquistas } from '$lib/state.svelte';
	let { user, imgsrc } = $props();

	let firstname = $state('');
	let lastname = $state('');

	$effect(() => {
		[firstname, lastname] = user.name.split(' ');
	});
</script>

<div class="flex flex-col items-center justify-center gap-5 lg:flex-row">
	<div class="flex w-1/2 items-center justify-center">
		{#if imgsrc}
			<img src={imgsrc} alt="" class="rounded-3xl" />
		{/if}
	</div>
	<div class="flex w-full flex-col items-start justify-center gap-8 px-2 lg:w-1/2 lg:px-0">
		<div class="flex w-full flex-col items-center pt-5">
			<h2 class="drop-shadow-accent/70 -mb-4 drop-shadow-[0_0_10px]">{firstname}</h2>
			<h2 class="drop-shadow-accent/70 drop-shadow-[0_0_10px]">{lastname}</h2>
			<div class="bg-secondary relative -mt-1 h-3 w-2/3 rounded-md">
				<div
					class="bg-accent drop-shadow-accent/70 absolute top-0 left-0 h-full w-full rounded-md drop-shadow-[0_0_10px] transition-all content-['']"
					style={`width: ${user.total / 75}%;`}
				></div>
			</div>
			<div class="mt-0.5 flex w-full justify-center text-sm opacity-50">
				<span>
					desde {user.ingress}
				</span>
			</div>
		</div>
		<div class="flex w-full items-center justify-start gap-3 pl-5 lg:pl-0">
			<div
				class="bg-primary/20 flex w-15 flex-col items-center justify-between rounded-lg backdrop-blur-xs"
			>
				<p
					class="text-accent drop-shadow-accent/70 flex items-center py-1.5 text-3xl font-bold drop-shadow-[0_0_5px]"
				>
					{user.fase}
				</p>
				<p
					class="bg-accent/20 drop-shadow-accent/70 w-full rounded-b-lg py-0.5 text-center text-xs text-black drop-shadow-[0_0_5px]"
				>
					Fase
				</p>
			</div>
			<div class="flex w-full flex-col items-start justify-center gap-0.5">
				<p class="font-magic text-3xl font-bold">
					{titles.fase?.[user.fase - 1]?.title ?? '--'}
				</p>
				<div class="bg-secondary relative h-4 w-full rounded-md">
					<div
						class="bg-accent drop-shadow-accent/70 absolute top-0 left-0 h-full w-full rounded-md drop-shadow-[0_0_10px] transition-all content-['']"
						style={`width: ${user.current / 15}%;`}
					></div>
				</div>
				<div class="flex w-full justify-between text-xs">
					<p><span class="opacity-50">Pontos nesta fase:</span> <span>{user.current}</span></p>
					<p>
						<span class="opacity-50">p/ próxima fase:</span> <span>{1500 - user.current}</span>
					</p>
				</div>
			</div>
		</div>
		<div class="flex w-full items-center justify-start gap-3 pl-5 lg:pl-0">
			<div class="bg-primary/20 flex w-15 flex-col items-center rounded-lg backdrop-blur-xs">
				<p
					class="text-accent drop-shadow-accent/70 py-1.5 text-3xl font-bold drop-shadow-[0_0_5px]"
				>
					{user.nivel}
				</p>
				<p
					class="bg-accent/20 drop-shadow-accent/70 w-full rounded-b-lg py-0.5 text-center text-xs text-black drop-shadow-[0_0_5px]"
				>
					Nível
				</p>
			</div>
			<div class="flex w-full flex-col items-start justify-center gap-0.5">
				<p class="font-magic text-3xl font-bold">
					{user.gender === 'f'
						? titlesfem.fase?.[user.fase - 1]?.nivel[user.nivel - 1]
						: (titles.fase?.[user.fase - 1]?.nivel[user.nivel - 1] ?? '--')}
				</p>
				<div class="bg-secondary relative h-4 w-full rounded-md">
					<div
						class="bg-accent drop-shadow-accent/70 absolute top-0 left-0 h-full w-full rounded-md drop-shadow-[0_0_10px] transition-all content-['']"
						style={`width: ${user.xp / 1.5}%;`}
					></div>
				</div>
				<div class="flex w-full justify-between text-xs">
					<p><span class="opacity-50">Pontos neste nível:</span> <span>{user.xp}</span></p>
					<p>
						<span class="opacity-50">p/ próximo nível:</span> <span>{150 - user.xp}</span>
					</p>
				</div>
			</div>
		</div>
		<div class="flex w-full flex-col items-center justify-center gap-2 lg:items-start">
			<div>
				<span class="opacity-50">Conquistas:</span> <span>{totalConquistas.value}</span>
			</div>
			{#if user.conquistas?.length > 0}
				<div class=" flex items-start justify-center gap-5">
					{#each user.conquistas as conquista}
						{#if conquista.number > 0}
							<div class=" inline-block w-full text-center align-top">
								<div
									title={conquista.desc}
									class="drop-shadow-accent/70 flex cursor-default flex-col justify-start text-4xl drop-shadow-[0_0_15px] hover:scale-105"
								>
									<p class="">
										{conquista.img}
									</p>
									{#if conquista.number > 1}
										<span class="text-lg opacity-50">{conquista.number}x</span>
									{/if}
								</div>
							</div>
						{/if}
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
