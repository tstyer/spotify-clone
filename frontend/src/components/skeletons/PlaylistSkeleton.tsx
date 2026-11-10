const PlaylistSkeleton = () => (
	<div role="status" aria-label="Loading albums" className="space-y-2">
		{Array.from({ length: 7 }, (_, index) => (
			<div key={index} aria-hidden="true" className="flex animate-pulse items-center gap-3 rounded-md p-2">
				<div className="size-12 shrink-0 rounded-md bg-zinc-700" />
				<div className="min-w-0 flex-1 space-y-2">
					<div className="h-4 w-3/4 rounded bg-zinc-700" />
					<div className="h-3 w-1/2 rounded bg-zinc-700" />
				</div>
			</div>
		))}
	</div>
);

export default PlaylistSkeleton;
