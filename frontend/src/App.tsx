import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import MainLayout from "@/layout/MainLayout";
import AlbumPage from "@/pages/album/AlbumPage";
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
				<Route element={<MainLayout />}>
					<Route path="/" element={<HomePage />} />
					<Route path="/albums/:albumId" element={<AlbumPage />} />
				</Route>
			</Routes>
			<Toaster />
		</>
	);
}

export default App;
