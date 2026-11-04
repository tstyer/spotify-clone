import { useAuth } from "@clerk/clerk-react";
import { Headphones, Music2, Users } from "lucide-react";
import { useEffect, useRef } from "react";
import { useChatStore } from "@/stores/useChatStore";

const FriendsActivity = () => {
	const { userId } = useAuth();
	const fetchedFor = useRef<string | null>(null);
	const users = useChatStore((state) => state.users);
	const isLoading = useChatStore((state) => state.isLoading);
	const onlineUsers = useChatStore((state) => state.onlineUsers);
	const userActivities = useChatStore((state) => state.userActivities);
	const fetchUsers = useChatStore((state) => state.fetchUsers);

	useEffect(() => {
		if (!userId) {
			fetchedFor.current = null;
			return;
		}
		if (fetchedFor.current === userId) return;
		fetchedFor.current = userId;
		void fetchUsers();
	}, [userId, fetchUsers]);

	return (
		<section aria-labelledby="friends-activity-heading" className="flex h-full min-h-0 flex-col rounded-lg bg-zinc-900 text-white">
			<div className="flex items-center gap-2 border-b border-zinc-800 p-4">
				<Users className="size-5 shrink-0" aria-hidden="true" />
				<h2 id="friends-activity-heading" className="font-semibold">What they're listening to</h2>
			</div>

			{!userId ? (
				<div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
					<div className="rounded-full bg-zinc-800 p-4">
						<Headphones className="size-8 text-emerald-400" aria-hidden="true" />
					</div>
					<h3 className="font-semibold">See what others are playing</h3>
					<p className="text-sm text-zinc-400">Sign in to see other listeners and their music.</p>
				</div>
			) : (
				<div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
					{isLoading && users.length === 0 ? (
						<p role="status" className="p-2 text-sm text-zinc-400">Loading listeners...</p>
					) : users.length === 0 ? (
						<p className="p-2 text-sm text-zinc-400">No other listeners yet.</p>
					) : (
						users.map((user) => {
							const isOnline = onlineUsers.has(user.clerkId);
							const activity = isOnline ? userActivities.get(user.clerkId) : null;
							const isPlaying = Boolean(activity && activity !== "Idle");
							const status = isOnline ? (activity || "Idle") : "Offline";

							return (
							<div key={user._id} className="flex items-start gap-3 rounded-md p-2 hover:bg-zinc-800/50">
								<div className="relative shrink-0">
									<img src={user.imageUrl} alt="" className="size-10 rounded-full border border-zinc-700 object-cover" />
									<span aria-hidden="true" className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-zinc-900 ${isOnline ? "bg-green-500" : "bg-zinc-500"}`} />
								</div>
								<div className="min-w-0 flex-1">
									<div className="flex items-center gap-2">
										<p className="truncate text-sm font-medium">{user.fullName}</p>
										{isPlaying && <Music2 className="size-4 shrink-0 text-emerald-400" aria-hidden="true" />}
									</div>
									<p className={`truncate text-xs ${isPlaying ? "text-zinc-200" : "text-zinc-400"}`}>{status}</p>
								</div>
							</div>
							);
						})
					)}
				</div>
			)}
		</section>
	);
};

export default FriendsActivity;
