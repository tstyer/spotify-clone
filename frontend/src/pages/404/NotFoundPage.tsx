import { Home, Music2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const NotFoundPage = () => {
	const navigate = useNavigate();

	const goBack = () => {
		if (window.history.length > 1) navigate(-1);
		else navigate("/");
	};

	return (
		<main className="flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-y-auto rounded bg-gradient-to-b from-zinc-800 to-zinc-900 px-4 py-10 text-white">
			<div className="max-w-md space-y-6 text-center">
				<Music2 aria-hidden="true" className="mx-auto h-20 w-20 text-emerald-500" />
				<div className="space-y-3">
					<h1 className="text-6xl font-bold">404</h1>
					<h2 className="text-2xl font-semibold">Page not found</h2>
					<p className="text-zinc-400">Looks like this track got lost in the shuffle. Let&apos;s get you back to the music.</p>
				</div>
				<div className="flex flex-col justify-center gap-3 sm:flex-row">
					<button
						type="button"
						onClick={goBack}
						className="rounded-full border border-zinc-600 bg-zinc-800 px-6 py-3 font-semibold hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
					>
						Go Back
					</button>
					<Link
						to="/"
						className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3 font-semibold text-black hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
					>
						<Home aria-hidden="true" className="h-4 w-4" />
						Back to Home
					</Link>
				</div>
			</div>
		</main>
	);
};

export default NotFoundPage;
