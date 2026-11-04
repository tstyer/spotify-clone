import FeaturedGridSkeleton from "@/components/skeletons/FeaturedGridSkeleton";
import { useMusicStore } from "@/stores/useMusicStore";
import PlayButton from "./PlayButton";

const FeaturedSection = () => {
	const featuredSongs = useMusicStore((state) => state.featuredSongs);
	const isLoading = useMusicStore((state) => state.isLoading);
	const error = useMusicStore((state) => state.error);

	if (isLoading && featuredSongs.length === 0) return <FeaturedGridSkeleton />;
	if (error && featuredSongs.length === 0) return <p role="alert" className="mb-8 text-red-400">{error}</p>;
	if (featuredSongs.length === 0) return <p className="mb-8 text-sm text-zinc-400">No featured songs yet.</p>;

	return (
		<section aria-label="Featured songs" className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{featuredSongs.map((song) => (
				<div key={song._id} className="group relative flex items-center overflow-hidden rounded-md bg-zinc-800/50 transition-colors hover:bg-zinc-700/50">
					<img src={song.imageUrl} alt="" className="h-16 w-16 shrink-0 object-cover sm:h-20 sm:w-20" />
					<div className="min-w-0 flex-1 p-4 pr-14">
						<p className="truncate font-medium">{song.title}</p>
						<p className="truncate text-sm text-zinc-400">{song.artist}</p>
					</div>
					<PlayButton song={song} />
				</div>
			))}
		</section>
	);
};

export default FeaturedSection;
