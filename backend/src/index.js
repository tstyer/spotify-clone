import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "node:http";
import { clerkMiddleware } from "@clerk/express";
import { connectDB } from "./lib/db.js";
import { initializeSocket } from "./lib/socket.js";
import { serveFrontend } from "./lib/frontend.js";
import albumRoutes from "./routes/album.route.js";
import songRoutes from "./routes/song.route.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import statRoutes from "./routes/stat.route.js";
import { scheduleTempFileCleanup } from "./lib/uploads.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);
initializeSocket(httpServer);

app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
);
app.use(express.json());

if (process.env.CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY) {
	app.use(clerkMiddleware());
}

app.use("/api/albums", albumRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stats", statRoutes);
app.use("/api", (req, res) => res.status(404).json({ message: "API route not found" }));

if (process.env.NODE_ENV === "production" && !serveFrontend(app)) {
	console.warn("Frontend build not found; serving API only");
}

app.use((err, req, res, next) => {
	res.status(500).json({ message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message });
});

httpServer.listen(PORT, () => {
	console.log("Server is running on port " + PORT);
	scheduleTempFileCleanup();
	connectDB();
});
