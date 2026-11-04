import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState, type PropsWithChildren } from "react";
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";

const AuthProvider = ({ children }: PropsWithChildren) => {
	const { isLoaded, userId, getToken } = useAuth();
	const checkAdminStatus = useAuthStore((state) => state.checkAdminStatus);
	const reset = useAuthStore((state) => state.reset);
	const initSocket = useChatStore((state) => state.initSocket);
	const disconnectSocket = useChatStore((state) => state.disconnectSocket);
	const [readyFor, setReadyFor] = useState<string | null | undefined>(undefined);

	useEffect(() => {
		if (!isLoaded) return;

		const interceptor = axiosInstance.interceptors.request.use(async (config) => {
			const token = await getToken();
			if (token) config.headers.set("Authorization", `Bearer ${token}`);
			else config.headers.delete("Authorization");
			return config;
		});

		return () => axiosInstance.interceptors.request.eject(interceptor);
	}, [getToken, isLoaded]);

	useEffect(() => {
		if (!isLoaded) return;
		let active = true;

		const syncAuth = async () => {
			if (userId) await checkAdminStatus();
			else reset();
			if (active) setReadyFor(userId ?? null);
		};

		void syncAuth();
		return () => {
			active = false;
			reset();
		};
	}, [isLoaded, userId, checkAdminStatus, reset]);

	useEffect(() => {
		if (!isLoaded) return;
		if (userId) void initSocket(userId, getToken);
		else disconnectSocket();

		return () => disconnectSocket();
	}, [isLoaded, userId, getToken, initSocket, disconnectSocket]);

	if (!isLoaded || readyFor !== (userId ?? null)) {
		return (
			<div className="flex h-screen w-full items-center justify-center">
				<Loader className="size-8 animate-spin text-emerald-500" />
			</div>
		);
	}

	return <>{children}</>;
};

export default AuthProvider;
