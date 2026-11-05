import { Clock3, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Topbar from "@/components/Topbar";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";

const formatDuration = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	return `${minutes}:${Math.floor(seconds % 60).toString().padStart(2, "0")}`;
};

const AlbumPage = () => {
	const { albumId } = useParams<{ albumId: string }>();
	const [loadedId, setLoadedId] = useState<string | null>(null);
	const album = useMusicStore((state) => state.currentAlbum);
	const error = useMusicStore((state) => state.error);
	const fetchAlbumById = useMusicStore((state) => state.fetchAlbumById);
	const currentSong = usePlayerStore((state) => state.currentSong);
	const isPlaying = usePlayerStore((state) => state.isPlaying);
	const queue = usePlayerStore((state) => state.queue);
	const playAlbum = usePlayerStore((state) => state.playAlbum);
	const togglePlay = usePlayerStore((state) => state.togglePlay);

	useEffect(() => {
		if (!albumId) return;
		let active = true;
		void fetchAlbumById(albumId).then(() => {
			if (active) setLoadedId(albumId);
		});
		return () => {
			active = false;
		};
	}, [albumId, fetchAlbumById]);

	const currentAlbum = album?._id === albumId ? album : null;
	const albumQueue = currentAlbum && queue.length === currentAlbum.songs.length &&
		queue.every((song, index) => song._id === currentAlbum.songs[index]._id);
	const currentSongInAlbum = currentAlbum?.songs.some((song) => song._id === currentSong?._id) ?? false;
	const canToggleAlbum = albumQueue && currentSongInAlbum;

	const handlePlayAlbum = () => {
		if (!currentAlbum || currentAlbum.songs.length === 0) return;
		if (canToggleAlbum) togglePlay();
		else playAlbum(currentAlbum.songs);
	};

	return (
		<main className="min-h-0 min-w-0 flex-1 overflow-y-auto bg-gradient-to-b from-violet-900 via-zinc-900 to-zinc-900 text-white">
			<Topbar />
			{!albumId || (loadedId === albumId && !currentAlbum) ? (
				<div className="p-6" role="alert">
					<h1 className="text-2xl font-bold">Album unavailable</h1>
					<p className="mt-2 text-zinc-300">{error ?? "This album could not be found."}</p>
					<Link to="/" className="mt-4 inline-block text-green-400 hover:underline">Back to home</Link>
				</div>
			) : !currentAlbum ? (
				<div role="status" className="p-6 text-zinc-300">Loading album...</div>
			) : (
				<div className="mx-auto max-w-[1800px]">
					<div className="flex flex-col gap-6 p-4 sm:flex-row sm:items-end sm:p-6">
						<img src={currentAlbum.imageUrl} alt="" className="size-44 rounded object-cover shadow-2xl sm:size-56" />
						<div className="min-w-0">
							<p className="text-sm font-medium">Album</p>
							<h1 className="my-3 break-words text-4xl font-bold sm:text-5xl lg:text-7xl">{currentAlbum.title}</h1>
							<p className="text-sm text-zinc-200">
								<span className="font-semibold text-white">{currentAlbum.artist}</span>
								<span aria-hidden="true"> · </span>{currentAlbum.releaseYear}
								<span aria-hidden="true"> · </span>{currentAlbum.songs.length} {currentAlbum.songs.length === 1 ? "song" : "songs"}
							</p>
						</div>
					</div>
					<div className="px-4 py-5 sm:px-6">
						<button
							type="button"
							onClick={handlePlayAlbum}
							disabled={currentAlbum.songs.length === 0}
							aria-label={canToggleAlbum && isPlaying ? "Pause album" : "Play album"}
							className="flex size-14 items-center justify-center rounded-full bg-green-500 text-black transition-transform hover:scale-105 hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{canToggleAlbum && isPlaying ? <Pause className="size-7" fill="currentColor" /> : <Play className="size-7" fill="currentColor" />}
						</button>
					</div>
					<div className="bg-black/20 px-4 pb-8 sm:px-6">
						<div className="grid grid-cols-[2rem_minmax(0,1fr)_3rem] items-center gap-3 border-b border-white/10 px-3 py-3 text-sm text-zinc-400 sm:grid-cols-[2rem_minmax(0,1fr)_7rem_3rem]">
							<span>#</span><span>Title</span><span className="hidden sm:block">Released</span><Clock3 className="size-4" aria-label="Duration" />
						</div>
						{currentAlbum.songs.length === 0 ? (
							<p className="px-3 py-6 text-zinc-300">No songs in this album yet.</p>
						) : currentAlbum.songs.map((song, index) => (
							<button
								key={song._id}
								type="button"
								onClick={() => playAlbum(currentAlbum.songs, index)}
								aria-label={`Play ${song.title} by ${song.artist}`}
								className="group grid w-full grid-cols-[2rem_minmax(0,1fr)_3rem] items-center gap-3 rounded px-3 py-2 text-left text-sm text-zinc-400 hover:bg-white/10 sm:grid-cols-[2rem_minmax(0,1fr)_7rem_3rem]"
							>
								<span className={currentSong?._id === song._id ? "text-green-400" : ""}>{currentSong?._id === song._id && isPlaying ? "♫" : index + 1}</span>
								<span className="flex min-w-0 items-center gap-3">
									<img src={song.imageUrl} alt="" className="size-10 shrink-0 rounded object-cover" />
									<span className="min-w-0"><span className={`block truncate font-medium ${currentSong?._id === song._id ? "text-green-400" : "text-white"}`}>{song.title}</span><span className="block truncate">{song.artist}</span></span>
								</span>
								<span className="hidden sm:block">{song.createdAt.split("T")[0]}</span>
								<span>{formatDuration(song.duration)}</span>
							</button>
						))}
					</div>
				</div>
			)}
		</main>
	);
};

export default AlbumPage;
