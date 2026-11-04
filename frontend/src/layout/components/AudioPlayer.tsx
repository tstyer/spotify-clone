import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/stores/usePlayerStore";

const AudioPlayer = () => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const previousSource = useRef<string | null>(null);
	const currentSong = usePlayerStore((state) => state.currentSong);
	const isPlaying = usePlayerStore((state) => state.isPlaying);
	const playNext = usePlayerStore((state) => state.playNext);

	useEffect(() => {
		const audio = audioRef.current;
		const source = currentSong ? `${currentSong._id}:${currentSong.audioUrl}` : null;
		if (!audio || previousSource.current === source) return;

		previousSource.current = source;
		audio.pause();
		if (currentSong) {
			audio.src = currentSong.audioUrl;
			audio.currentTime = 0;
		} else {
			audio.removeAttribute("src");
			audio.load();
		}
	}, [currentSong]);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;
		if (!currentSong || !isPlaying) {
			audio.pause();
			return;
		}

		let active = true;
		void audio.play().catch(() => {
			const player = usePlayerStore.getState();
			if (active && player.isPlaying && player.currentSong?._id === currentSong._id) player.togglePlay();
		});
		return () => {
			active = false;
		};
	}, [currentSong, isPlaying]);

	const handleError = () => {
		const player = usePlayerStore.getState();
		if (player.isPlaying) player.togglePlay();
	};

	return <audio ref={audioRef} onEnded={playNext} onError={handleError} preload="metadata" />;
};

export default AudioPlayer;
