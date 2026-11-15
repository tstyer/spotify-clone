import mongoose from "mongoose";
import { Album } from "../models/album.model.js";
import { Song } from "../models/song.model.js";

export const getAllAlbums = async (req, res, next) => {
	try {
		const albums = await Album.find();
		res.status(200).json(albums);
	} catch (error) {
		next(error);
	}
};

export const getAlbumById = async (req, res, next) => {
	try {
		const { albumId } = req.params;
		if (!mongoose.isValidObjectId(albumId)) {
			return res.status(400).json({ message: "Invalid album ID" });
		}
		const album = await Album.findById(albumId).populate({ path: "songs", model: Song });

		if (!album) {
			return res.status(404).json({ message: "Album not found" });
		}

		res.status(200).json(album);
	} catch (error) {
		next(error);
	}
};
