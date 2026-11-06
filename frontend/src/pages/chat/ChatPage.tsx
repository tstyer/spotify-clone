import { useAuth } from "@clerk/clerk-react";
import { MessageCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import Topbar from "@/components/Topbar";
import { useChatStore } from "@/stores/useChatStore";
import UsersList from "./components/UsersList";
import MessageInput from "./components/MessageInput";

const formatTime = (date: string) => new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const ChatPage = () => {
	const { userId } = useAuth();
	const fetchedFor = useRef<string | null>(null);
	const bottomRef = useRef<HTMLDivElement>(null);
	const fetchUsers = useChatStore((state) => state.fetchUsers);
	const fetchMessages = useChatStore((state) => state.fetchMessages);
	const selectedUser = useChatStore((state) => state.selectedUser);
	const messages = useChatStore((state) => state.messages);
	const isLoading = useChatStore((state) => state.isLoading);
	const error = useChatStore((state) => state.error);

	useEffect(() => {
		if (!userId) {
			fetchedFor.current = null;
			return;
		}
		if (fetchedFor.current === userId) return;
		fetchedFor.current = userId;
		void fetchUsers();
	}, [userId, fetchUsers]);

	useEffect(() => {
		if (userId && selectedUser) void fetchMessages(selectedUser.clerkId);
	}, [userId, selectedUser, fetchMessages]);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	return (
		<main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-gradient-to-b from-zinc-800 to-zinc-900 text-white">
			<Topbar />
			{!userId ? (
				<div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
					<MessageCircle className="size-10 text-green-400" aria-hidden="true" />
					<h1 className="text-xl font-semibold">Messages</h1>
					<p className="text-sm text-zinc-300">Sign in to see your conversations.</p>
				</div>
			) : (
				<div className="flex min-h-0 flex-1">
					<UsersList />
					<section aria-label="Messages" className="flex min-w-0 flex-1 flex-col">
						{selectedUser ? (
							<>
								<header className="flex items-center gap-3 border-b border-zinc-800 px-4 py-3">
									<img src={selectedUser.imageUrl} alt="" className="size-9 rounded-full object-cover" />
									<h2 className="truncate font-semibold">{selectedUser.fullName}</h2>
								</header>
								<div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4" aria-live="polite">
									{isLoading && messages.length === 0 ? (
										<p role="status" className="text-sm text-zinc-400">Loading messages...</p>
									) : error && messages.length === 0 ? (
										<p role="alert" className="text-sm text-red-400">{error}</p>
									) : messages.length === 0 ? (
										<p className="text-sm text-zinc-400">No messages in this conversation yet.</p>
									) : messages.map((message) => {
										const isMine = message.senderId === userId;
										return (
											<div key={message._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
												<div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm sm:max-w-[70%] ${isMine ? "bg-green-600 text-white" : "bg-zinc-800"}`}>
													<p className="break-words whitespace-pre-wrap">{message.content}</p>
													<time dateTime={message.createdAt} className="mt-1 block text-right text-xs text-white/70">{formatTime(message.createdAt)}</time>
												</div>
											</div>
										);
									})}
									<div ref={bottomRef} />
								</div>
								<MessageInput key={selectedUser.clerkId} />
							</>
						) : (
							<div className="flex flex-1 flex-col items-center justify-center gap-3 p-4 text-center text-zinc-400">
								<MessageCircle className="size-10" aria-hidden="true" />
								<p>Choose a listener to see your conversation.</p>
							</div>
						)}
					</section>
				</div>
			)}
		</main>
	);
};

export default ChatPage;
