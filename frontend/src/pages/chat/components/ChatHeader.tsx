import { useChatStore } from "@/stores/useChatStore";

const ChatHeader = () => {
	const selectedUser = useChatStore((state) => state.selectedUser);
	const onlineUsers = useChatStore((state) => state.onlineUsers);

	if (!selectedUser) return null;

	const isOnline = onlineUsers.has(selectedUser.clerkId);

	return (
		<header className="flex items-center gap-3 border-b border-zinc-800 px-4 py-3">
			<img src={selectedUser.imageUrl} alt="" className="size-10 shrink-0 rounded-full object-cover" />
			<div className="min-w-0">
				<h2 className="truncate font-semibold">{selectedUser.fullName}</h2>
				<p className="flex items-center gap-1.5 text-xs text-zinc-400">
					<span aria-hidden="true" className={`size-2 rounded-full ${isOnline ? "bg-green-500" : "bg-zinc-500"}`} />
					{isOnline ? "Online" : "Offline"}
				</p>
			</div>
		</header>
	);
};

export default ChatHeader;
