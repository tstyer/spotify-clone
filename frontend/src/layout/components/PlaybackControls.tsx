import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";
import { usePlayerStore } from "@/stores/usePlayerStore";

const formatTime = (seconds: number) => {
	if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
	const minutes = Math.floor(seconds / 60);
	const remainder = Math.floor(seconds % 60);
	return `${minutes}:${remainder.toString().padStart(2, "0")}`;
};

const getAudio = () => document.querySelector<HTMLAudioElement>("audio[data-player-audio]");

export const PlaybackControls = () => {
	const currentSong = usePlayerStore((state) => state.currentSong);
	const isPlaying = usePlayerStore((state) => state.isPlaying);
	const togglePlay = usePlayerStore((state) => state.togglePlay);
	const playNext = usePlayerStore((state) => state.playNext);
	const playPrevious = usePlayerStore((state) => state.playPrevious);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [volume, setVolume] = useState(75);
	const [previousVolume, setPreviousVolume] = useState(75);

	useEffect(() => {
		const audio = getAudio();
		if (!audio) return;

		const updateTime = () => setCurrentTime(audio.currentTime);
		const updateDuration = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
		const resetProgress = () => {
			setCurrentTime(0);
			setDuration(0);
		};

		audio.addEventListener("timeupdate", updateTime);
		audio.addEventListener("loadedmetadata", updateDuration);
		audio.addEventListener("durationchange", updateDuration);
		audio.addEventListener("emptied", resetProgress);
		return () => {
			audio.removeEventListener("timeupdate", updateTime);
			audio.removeEventListener("loadedmetadata", updateDuration);
			audio.removeEventListener("durationchange", updateDuration);
			audio.removeEventListener("emptied", resetProgress);
		};
	}, []);

	useEffect(() => {
		const audio = getAudio();
		if (audio) audio.volume = volume / 100;
	}, [volume]);

	useEffect(() => {
		setCurrentTime(0);
		setDuration(0);
	}, [currentSong?._id]);

	const seek = (value: number) => {
		const audio = getAudio();
		if (!audio || duration <= 0) return;
		audio.currentTime = Math.min(Math.max(value, 0), duration);
		setCurrentTime(audio.currentTime);
	};

	const toggleMute = () => {
		if (volume === 0) setVolume(previousVolume || 75);
		else {
			setPreviousVolume(volume);
			setVolume(0);
		}
	};

	const changeVolume = (value: number) => {
		setVolume(value);
		if (value > 0) setPreviousVolume(value);
	};

	return (
		<footer className="h-24 border-t border-zinc-800 bg-zinc-900 px-4 text-white">
			<div className="mx-auto flex h-full max-w-[1800px] items-center gap-4">
				<div className="hidden min-w-0 flex-1 items-center gap-3 sm:flex">
					{currentSong ? (
						<>
							<img src={currentSong.imageUrl} alt="" className="size-14 rounded object-cover" />
							<div className="min-w-0">
								<p className="truncate text-sm font-medium">{currentSong.title}</p>
								<p className="truncate text-xs text-zinc-400">{currentSong.artist}</p>
							</div>
						</>
					) : (
						<span className="text-sm text-zinc-500">No song selected</span>
					)}
				</div>

				<div className="flex w-full min-w-0 flex-col items-center gap-2 sm:w-[45%]">
					<div className="flex items-center gap-5">
						<button type="button" aria-label="Previous song" disabled={!currentSong} onClick={playPrevious} className="text-zinc-400 hover:text-white disabled:opacity-40">
							<SkipBack className="size-5" />
						</button>
						<button type="button" aria-label={isPlaying ? "Pause" : "Play"} disabled={!currentSong} onClick={togglePlay} className="flex size-9 items-center justify-center rounded-full bg-white text-black hover:bg-zinc-200 disabled:opacity-40">
							{isPlaying ? <Pause className="size-5" /> : <Play className="size-5" />}
						</button>
						<button type="button" aria-label="Next song" disabled={!currentSong} onClick={playNext} className="text-zinc-400 hover:text-white disabled:opacity-40">
							<SkipForward className="size-5" />
						</button>
					</div>
					<div className="flex w-full items-center gap-2 text-xs text-zinc-400">
						<span className="w-9 text-right">{formatTime(currentTime)}</span>
						<input
							type="range"
							aria-label="Seek"
							min={0}
							max={duration || 1}
							step={1}
							value={Math.min(currentTime, duration || 1)}
							disabled={!currentSong || duration <= 0}
							onChange={(event) => seek(event.currentTarget.valueAsNumber)}
							className="min-w-0 flex-1 cursor-pointer accent-green-500 disabled:cursor-default disabled:opacity-40"
						/>
						<span className="w-9">{formatTime(duration || currentSong?.duration || 0)}</span>
					</div>
				</div>

				<div className="hidden flex-1 items-center justify-end gap-2 sm:flex">
					<button type="button" aria-label={volume === 0 ? "Unmute" : "Mute"} onClick={toggleMute} className="text-zinc-400 hover:text-white">
						{volume === 0 ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
					</button>
					<input type="range" aria-label="Volume" min={0} max={100} value={volume} onChange={(event) => changeVolume(event.currentTarget.valueAsNumber)} className="w-24 cursor-pointer accent-green-500" />
				</div>
			</div>
		</footer>
	);
};
