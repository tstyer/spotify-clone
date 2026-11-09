import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import type { Album, AlbumWithSongs, Song, Stats } from "@/types";
import { usePlayerStore } from "./usePlayerStore";

interface MusicStore {
	songs: Song[];
	albums: Album[];
	isLoading: boolean;
	error: string | null;
	songsStatus: "idle" | "loading" | "success" | "error";
	songsError: string | null;
	albumsStatus: "idle" | "loading" | "success" | "error";
	albumsError: string | null;
	statsStatus: "idle" | "loading" | "success" | "error";
	statsError: string | null;
	currentAlbum: AlbumWithSongs | null;
	featuredSongs: Song[];
	madeForYouSongs: Song[];
	trendingSongs: Song[];
	stats: Stats;
	fetchAlbums: () => Promise<void>;
	fetchAlbumById: (id: string) => Promise<void>;
	fetchFeaturedSongs: () => Promise<void>;
	fetchMadeForYouSongs: () => Promise<void>;
	fetchTrendingSongs: () => Promise<void>;
	fetchStats: () => Promise<void>;
	fetchSongs: () => Promise<void>;
	deleteSong: (id: string) => Promise<boolean>;
	deleteAlbum: (id: string) => Promise<boolean>;
}

const errorMessage = (error: unknown, fallback: string) => {
	if (axios.isAxiosError<{ message?: string }>(error)) {
		return error.response?.data?.message ?? fallback;
	}
	return error instanceof Error ? error.message : fallback;
};

export const useMusicStore = create<MusicStore>((set, get) => {
	let pendingRequests = 0;
	let latestAlbumRequest = 0;
	const start = () => {
		pendingRequests++;
		set({ isLoading: true, error: null });
	};
	const finish = () => {
		pendingRequests--;
		set({ isLoading: pendingRequests > 0 });
	};

	return {
		songs: [],
		albums: [],
		isLoading: false,
		error: null,
		songsStatus: "idle",
		songsError: null,
		albumsStatus: "idle",
		albumsError: null,
		statsStatus: "idle",
		statsError: null,
		currentAlbum: null,
		featuredSongs: [],
		madeForYouSongs: [],
		trendingSongs: [],
		stats: { totalSongs: 0, totalAlbums: 0, totalUsers: 0, totalArtists: 0 },

		fetchAlbums: async () => {
			start();
			set({ albumsStatus: "loading", albumsError: null });
			try {
				const response = await axiosInstance.get<Album[]>("/albums");
				set({ albums: response.data, albumsStatus: "success" });
			} catch (error) {
				const message = errorMessage(error, "Unable to load albums");
				set({ error: message, albumsError: message, albumsStatus: "error" });
			} finally {
				finish();
			}
		},

		fetchAlbumById: async (id) => {
			const request = ++latestAlbumRequest;
			start();
			set({ currentAlbum: null });
			try {
				const response = await axiosInstance.get<AlbumWithSongs>(`/albums/${id}`);
				if (request === latestAlbumRequest) set({ currentAlbum: response.data });
			} catch (error) {
				if (request === latestAlbumRequest) set({ error: errorMessage(error, "Unable to load album") });
			} finally {
				finish();
			}
		},

		fetchFeaturedSongs: async () => {
			start();
			try {
				const response = await axiosInstance.get<Song[]>("/songs/featured");
				set({ featuredSongs: response.data });
			} catch (error) {
				set({ error: errorMessage(error, "Unable to load featured songs") });
			} finally {
				finish();
			}
		},

		fetchMadeForYouSongs: async () => {
			start();
			try {
				const response = await axiosInstance.get<Song[]>("/songs/made-for-you");
				set({ madeForYouSongs: response.data });
			} catch (error) {
				set({ error: errorMessage(error, "Unable to load made-for-you songs") });
			} finally {
				finish();
			}
		},

		fetchTrendingSongs: async () => {
			start();
			try {
				const response = await axiosInstance.get<Song[]>("/songs/trending");
				set({ trendingSongs: response.data });
			} catch (error) {
				set({ error: errorMessage(error, "Unable to load trending songs") });
			} finally {
				finish();
			}
		},

		fetchStats: async () => {
			start();
			set({ statsStatus: "loading", statsError: null });
			try {
				const response = await axiosInstance.get<Stats>("/stats");
				set({ stats: response.data, statsStatus: "success" });
			} catch (error) {
				const message = errorMessage(error, "Unable to load statistics");
				set({ error: message, statsError: message, statsStatus: "error" });
			} finally {
				finish();
			}
		},

		fetchSongs: async () => {
			start();
			set({ songsStatus: "loading", songsError: null });
			try {
				const response = await axiosInstance.get<Song[]>("/songs");
				set({ songs: response.data, songsStatus: "success" });
			} catch (error) {
				const message = errorMessage(error, "Unable to load songs");
				set({ error: message, songsError: message, songsStatus: "error" });
			} finally {
				finish();
			}
		},

		deleteSong: async (id) => {
			start();
			try {
				await axiosInstance.delete(`/admin/songs/${id}`);
				set((state) => ({
					songs: state.songs.filter((song) => song._id !== id),
					featuredSongs: state.featuredSongs.filter((song) => song._id !== id),
					madeForYouSongs: state.madeForYouSongs.filter((song) => song._id !== id),
					trendingSongs: state.trendingSongs.filter((song) => song._id !== id),
					albums: state.albums.map((album) => ({ ...album, songs: album.songs.filter((songId) => songId !== id) })),
					currentAlbum: state.currentAlbum && {
						...state.currentAlbum,
						songs: state.currentAlbum.songs.filter((song) => song._id !== id),
					},
				}));
				usePlayerStore.getState().removeSong(id);
				toast.success("Song deleted successfully");
				await get().fetchStats();
				return true;
			} catch (error) {
				const message = errorMessage(error, "Unable to delete song");
				set({ error: message });
				toast.error(message);
				return false;
			} finally {
				finish();
			}
		},

		deleteAlbum: async (id) => {
			start();
			try {
				await axiosInstance.delete(`/admin/albums/${id}`);
				set((state) => ({
					albums: state.albums.filter((album) => album._id !== id),
					currentAlbum: state.currentAlbum?._id === id ? null : state.currentAlbum,
					songs: state.songs.filter((song) => song.albumId !== id),
					featuredSongs: state.featuredSongs.filter((song) => song.albumId !== id),
					madeForYouSongs: state.madeForYouSongs.filter((song) => song.albumId !== id),
					trendingSongs: state.trendingSongs.filter((song) => song.albumId !== id),
				}));
				usePlayerStore.getState().removeAlbum(id);
				toast.success("Album deleted successfully");
				await get().fetchStats();
				return true;
			} catch (error) {
				const message = errorMessage(error, "Unable to delete album");
				set({ error: message });
				toast.error(message);
				return false;
			} finally {
				finish();
			}
		},
	};
});
