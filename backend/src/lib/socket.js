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
	io.on("connection", (socket) => {
		const userId = socket.data.userId;
		const sockets = userSockets.get(userId) ?? new Set();
		const wasOnline = sockets.size > 0;
		sockets.add(socket.id);
		userSockets.set(userId, sockets);

		socket.emit("users_online", Array.from(userSockets.keys()));
		if (!wasOnline) io.emit("user_connected", userId);

		socket.on("disconnect", () => {
			sockets.delete(socket.id);
			if (sockets.size === 0) {
				userSockets.delete(userId);
				io.emit("user_disconnected", userId);
			}
		});
	});

	return io;
};
