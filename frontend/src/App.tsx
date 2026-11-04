import { AuthenticateWithRedirectCallback, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import SignInOAuthButtons from "@/components/SignInOAuthButtons";
import AuthCallbackPage from "@/pages/auth-callback/AuthCallbackPage";

function App() {
	return (
		<>
			<Routes>
				<Route
					path="/sso-callback"
					element={<AuthenticateWithRedirectCallback signUpForceRedirectUrl="/auth-callback" />}
				/>
				<Route path="/auth-callback" element={<AuthCallbackPage />} />
				<Route
					path="/"
					element={
						<main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-zinc-950 px-4 text-zinc-50">
							<h1 className="text-3xl font-bold">Spotify Clone</h1>
							<SignedOut>
								<SignInOAuthButtons />
							</SignedOut>
							<SignedIn>
								<div className="flex items-center gap-3 text-sm text-zinc-300">
									<span>Signed in</span>
									<UserButton />
								</div>
							</SignedIn>
						</main>
					}
				/>
			</Routes>
			<Toaster />
		</>
	);
}

export default App;
