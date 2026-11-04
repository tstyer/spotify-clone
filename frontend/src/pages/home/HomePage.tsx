import { useEffect, useRef } from "react";
import Topbar from "@/components/Topbar";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import FeaturedSection from "./components/FeaturedSection";
import SectionGrid from "./components/SectionGrid";

const greeting = () => {
	const hour = new Date().getHours();
	if (hour < 12) return "Good morning";
	if (hour < 18) return "Good afternoon";
	return "Good evening";
};

const HomePage = () => {
	const requestedSongs = useRef(false);
	const featuredSongs = useMusicStore((state) => state.featuredSongs);
	const madeForYouSongs = useMusicStore((state) => state.madeForYouSongs);
	const trendingSongs = useMusicStore((state) => state.trendingSongs);
	const isLoading = useMusicStore((state) => state.isLoading);
	const fetchFeaturedSongs = useMusicStore((state) => state.fetchFeaturedSongs);
	const fetchMadeForYouSongs = useMusicStore((state) => state.fetchMadeForYouSongs);
	const fetchTrendingSongs = useMusicStore((state) => state.fetchTrendingSongs);
	const initializeQueue = usePlayerStore((state) => state.initializeQueue);

	useEffect(() => {
		if (requestedSongs.current) return;
		requestedSongs.current = true;
		void fetchFeaturedSongs();
		void fetchMadeForYouSongs();
		void fetchTrendingSongs();
	}, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs]);

	useEffect(() => {
		if (isLoading) return;
		const uniqueSongs = new Map(
			[...featuredSongs, ...madeForYouSongs, ...trendingSongs].map((song) => [song._id, song]),
		);
		if (uniqueSongs.size > 0) initializeQueue(Array.from(uniqueSongs.values()));
	}, [featuredSongs, madeForYouSongs, trendingSongs, isLoading, initializeQueue]);

	return (
		<main className="min-h-0 min-w-0 flex-1 overflow-y-auto bg-gradient-to-b from-zinc-800 to-zinc-900 text-white">
			<Topbar />
			<div className="mx-auto max-w-[1800px] p-4 sm:p-6">
				<h1 className="mb-6 text-2xl font-bold sm:text-3xl">{greeting()}</h1>
				<FeaturedSection />
				<SectionGrid title="Made For You" songs={madeForYouSongs} isLoading={isLoading} />
				<SectionGrid title="Trending" songs={trendingSongs} isLoading={isLoading} />
			</div>
		</main>
	);
};

export default HomePage;
