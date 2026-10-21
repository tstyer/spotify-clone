import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import albumRoutes from "./routes/album.route.js";
import songRoutes from "./routes/song.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
);
app.use(express.json());

app.use("/api/albums", albumRoutes);
app.use("/api/songs", songRoutes);

app.use((err, req, res, next) => {
	res.status(500).json({ message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message });
});

app.listen(PORT, () => {
	console.log("Server is running on port " + PORT);
	connectDB();
});
