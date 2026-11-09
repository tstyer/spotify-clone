import { Disc3 } from "lucide-react";
import { Link } from "react-router-dom";
import { useMusicStore } from "@/stores/useMusicStore";
import AddAlbumDialog from "./AddAlbumDialog";

const AlbumsLibrary = () => {
	const albums = useMusicStore((state) => state.albums);
	const status = useMusicStore((state) => state.albumsStatus);
	const error = useMusicStore((state) => state.albumsError);
	const fetchAlbums = useMusicStore((state) => state.fetchAlbums);

	return (
		<section aria-labelledby="albums-library-heading" className="rounded-lg border border-zinc-700/50 bg-zinc-800/50 p-4 sm:p-6">
			<div className="mb-5 flex flex-wrap items-center justify-between gap-4">
				<div className="flex items-center gap-2">
					<Disc3 className="size-5 text-violet-400" aria-hidden="true" />
					<div>
						<h2 id="albums-library-heading" className="text-lg font-semibold">Albums Library</h2>
						<p className="text-sm text-zinc-400">Manage your album collection</p>
					</div>
				</div>
				<AddAlbumDialog />
			</div>
			{status === "idle" || status === "loading" ? (
				<p role="status" className="py-6 text-sm text-zinc-400">Loading albums...</p>
			) : status === "error" ? (
				<div role="alert" className="py-6 text-sm text-red-400">
					<p>{error ?? "Unable to load albums"}</p>
					<button type="button" onClick={() => void fetchAlbums()} className="mt-2 text-green-400 hover:underline">Try again</button>
				</div>
			) : albums.length === 0 ? (
				<p className="py-6 text-sm text-zinc-400">No albums in the catalog yet.</p>
			) : (
				<div className="overflow-x-auto">
					<table className="w-full min-w-[560px] border-collapse text-left text-sm">
						<thead className="border-b border-zinc-700 text-zinc-400">
							<tr><th scope="col" className="p-3 font-medium">Album</th><th scope="col" className="p-3 font-medium">Artist</th><th scope="col" className="p-3 font-medium">Release Year</th><th scope="col" className="p-3 text-right font-medium">Songs</th></tr>
						</thead>
						<tbody>
							{albums.map((album) => (
								<tr key={album._id} className="border-b border-zinc-700/50 last:border-0 hover:bg-zinc-700/30">
									<td className="p-3"><Link to={`/albums/${album._id}`} className="flex items-center gap-3 hover:underline"><img src={album.imageUrl} alt="" className="size-10 shrink-0 rounded object-cover" /><span className="font-medium">{album.title}</span></Link></td>
									<td className="p-3 text-zinc-300">{album.artist}</td>
									<td className="p-3 text-zinc-400">{album.releaseYear}</td>
									<td className="p-3 text-right text-zinc-400">{album.songs.length}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</section>
	);
};

export default AlbumsLibrary;
