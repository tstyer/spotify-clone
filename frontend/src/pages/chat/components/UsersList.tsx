import UsersListSkeleton from "@/components/skeletons/UsersListSkeleton";
import { useChatStore } from "@/stores/useChatStore";

const UsersList = () => {
	const users = useChatStore((state) => state.users);
	const selectedUser = useChatStore((state) => state.selectedUser);
	const onlineUsers = useChatStore((state) => state.onlineUsers);
	const isLoading = useChatStore((state) => state.isLoading);
	const error = useChatStore((state) => state.error);
	const fetchUsers = useChatStore((state) => state.fetchUsers);
	const setSelectedUser = useChatStore((state) => state.setSelectedUser);

	return (
		<aside aria-label="Conversations" className="flex w-20 shrink-0 flex-col border-r border-zinc-800 sm:w-64">
			<h1 className="border-b border-zinc-800 px-3 py-4 text-center text-sm font-semibold sm:text-left sm:text-lg">Chats</h1>
			<div className="min-h-0 flex-1 space-y-1 overflow-y-auto p-2">
				{isLoading && users.length === 0 ? (
					<UsersListSkeleton />
				) : users.length === 0 ? (
					<div className="text-center text-xs text-zinc-400 sm:text-left">
						<p>{error ?? "No other listeners yet."}</p>
						{error && <button type="button" onClick={() => void fetchUsers()} className="mt-2 text-green-400 hover:underline">Try again</button>}
					</div>
				) : users.map((user) => {
					const isOnline = onlineUsers.has(user.clerkId);
					const isSelected = selectedUser?.clerkId === user.clerkId;
					return (
						<button
							key={user._id}
								type="button"
								onClick={() => setSelectedUser(user)}
								aria-label={`Open conversation with ${user.fullName}${isOnline ? ", online" : ", offline"}`}
								aria-current={isSelected ? "true" : undefined}
								className={`flex w-full items-center justify-center gap-3 rounded-md p-2 text-left hover:bg-zinc-800 sm:justify-start ${isSelected ? "bg-zinc-800" : ""}`}
							>
								<span className="relative shrink-0">
									<img src={user.imageUrl} alt="" className="size-10 rounded-full object-cover" />
									<span aria-hidden="true" className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-zinc-900 ${isOnline ? "bg-green-500" : "bg-zinc-500"}`} />
								</span>
								<span className="hidden min-w-0 sm:block"><span className="block truncate text-sm font-medium">{user.fullName}</span><span className="text-xs text-zinc-400">{isOnline ? "Online" : "Offline"}</span></span>
							</button>
						);
				})}
			</div>
		</aside>
	);
};

export default UsersList;
