import mongoose from "mongoose";
import { config } from "dotenv";
import { Album } from "../models/album.model.js";
import { Song } from "../models/song.model.js";

config();

const albums = [
	{ title: "Urban Nights", imageUrl: "/albums/1.jpg", audioUrls: [7, 5, 15, 13] },
	{ title: "Coastal Dreaming", imageUrl: "/albums/2.jpg", audioUrls: [4, 9, 16, 10] },
	{ title: "Midnight Sessions", imageUrl: "/albums/3.jpg", audioUrls: [1, 2, 14] },
	{ title: "Eastern Dreams", imageUrl: "/albums/4.jpg", audioUrls: [3, 17, 12] },
].map((album) => ({
	...album,
	audioUrls: album.audioUrls.map((number) => `/songs/${number}.mp3`),
}));

const seedAlbums = async () => {
	try {
		if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required in backend/.env");
		await mongoose.connect(process.env.MONGODB_URI);

		const audioUrls = albums.flatMap((album) => album.audioUrls);
		const songs = await Song.find({ audioUrl: { $in: audioUrls } });
		const songsByUrl = new Map(songs.map((song) => [song.audioUrl, song]));
		const missing = audioUrls.filter((audioUrl) => !songsByUrl.has(audioUrl));
		if (missing.length) {
			throw new Error(`Run npm run seed:songs first. Missing: ${missing.join(", ")}`);
		}
		if (songsByUrl.size !== songs.length) {
			throw new Error("Duplicate sample songs found. Resolve duplicate audio URLs before seeding albums.");
		}

		const existingAlbums = await Album.find({ imageUrl: { $in: albums.map((album) => album.imageUrl) } });
		const existingByImage = new Map(existingAlbums.map((album) => [album.imageUrl, album]));
		if (existingByImage.size !== existingAlbums.length) {
			throw new Error("Duplicate sample albums found. Resolve duplicate cover URLs before seeding albums.");
		}

		for (const album of albums) {
			const existing = existingByImage.get(album.imageUrl);
			for (const audioUrl of album.audioUrls) {
				const song = songsByUrl.get(audioUrl);
				if (song.albumId && (!existing || !song.albumId.equals(existing._id))) {
					throw new Error(`${audioUrl} already belongs to another album. No changes were made.`);
				}
			}
		}

		let added = 0;
		for (const album of albums) {
			let document = existingByImage.get(album.imageUrl);
			if (!document) {
				document = await Album.create({
					title: album.title,
					artist: "Various Artists",
					imageUrl: album.imageUrl,
					releaseYear: 2024,
					songs: [],
				});
				added++;
			}

			const albumSongs = album.audioUrls.map((audioUrl) => songsByUrl.get(audioUrl));
			const songIds = albumSongs.map((song) => song._id);
			await Song.updateMany({ _id: { $in: songIds } }, { $set: { albumId: document._id } });
			await Album.updateOne({ _id: document._id }, { $addToSet: { songs: { $each: songIds } } });
		}

		console.log(`Added ${added} sample albums and linked ${audioUrls.length} songs; existing albums were kept.`);
	} catch (error) {
		console.error("Error seeding albums:", error);
		process.exitCode = 1;
	} finally {
		await mongoose.disconnect();
	}
};

seedAlbums();
