import { UserButton } from "@clerk/clerk-react";
import { Disc3, ListMusic, Users, Mic2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMusicStore } from "@/stores/useMusicStore";

const AdminPage = () => {
	const isAdmin = useAuthStore((state) => state.isAdmin);
	const authError = useAuthStore((state) => state.error);
	const authLoading = useAuthStore((state) => state.isLoading);
	const checkAdminStatus = useAuthStore((state) => state.checkAdminStatus);
	const stats = useMusicStore((state) => state.stats);
	const statsLoading = useMusicStore((state) => state.isLoading);
	const statsError = useMusicStore((state) => state.error);
	const fetchStats = useMusicStore((state) => state.fetchStats);
	const requestedStats = useRef(false);
	const [statsLoaded, setStatsLoaded] = useState(false);
	const accessCheckFailed = Boolean(authError && !authError.startsWith("Unauthorized"));

	useEffect(() => {
		if (!isAdmin || requestedStats.current) return;
		requestedStats.current = true;
		void fetchStats().then(() => setStatsLoaded(true));
	}, [isAdmin, fetchStats]);

	const retryStats = () => {
		setStatsLoaded(false);
		void fetchStats().then(() => setStatsLoaded(true));
	};

	const cards = [
		{ label: "Total Songs", value: stats.totalSongs, icon: ListMusic, color: "text-emerald-400 bg-emerald-500/10" },
		{ label: "Total Albums", value: stats.totalAlbums, icon: Disc3, color: "text-violet-400 bg-violet-500/10" },
		{ label: "Total Artists", value: stats.totalArtists, icon: Mic2, color: "text-orange-400 bg-orange-500/10" },
		{ label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-sky-400 bg-sky-500/10" },
	];

	return (
		<main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black p-4 text-white sm:p-8">
			<div className="mx-auto max-w-6xl">
				<header className="mb-8 flex items-start justify-between gap-4">
					<div className="flex items-center gap-3">
						<Link to="/" aria-label="Back to Spotify home" className="shrink-0 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-500">
							<img src="/spotify.png" alt="" className="size-10" />
						</Link>
						<div>
							<h1 className="text-2xl font-bold sm:text-3xl">Music Manager</h1>
							<p className="text-sm text-zinc-400">Manage your music catalog</p>
						</div>
					</div>
					<UserButton />
				</header>

				{authLoading ? (
					<p role="status" className="text-zinc-300">Checking admin access...</p>
				) : !isAdmin ? (
					<section role="alert" className="rounded-lg border border-zinc-700 bg-zinc-800/60 p-6">
						<h2 className="text-xl font-semibold">Music Manager is unavailable</h2>
						<p className="mt-2 text-zinc-300">{accessCheckFailed ? "Admin access could not be verified." : "This page is for the admin account."}</p>
						<div className="mt-4 flex gap-4 text-sm">
							{accessCheckFailed && <button type="button" onClick={() => void checkAdminStatus()} className="text-green-400 hover:underline">Try again</button>}
							<Link to="/" className="text-green-400 hover:underline">Back to home</Link>
						</div>
					</section>
				) : (
					<section aria-label="Catalog overview">
						<h2 className="mb-4 text-xl font-semibold">Overview</h2>
						{statsLoading || !statsLoaded ? (
							<p role="status" className="text-zinc-300">Loading catalog totals...</p>
						) : statsError ? (
							<div role="alert" className="rounded-lg border border-zinc-700 bg-zinc-800/60 p-5">
								<p>{statsError}</p>
								<button type="button" onClick={retryStats} className="mt-3 text-sm text-green-400 hover:underline">Try again</button>
							</div>
						) : (
							<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
								{cards.map(({ label, value, icon: Icon, color }) => (
									<div key={label} className="flex items-center gap-4 rounded-lg border border-zinc-700/50 bg-zinc-800/50 p-5">
										<div className={`rounded-lg p-3 ${color}`}><Icon className="size-6" aria-hidden="true" /></div>
										<div><p className="text-sm text-zinc-400">{label}</p><p className="text-2xl font-bold">{value.toLocaleString()}</p></div>
									</div>
								))}
							</div>
						)}
					</section>
				)}
			</div>
		</main>
	);
};

export default AdminPage;
