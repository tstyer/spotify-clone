import { Home, Library } from "lucide-react";
import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useMusicStore } from "@/stores/useMusicStore";

const LeftSidebar = () => {
	const requestedAlbums = useRef(false);
	const albums = useMusicStore((state) => state.albums);
	const isLoading = useMusicStore((state) => state.isLoading);
	const fetchAlbums = useMusicStore((state) => state.fetchAlbums);

	useEffect(() => {
		if (requestedAlbums.current) return;
		requestedAlbums.current = true;
		void fetchAlbums();
	}, [fetchAlbums]);

	const showSkeleton = albums.length === 0 && (isLoading || !requestedAlbums.current);

	return (
		<div className="flex h-full min-h-0 flex-col gap-2 text-white">
			<nav aria-label="Main navigation" className="rounded-lg bg-zinc-900 p-4">
				<NavLink
					to="/"
					end
					className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-zinc-800 ${isActive ? "bg-zinc-800 text-white" : "text-zinc-300"}`}
				>
					<Home className="size-5" aria-hidden="true" />
					Home
				</NavLink>
			</nav>

			<section aria-labelledby="album-library-heading" className="flex min-h-0 flex-1 flex-col rounded-lg bg-zinc-900 p-4">
				<h2 id="album-library-heading" className="mb-4 flex items-center gap-3 px-3 font-semibold">
					<Library className="size-5" aria-hidden="true" />
					Albums
				</h2>
				<div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
					{showSkeleton ? (
						<div role="status" aria-label="Loading albums" className="space-y-2">
							{Array.from({ length: 3 }, (_, index) => (
								<div key={index} aria-hidden="true" className="flex animate-pulse items-center gap-3 rounded-md p-2">
									<div className="size-12 shrink-0 rounded-md bg-zinc-700" />
									<div className="flex-1 space-y-2">
										<div className="h-4 w-3/4 rounded bg-zinc-700" />
										<div className="h-3 w-1/2 rounded bg-zinc-700" />
									</div>
								</div>
							))}
						</div>
					) : albums.length === 0 ? (
						<p className="px-3 text-sm text-zinc-400">No albums yet.</p>
					) : (
						albums.map((album) => (
							<div key={album._id} className="flex items-center gap-3 rounded-md p-2">
								<img src={album.imageUrl} alt="" className="size-12 shrink-0 rounded-md object-cover" />
								<div className="min-w-0">
									<p className="truncate font-medium">{album.title}</p>
									<p className="truncate text-sm text-zinc-400">Album · {album.artist}</p>
								</div>
							</div>
						))
					)}
				</div>
			</section>
		</div>
	);
};

export default LeftSidebar;
