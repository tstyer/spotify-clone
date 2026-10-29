import mongoose from "mongoose";
import { Album } from "../models/album.model.js";
import { Song } from "../models/song.model.js";
import { uploadToCloudinary } from "../lib/cloudinary.js";

export const checkAdmin = async (req, res, next) => {
	res.status(200).json({ admin: true });
};

export const createSong = async (req, res, next) => {
	try {
		const audioFile = req.files?.audioFile;
		const imageFile = req.files?.imageFile;
		if (!audioFile || !imageFile || Array.isArray(audioFile) || Array.isArray(imageFile)) {
			return res.status(400).json({ message: "Please upload one audio file and one image file" });
		}
		if (!audioFile.mimetype?.startsWith("audio/") || !imageFile.mimetype?.startsWith("image/")) {
			return res.status(400).json({ message: "Files must be audio and image" });
		}

		const { title, artist, albumId } = req.body;
		const duration = Number(req.body.duration);
		if (
			typeof title !== "string" || !title.trim() ||
			typeof artist !== "string" || !artist.trim() ||
			req.body.duration === "" ||
			!Number.isFinite(duration) || duration < 0
		) {
			return res.status(400).json({ message: "Title, artist, and a valid duration are required" });
		}

		if (albumId) {
			if (typeof albumId !== "string" || !mongoose.isValidObjectId(albumId)) {
				return res.status(400).json({ message: "Invalid album ID" });
			}
			if (!(await Album.exists({ _id: albumId }))) {
				return res.status(404).json({ message: "Album not found" });
			}
		}

		const audioUrl = await uploadToCloudinary(audioFile);
		const imageUrl = await uploadToCloudinary(imageFile);
		const song = new Song({
			title: title.trim(),
			artist: artist.trim(),
			audioUrl,
			imageUrl,
			duration,
			albumId: albumId || null,
		});
		await song.save();

		if (albumId) {
			await Album.findByIdAndUpdate(albumId, { $addToSet: { songs: song._id } });
		}
		res.status(201).json(song);
	} catch (error) {
		next(error);
	}
};

export const deleteSong = async (req, res, next) => {
	try {
		const { id } = req.params;
		if (!mongoose.isValidObjectId(id)) {
			return res.status(400).json({ message: "Invalid song ID" });
		}

		const song = await Song.findById(id);
		if (!song) {
			return res.status(404).json({ message: "Song not found" });
		}

		if (song.albumId) {
			await Album.findByIdAndUpdate(song.albumId, { $pull: { songs: song._id } });
		}
		await Song.findByIdAndDelete(id);

		res.status(200).json({ message: "Song deleted successfully" });
	} catch (error) {
		next(error);
	}
};

export const createAlbum = async (req, res, next) => {
	try {
		const imageFile = req.files?.imageFile;
		if (!imageFile || Array.isArray(imageFile) || !imageFile.mimetype?.startsWith("image/")) {
			return res.status(400).json({ message: "Please upload one album image" });
		}

		const { title, artist } = req.body;
		const releaseYear = Number(req.body.releaseYear);
		if (
			typeof title !== "string" || !title.trim() ||
			typeof artist !== "string" || !artist.trim() ||
			req.body.releaseYear === "" ||
			!Number.isInteger(releaseYear) || releaseYear < 1900 || releaseYear > new Date().getFullYear()
		) {
			return res.status(400).json({ message: "Title, artist, and a valid release year are required" });
		}

		const imageUrl = await uploadToCloudinary(imageFile);
		const album = new Album({
			title: title.trim(),
			artist: artist.trim(),
			imageUrl,
			releaseYear,
		});
		await album.save();

		res.status(201).json(album);
	} catch (error) {
		next(error);
	}
};
