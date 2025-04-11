<script lang="ts">
	let { remove, user } = $props();
</script>

{#if user.log.length > 0}
	<div class="flex flex-col gap-2">
		<h2>Log</h2>
		<div class="*:border-secondary flex flex-col gap-4 *:border-b *:p-2">
			{#each user.log as log, i}
				<div class="group flex w-full items-center justify-between">
					<div>
						<span>
							{log.text}
						</span>
						<p class="text-sm opacity-50">{log.date}</p>
					</div>
					<div class="flex items-center justify-center gap-2">
						<span
							class="bg-secondary flex w-[4rem] items-center justify-center rounded-lg p-2 text-lg {log.points >
							0
								? 'text-green-600'
								: 'text-red-600'}">{log.points}</span
						>
						<button
							onclick={() => {
								if (log.type === 'pontos') {
									user.log.splice(i, 1);
									remove(log.points);
								}
								if (log.type === 'conquista') {
									user.log.splice(i, 1);
									user.conquistas.splice(i, 1);
								}
							}}
							class="hidden cursor-pointer rounded bg-red-500 p-1 px-3 text-white group-hover:flex"
							>X</button
						>
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}
