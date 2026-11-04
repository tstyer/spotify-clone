const SectionGridSkeleton = () => (
	<div role="status" aria-label="Loading songs" className="mb-8">
		<div aria-hidden="true" className="mb-4 h-8 w-48 animate-pulse rounded bg-zinc-800" />
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{Array.from({ length: 4 }, (_, index) => (
				<div key={index} aria-hidden="true" className="animate-pulse rounded-md bg-zinc-800/40 p-4">
					<div className="mb-4 aspect-square rounded-md bg-zinc-700" />
					<div className="mb-2 h-4 w-3/4 rounded bg-zinc-700" />
					<div className="h-4 w-1/2 rounded bg-zinc-700" />
				</div>
			))}
		</div>
	</div>
);

export default SectionGridSkeleton;
