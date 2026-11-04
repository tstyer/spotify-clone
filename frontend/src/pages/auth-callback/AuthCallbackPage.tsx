import { useUser } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "@/lib/axios";

const AuthCallbackPage = () => {
	const { isLoaded, user } = useUser();
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);
	const [retryCount, setRetryCount] = useState(0);

	useEffect(() => {
		if (!isLoaded) return;
		if (!user) {
			navigate("/", { replace: true });
			return;
		}
		const controller = new AbortController();

		const syncUser = async () => {
			try {
				await axiosInstance.post("/auth/callback", {
					id: user.id,
					firstName: user.firstName,
					lastName: user.lastName,
					imageUrl: user.imageUrl,
				}, { signal: controller.signal });
				if (!controller.signal.aborted) navigate("/", { replace: true });
			} catch {
				if (!controller.signal.aborted) setError("Your profile could not be saved. Please try again.");
			}
		};

		void syncUser();
		return () => controller.abort();
	}, [isLoaded, user, navigate, retryCount]);

	return (
		<main className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
			<div className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 p-8 text-center">
				{error ? (
					<>
						<h1 className="text-xl font-bold">Could not finish signing in</h1>
						<p role="alert" className="mt-3 text-sm text-zinc-400">{error}</p>
						<button
							type="button"
							className="mt-6 rounded-full bg-emerald-500 px-5 py-2 font-semibold text-black hover:bg-emerald-400"
							onClick={() => {
								setError(null);
								setRetryCount((count) => count + 1);
							}}
						>
							Try again
						</button>
					</>
				) : (
					<>
						<Loader aria-hidden="true" className="mx-auto size-6 animate-spin text-emerald-500" />
						<h1 className="mt-4 text-xl font-bold">Logging you in</h1>
						<p className="mt-2 text-sm text-zinc-400">Saving your profile...</p>
					</>
				)}
			</div>
		</main>
	);
};

export default AuthCallbackPage;
