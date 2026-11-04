const FeaturedGridSkeleton = () => (
	<div role="status" aria-label="Loading featured songs" className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{Array.from({ length: 6 }, (_, index) => (
			<div key={index} aria-hidden="true" className="flex animate-pulse items-center overflow-hidden rounded-md bg-zinc-800/50">
				<div className="h-16 w-16 shrink-0 bg-zinc-700 sm:h-20 sm:w-20" />
				<div className="flex-1 p-4">
					<div className="mb-2 h-4 w-3/4 rounded bg-zinc-700" />
					<div className="h-3 w-1/2 rounded bg-zinc-700" />
				</div>
			</div>
		))}
	</div>
);

export default FeaturedGridSkeleton;
