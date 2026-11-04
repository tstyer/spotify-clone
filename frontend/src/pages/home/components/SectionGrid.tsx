import type { Song } from "@/types";
import PlayButton from "./PlayButton";
import SectionGridSkeleton from "./SectionGridSkeleton";

interface SectionGridProps {
	title: string;
	songs: Song[];
	isLoading: boolean;
}

const SectionGrid = ({ title, songs, isLoading }: SectionGridProps) => {
	if (isLoading && songs.length === 0) return <SectionGridSkeleton />;

	return (
		<section aria-label={title} className="mb-8">
			<h2 className="mb-4 text-xl font-bold sm:text-2xl">{title}</h2>
			{songs.length === 0 ? (
				<p className="text-sm text-zinc-400">No songs yet.</p>
			) : (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{songs.map((song) => (
						<div key={song._id} className="group min-w-0 rounded-md bg-zinc-800/40 p-4 transition-colors hover:bg-zinc-700/40">
							<div className="relative mb-4">
								<div className="aspect-square overflow-hidden rounded-md shadow-lg">
									<img src={song.imageUrl} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
								</div>
								<PlayButton song={song} />
							</div>
							<h3 className="mb-1 truncate font-medium">{song.title}</h3>
							<p className="truncate text-sm text-zinc-400">{song.artist}</p>
						</div>
					))}
				</div>
			)}
		</section>
	);
};

export default SectionGrid;
