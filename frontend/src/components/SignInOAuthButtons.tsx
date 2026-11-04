import { useSignIn } from "@clerk/clerk-react";
import { useState } from "react";

const SignInOAuthButtons = () => {
	const { signIn, isLoaded } = useSignIn();
	const [isRedirecting, setIsRedirecting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	if (!isLoaded) return null;

	const signInWithGoogle = async () => {
		setError(null);
		setIsRedirecting(true);
		try {
			await signIn.authenticateWithRedirect({
				strategy: "oauth_google",
				redirectUrl: "/sso-callback",
				redirectUrlComplete: "/auth-callback",
			});
		} catch {
			setError("Google sign-in could not start. Please try again.");
			setIsRedirecting(false);
		}
	};

	return (
		<div className="w-full max-w-xs">
			<button
				type="button"
				disabled={isRedirecting}
				onClick={() => void signInWithGoogle()}
				className="flex h-11 w-full items-center justify-center gap-3 rounded-full border border-zinc-300 bg-white px-5 font-semibold text-zinc-900 hover:bg-zinc-200 disabled:cursor-wait disabled:opacity-60"
			>
				<img src="/google.png" alt="" className="size-5" />
				{isRedirecting ? "Redirecting..." : "Continue with Google"}
			</button>
			{error && <p role="alert" className="mt-3 text-center text-sm text-red-400">{error}</p>}
		</div>
	);
};

export default SignInOAuthButtons;
