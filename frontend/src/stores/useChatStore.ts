import axios from "axios";
import { io, type Socket } from "socket.io-client";
import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import type { Message, User } from "@/types";

type GetToken = () => Promise<string | null>;

interface ChatStore {
	users: User[];
	isLoading: boolean;
	error: string | null;
	socket: Socket;
	isConnected: boolean;
	onlineUsers: Set<string>;
	userActivities: Map<string, string>;
	messages: Message[];
	selectedUser: User | null;
	fetchUsers: () => Promise<void>;
	fetchMessages: (userId: string) => Promise<void>;
	setSelectedUser: (user: User | null) => void;
	initSocket: (userId: string, getToken: GetToken) => Promise<void>;
	disconnectSocket: () => void;
	sendMessage: (receiverId: string, content: string) => boolean;
	updateActivity: (activity: string) => void;
}

const baseURL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";
const socket = io(baseURL, { autoConnect: false, withCredentials: true });

const errorMessage = (error: unknown, fallback: string) => {
	if (axios.isAxiosError<{ message?: string }>(error)) {
		return error.response?.data?.message ?? fallback;
	}
	return error instanceof Error ? error.message : fallback;
};

const mergeMessages = (existing: Message[], incoming: Message[]) => {
	const byId = new Map(existing.map((message) => [message._id, message]));
	for (const message of incoming) byId.set(message._id, message);
	return Array.from(byId.values()).sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
};

let activeUserId: string | null = null;
let connectionGeneration = 0;
let latestMessageRequest = 0;
let pendingRequests = 0;

export const useChatStore = create<ChatStore>((set, get) => {
	const start = () => {
		pendingRequests++;
		set({ isLoading: true, error: null });
	};
	const finish = () => {
		pendingRequests--;
		set({ isLoading: pendingRequests > 0 });
	};

	return {
		users: [],
		isLoading: false,
		error: null,
		socket,
		isConnected: false,
		onlineUsers: new Set(),
		userActivities: new Map(),
		messages: [],
		selectedUser: null,

		fetchUsers: async () => {
			const generation = connectionGeneration;
			start();
			try {
				const response = await axiosInstance.get<User[]>("/users");
				if (generation === connectionGeneration) set({ users: response.data });
			} catch (error) {
				if (generation === connectionGeneration) set({ error: errorMessage(error, "Unable to load users") });
			} finally {
				finish();
			}
		},

		fetchMessages: async (userId) => {
			const request = ++latestMessageRequest;
			const generation = connectionGeneration;
			start();
			try {
				const response = await axiosInstance.get<Message[]>(`/users/messages/${encodeURIComponent(userId)}`);
				if (request === latestMessageRequest && generation === connectionGeneration && get().selectedUser?.clerkId === userId) {
					set((state) => ({ messages: mergeMessages(response.data, state.messages) }));
				}
			} catch (error) {
				if (request === latestMessageRequest && generation === connectionGeneration) {
					set({ error: errorMessage(error, "Unable to load messages") });
				}
			} finally {
				finish();
			}
		},

		setSelectedUser: (user) => {
			if (get().selectedUser?.clerkId === user?.clerkId) return;
			latestMessageRequest++;
			set({ selectedUser: user, messages: [], error: null });
		},

		initSocket: async (userId, getToken) => {
			if (activeUserId === userId && (socket.connected || socket.active)) return;
			const generation = ++connectionGeneration;
			socket.disconnect();
			activeUserId = userId;
			set({ isConnected: false, onlineUsers: new Set(), userActivities: new Map(), error: null });

			let token: string | null = null;
			try {
				token = await getToken();
			} catch {
				// Clerk can fail to provide a token while its session is changing.
			}
			if (generation !== connectionGeneration) return;
			if (!token) {
				activeUserId = null;
				set({ error: "Unable to authenticate the chat connection" });
				return;
			}

			socket.auth = (callback) => {
				void getToken()
					.then((freshToken) => callback(generation === connectionGeneration && freshToken ? { token: freshToken } : {}))
					.catch(() => callback({}));
			};
			socket.connect();
		},

		disconnectSocket: () => {
			connectionGeneration++;
			latestMessageRequest++;
			activeUserId = null;
			socket.disconnect();
			socket.auth = {};
			set({
				users: [],
				isConnected: false,
				onlineUsers: new Set(),
				userActivities: new Map(),
				messages: [],
				selectedUser: null,
				error: null,
			});
		},

		sendMessage: (receiverId, content) => {
			const trimmed = content.trim();
			if (!socket.connected || !trimmed || trimmed.length > 5000 || receiverId === activeUserId) {
				set({ error: "Unable to send message" });
				return false;
			}
			socket.emit("send_message", { receiverId, content: trimmed });
			return true;
		},

		updateActivity: (activity) => {
			if (socket.connected && activity.trim()) socket.emit("update_activity", { activity: activity.trim() });
		},
	};
});

socket.on("connect", () => useChatStore.setState({ isConnected: true, error: null }));
socket.on("connect_error", () => useChatStore.setState({ isConnected: false, error: "Unable to connect to chat" }));
socket.on("disconnect", () => useChatStore.setState({ isConnected: false, onlineUsers: new Set(), userActivities: new Map() }));
socket.on("users_online", (users: string[]) => useChatStore.setState({ onlineUsers: new Set(users) }));
socket.on("activities", (activities: [string, string][]) => useChatStore.setState({ userActivities: new Map(activities) }));
socket.on("user_connected", (userId: string) => {
	useChatStore.setState((state) => ({ onlineUsers: new Set(state.onlineUsers).add(userId) }));
});
socket.on("user_disconnected", (userId: string) => {
	useChatStore.setState((state) => {
		const onlineUsers = new Set(state.onlineUsers);
		const userActivities = new Map(state.userActivities);
		onlineUsers.delete(userId);
		userActivities.delete(userId);
		return { onlineUsers, userActivities };
	});
});
socket.on("activity_updated", ({ userId, activity }: { userId: string; activity: string }) => {
	useChatStore.setState((state) => ({ userActivities: new Map(state.userActivities).set(userId, activity) }));
});

const addConversationMessage = (message: Message) => {
	const { selectedUser } = useChatStore.getState();
	if (!selectedUser || !activeUserId) return;
	const peerId = message.senderId === activeUserId ? message.receiverId : message.senderId;
	if (peerId !== selectedUser.clerkId) return;
	useChatStore.setState((state) => ({ messages: mergeMessages(state.messages, [message]) }));
};
socket.on("receive_message", addConversationMessage);
socket.on("message_sent", addConversationMessage);
socket.on("message_error", (message: string) => useChatStore.setState({ error: message }));
