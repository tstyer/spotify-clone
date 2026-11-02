import axios from "axios";
import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";

interface AuthStore {
	isAdmin: boolean;
	isLoading: boolean;
	error: string | null;
	checkAdminStatus: () => Promise<void>;
	reset: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
	isAdmin: false,
	isLoading: false,
	error: null,

	checkAdminStatus: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get<{ admin: boolean }>("/admin/check");
			set({ isAdmin: response.data.admin === true });
		} catch (error) {
			const message = axios.isAxiosError<{ message?: string }>(error)
				? error.response?.data?.message
				: undefined;
			set({ isAdmin: false, error: message ?? "Unable to check admin access" });
		} finally {
			set({ isLoading: false });
		}
	},

	reset: () => set({ isAdmin: false, isLoading: false, error: null }),
}));
