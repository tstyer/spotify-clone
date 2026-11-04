import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { Route, Routes } from "react-router-dom";
import AuthCallbackPage from "@/pages/auth-callback/AuthCallbackPage";

function App() {
	return (
		<Routes>
			<Route
				path="/sso-callback"
				element={<AuthenticateWithRedirectCallback signUpForceRedirectUrl="/auth-callback" />}
			/>
			<Route path="/auth-callback" element={<AuthCallbackPage />} />
			<Route
				path="/"
				element={
					<main className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-50">
						<h1 className="text-3xl font-bold">Spotify Clone</h1>
					</main>
				}
			/>
		</Routes>
	);
}

export default App;
