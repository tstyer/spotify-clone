import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import AudioPlayer from "@/layout/components/AudioPlayer";
import { PlaybackControls } from "@/layout/components/PlaybackControls";
import AuthCallbackPage from "@/pages/auth-callback/AuthCallbackPage";
import HomePage from "@/pages/home/HomePage";

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
						<div className="flex h-screen flex-col bg-zinc-950 text-zinc-50">
							<AudioPlayer />
							<HomePage />
							<PlaybackControls />
						</div>
					}
				/>
			</Routes>
			<Toaster />
		</>
	);
}

export default App;
