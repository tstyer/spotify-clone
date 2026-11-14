import { SignedIn } from "@clerk/clerk-react";
import { Home, Library, MessageCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { useMusicStore } from "@/stores/useMusicStore";

const LeftSidebar = () => {
	const requestedAlbums = useRef(false);
	const albums = useMusicStore((state) => state.albums);
	const albumsStatus = useMusicStore((state) => state.albumsStatus);
	const albumsError = useMusicStore((state) => state.albumsError);
	const fetchAlbums = useMusicStore((state) => state.fetchAlbums);

	useEffect(() => {
		if (requestedAlbums.current) return;
		requestedAlbums.current = true;
		void fetchAlbums();
	}, [fetchAlbums]);

	const showSkeleton = albums.length === 0 && (albumsStatus === "idle" || albumsStatus === "loading");

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
				<SignedIn>
					<NavLink
						to="/chat"
						className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-zinc-800 ${isActive ? "bg-zinc-800 text-white" : "text-zinc-300"}`}
					>
						<MessageCircle className="size-5" aria-hidden="true" />
						Messages
					</NavLink>
				</SignedIn>
			</nav>

			<section aria-labelledby="album-library-heading" className="flex min-h-0 flex-1 flex-col rounded-lg bg-zinc-900 p-4">
				<h2 id="album-library-heading" className="mb-4 flex items-center gap-3 px-3 font-semibold">
					<Library className="size-5" aria-hidden="true" />
					Albums
				</h2>
				<div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
					{albumsStatus === "error" && (
						<div role="alert" className="px-3 text-sm text-red-400">
							<p>{albumsError ?? "Unable to load albums."}</p>
							<button type="button" onClick={() => void fetchAlbums()} className="mt-2 text-green-400 hover:underline">Try again</button>
						</div>
					)}
					{showSkeleton ? (
						<PlaylistSkeleton />
					) : albums.length === 0 ? (
						albumsStatus === "success" && <p className="px-3 text-sm text-zinc-400">No albums yet.</p>
					) : (
						albums.map((album) => (
							<NavLink
								key={album._id}
								to={`/albums/${album._id}`}
								className={({ isActive }) => `flex items-center gap-3 rounded-md p-2 hover:bg-zinc-800 ${isActive ? "bg-zinc-800" : ""}`}
							>
								<img src={album.imageUrl} alt="" className="size-12 shrink-0 rounded-md object-cover" />
								<div className="min-w-0">
									<p className="truncate font-medium">{album.title}</p>
									<p className="truncate text-sm text-zinc-400">Album · {album.artist}</p>
								</div>
							</NavLink>
						))
					)}
				</div>
			</section>
		</div>
	);
};

export default LeftSidebar;
