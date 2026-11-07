import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboard, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import SignInOAuthButtons from "./SignInOAuthButtons";

const Topbar = () => {
	const isAdmin = useAuthStore((state) => state.isAdmin);
	return (
	<header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b border-zinc-800 bg-zinc-900/90 px-4 text-white backdrop-blur-md">
		<Link to="/" className="flex shrink-0 items-center gap-2 font-semibold" aria-label="Spotify home">
			<img src="/spotify.png" alt="" className="size-8" />
			<span className="hidden sm:inline">Spotify</span>
		</Link>
		<div className="flex min-w-0 items-center">
			<SignedOut>
				<SignInOAuthButtons />
			</SignedOut>
			<SignedIn>
				{isAdmin && (
					<Link to="/admin" aria-label="Music Manager" className="mr-2 flex items-center gap-2 rounded-md px-2 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white sm:mr-4">
						<LayoutDashboard className="size-5" aria-hidden="true" />
						<span className="hidden lg:inline">Music Manager</span>
					</Link>
				)}
				<Link to="/chat" aria-label="Messages" className="mr-4 rounded-full p-2 text-zinc-300 hover:bg-zinc-800 hover:text-white md:hidden">
					<MessageCircle className="size-5" aria-hidden="true" />
				</Link>
				<UserButton />
			</SignedIn>
		</div>
	</header>
	);
};

export default Topbar;
