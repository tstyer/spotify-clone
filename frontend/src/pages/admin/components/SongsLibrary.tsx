import { ListMusic } from "lucide-react";
import { useMusicStore } from "@/stores/useMusicStore";
import AddSongDialog from "./AddSongDialog";

const formatDuration = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	return `${minutes}:${Math.floor(seconds % 60).toString().padStart(2, "0")}`;
};

const SongsLibrary = () => {
	const songs = useMusicStore((state) => state.songs);
	const status = useMusicStore((state) => state.songsStatus);
	const error = useMusicStore((state) => state.songsError);
	const fetchSongs = useMusicStore((state) => state.fetchSongs);

	return (
		<section aria-labelledby="songs-library-heading" className="rounded-lg border border-zinc-700/50 bg-zinc-800/50 p-4 sm:p-6">
			<div className="mb-5 flex flex-wrap items-center justify-between gap-4">
				<div className="flex items-center gap-2">
					<ListMusic className="size-5 text-emerald-400" aria-hidden="true" />
					<div>
						<h2 id="songs-library-heading" className="text-lg font-semibold">Songs Library</h2>
						<p className="text-sm text-zinc-400">Manage your music tracks</p>
					</div>
				</div>
				<AddSongDialog />
			</div>
			{status === "idle" || status === "loading" ? (
				<p role="status" className="py-6 text-sm text-zinc-400">Loading songs...</p>
			) : status === "error" ? (
				<div role="alert" className="py-6 text-sm text-red-400">
					<p>{error ?? "Unable to load songs"}</p>
					<button type="button" onClick={() => void fetchSongs()} className="mt-2 text-green-400 hover:underline">Try again</button>
				</div>
			) : songs.length === 0 ? (
				<p className="py-6 text-sm text-zinc-400">No songs in the catalog yet.</p>
			) : (
				<div className="overflow-x-auto">
					<table className="w-full min-w-[620px] border-collapse text-left text-sm">
						<thead className="border-b border-zinc-700 text-zinc-400">
							<tr><th scope="col" className="p-3 font-medium">Song</th><th scope="col" className="p-3 font-medium">Artist</th><th scope="col" className="p-3 font-medium">Added</th><th scope="col" className="p-3 text-right font-medium">Duration</th></tr>
						</thead>
						<tbody>
							{songs.map((song) => (
								<tr key={song._id} className="border-b border-zinc-700/50 last:border-0 hover:bg-zinc-700/30">
									<td className="p-3"><div className="flex items-center gap-3"><img src={song.imageUrl} alt="" className="size-10 shrink-0 rounded object-cover" /><span className="font-medium">{song.title}</span></div></td>
									<td className="p-3 text-zinc-300">{song.artist}</td>
									<td className="p-3 text-zinc-400"><time dateTime={song.createdAt}>{song.createdAt.split("T")[0]}</time></td>
									<td className="p-3 text-right text-zinc-400">{formatDuration(song.duration)}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</section>
	);
};

export default SongsLibrary;
