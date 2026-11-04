import { Pause, Play } from "lucide-react";
import { usePlayerStore } from "@/stores/usePlayerStore";
import type { Song } from "@/types";

const PlayButton = ({ song }: { song: Song }) => {
	const currentSong = usePlayerStore((state) => state.currentSong);
	const isPlaying = usePlayerStore((state) => state.isPlaying);
	const setCurrentSong = usePlayerStore((state) => state.setCurrentSong);
	const togglePlay = usePlayerStore((state) => state.togglePlay);
	const isCurrentSong = currentSong?._id === song._id;
	const isThisPlaying = isCurrentSong && isPlaying;

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation();
		if (isCurrentSong) togglePlay();
		else setCurrentSong(song);
	};

	return (
		<button
			type="button"
			onClick={handleClick}
			aria-label={`${isThisPlaying ? "Pause" : "Play"} ${song.title} by ${song.artist}`}
			className={`absolute bottom-3 right-3 flex size-10 items-center justify-center rounded-full bg-green-500 text-black shadow-lg transition-all hover:scale-105 hover:bg-green-400 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white sm:translate-y-2 sm:group-hover:translate-y-0 sm:group-focus-within:translate-y-0 ${
				isCurrentSong ? "opacity-100 sm:translate-y-0" : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
			}`}
		>
			{isThisPlaying ? <Pause className="size-5" aria-hidden="true" /> : <Play className="size-5" aria-hidden="true" />}
		</button>
	);
};

export default PlayButton;
