import { verifyToken } from "@clerk/express";
import { Server } from "socket.io";

export const initializeSocket = (httpServer, verifySessionToken = verifyToken) => {
	const io = new Server(httpServer, {
		cors: {
			origin: "http://localhost:3000",
			credentials: true,
		},
	});

	io.use(async (socket, next) => {
		const token = socket.handshake.auth?.token;
		if (typeof token !== "string" || !token || !process.env.CLERK_SECRET_KEY) {
			return next(new Error("Unauthorized"));
		}

		try {
			const claims = await verifySessionToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
			if (!claims?.sub) return next(new Error("Unauthorized"));
			socket.data.userId = claims.sub;
			next();
		} catch {
			next(new Error("Unauthorized"));
		}
	});

	const userSockets = new Map();
	const userActivities = new Map();
	io.on("connection", (socket) => {
		const userId = socket.data.userId;
		const sockets = userSockets.get(userId) ?? new Set();
		const wasOnline = sockets.size > 0;
		sockets.add(socket.id);
		userSockets.set(userId, sockets);

		socket.emit("users_online", Array.from(userSockets.keys()));
		if (!wasOnline) io.emit("user_connected", userId);
		if (!wasOnline) {
			userActivities.set(userId, "Idle");
			io.emit("activities", Array.from(userActivities.entries()));
		} else {
			socket.emit("activities", Array.from(userActivities.entries()));
		}

		socket.on("update_activity", (data) => {
			const activity = data?.activity;
			if (typeof activity !== "string" || !activity.trim() || activity.length > 500) return;

			const currentActivity = activity.trim();
			userActivities.set(userId, currentActivity);
			io.emit("activity_updated", { userId, activity: currentActivity });
		});

		socket.on("disconnect", () => {
			sockets.delete(socket.id);
			if (sockets.size === 0) {
				userSockets.delete(userId);
				userActivities.delete(userId);
				io.emit("user_disconnected", userId);
				io.emit("activities", Array.from(userActivities.entries()));
			}
		});
	});

	return io;
};
