import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";

const Topbar = () => (
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
				<UserButton />
			</SignedIn>
		</div>
	</header>
);

export default Topbar;
