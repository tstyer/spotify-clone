import { create } from "zustand";
import type { Song } from "@/types";
import { useChatStore } from "./useChatStore";

interface PlayerStore {
	currentSong: Song | null;
	isPlaying: boolean;
	queue: Song[];
	currentIndex: number;
	initializeQueue: (songs: Song[]) => void;
	playAlbum: (songs: Song[], startIndex?: number) => void;
	setCurrentSong: (song: Song | null) => void;
	togglePlay: () => void;
	playNext: () => void;
	playPrevious: () => void;
}

const announceSong = (song: Song) => {
	useChatStore.getState().updateActivity(`Playing ${song.title} by ${song.artist}`);
};

const announceIdle = () => {
	useChatStore.getState().updateActivity("Idle");
};

export const usePlayerStore = create<PlayerStore>((set, get) => ({
	currentSong: null,
	isPlaying: false,
	queue: [],
	currentIndex: -1,

	initializeQueue: (songs) => {
		if (songs.length === 0 || get().queue.length > 0) return;
		set({ queue: songs, currentSong: songs[0], currentIndex: 0, isPlaying: false });
	},

	playAlbum: (songs, startIndex = 0) => {
		if (songs.length === 0) return;
		const index = Number.isInteger(startIndex) && startIndex >= 0 && startIndex < songs.length ? startIndex : 0;
		const song = songs[index];
		set({ queue: songs, currentSong: song, currentIndex: index, isPlaying: true });
		announceSong(song);
	},

	setCurrentSong: (song) => {
		if (!song) {
			set({ currentSong: null, isPlaying: false, queue: [], currentIndex: -1 });
			announceIdle();
			return;
		}
		const { queue } = get();
		const index = queue.findIndex((queuedSong) => queuedSong._id === song._id);
		set({
			currentSong: song,
			isPlaying: true,
			queue: index >= 0 ? queue : [song],
			currentIndex: index >= 0 ? index : 0,
		});
		announceSong(song);
	},

	togglePlay: () => {
		const { currentSong, isPlaying } = get();
		if (!currentSong) return;
		set({ isPlaying: !isPlaying });
		if (isPlaying) announceIdle();
		else announceSong(currentSong);
	},

	playNext: () => {
		const { queue, currentIndex } = get();
		const nextSong = queue[currentIndex + 1];
		if (!nextSong) {
			set({ isPlaying: false });
			announceIdle();
			return;
		}
		set({ currentSong: nextSong, currentIndex: currentIndex + 1, isPlaying: true });
		announceSong(nextSong);
	},

	playPrevious: () => {
		const { queue, currentIndex } = get();
		const previousSong = queue[currentIndex - 1];
		if (!previousSong) {
			set({ isPlaying: false });
			announceIdle();
			return;
		}
		set({ currentSong: previousSong, currentIndex: currentIndex - 1, isPlaying: true });
		announceSong(previousSong);
	},
}));
