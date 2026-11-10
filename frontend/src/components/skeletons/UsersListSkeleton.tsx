const UsersListSkeleton = () => (
	<div role="status" aria-label="Loading listeners" className="space-y-1">
		{Array.from({ length: 4 }, (_, index) => (
			<div key={index} aria-hidden="true" className="flex animate-pulse items-center justify-center gap-3 rounded-md p-2 sm:justify-start">
				<div className="size-10 shrink-0 rounded-full bg-zinc-700" />
				<div className="hidden min-w-0 flex-1 space-y-2 sm:block">
					<div className="h-3 w-3/4 rounded bg-zinc-700" />
					<div className="h-2 w-1/2 rounded bg-zinc-700" />
				</div>
			</div>
		))}
	</div>
);

export default UsersListSkeleton;
