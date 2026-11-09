import axios from "axios";
import * as Dialog from "@radix-ui/react-dialog";
import { Plus, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";
import { useMusicStore } from "@/stores/useMusicStore";

const maxFileSize = 10 * 1024 * 1024;
const currentYear = new Date().getFullYear();
const fieldClass = "mt-1 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none";

const AddAlbumDialog = () => {
	const [open, setOpen] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [title, setTitle] = useState("");
	const [artist, setArtist] = useState("");
	const [releaseYear, setReleaseYear] = useState(String(currentYear));
	const [imageFile, setImageFile] = useState<File | null>(null);
	const fetchAlbums = useMusicStore((state) => state.fetchAlbums);
	const fetchStats = useMusicStore((state) => state.fetchStats);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (isUploading) return;
		setError(null);

		const year = Number(releaseYear);
		if (!title.trim() || !artist.trim() || !Number.isInteger(year) || year < 1900 || year > currentYear) {
			setError(`Enter a title, artist, and release year between 1900 and ${currentYear}.`);
			return;
		}
		if (!imageFile || !imageFile.type.startsWith("image/")) {
			setError("Choose an artwork image.");
			return;
		}
		if (imageFile.size > maxFileSize) {
			setError("The artwork image must be 10 MB or smaller.");
			return;
		}

		const formData = new FormData();
		formData.append("title", title.trim());
		formData.append("artist", artist.trim());
		formData.append("releaseYear", releaseYear);
		formData.append("imageFile", imageFile);

		setIsUploading(true);
		try {
			await axiosInstance.post("/admin/albums", formData);
			setOpen(false);
			setTitle("");
			setArtist("");
			setReleaseYear(String(currentYear));
			setImageFile(null);
			toast.success("Album added successfully");
			void Promise.all([fetchAlbums(), fetchStats()]);
		} catch (caughtError) {
			const message = axios.isAxiosError<{ message?: string }>(caughtError)
				? caughtError.response?.data?.message
				: undefined;
			setError(message ?? "Unable to add album. Please try again.");
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<Dialog.Root open={open} onOpenChange={(nextOpen) => {
			if (isUploading) return;
			if (nextOpen) setError(null);
			setOpen(nextOpen);
		}}>
			<Dialog.Trigger asChild>
				<button type="button" className="flex items-center gap-2 rounded-md bg-violet-500 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-400">
					<Plus className="size-4" aria-hidden="true" /> Add Album
				</button>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 z-40 bg-black/75" />
				<Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-900 p-5 text-white shadow-2xl sm:p-6">
					<div className="mb-5 flex items-start justify-between gap-3">
						<div>
							<Dialog.Title className="text-xl font-semibold">Add New Album</Dialog.Title>
							<Dialog.Description className="mt-1 text-sm text-zinc-400">Upload artwork for your album collection.</Dialog.Description>
						</div>
						<Dialog.Close asChild><button type="button" disabled={isUploading} aria-label="Close" className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-50"><X className="size-5" /></button></Dialog.Close>
					</div>
					<form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
						<label className="block text-sm font-medium">Album Title<input required maxLength={200} value={title} onChange={(event) => setTitle(event.target.value)} className={fieldClass} /></label>
						<label className="block text-sm font-medium">Artist<input required maxLength={200} value={artist} onChange={(event) => setArtist(event.target.value)} className={fieldClass} /></label>
						<label className="block text-sm font-medium">Release Year<input required type="number" min={1900} max={currentYear} step={1} value={releaseYear} onChange={(event) => setReleaseYear(event.target.value)} className={fieldClass} /></label>
						<label className="block text-sm font-medium">Artwork image<input required type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] ?? null)} className={fieldClass} /></label>
						<p className="text-xs text-zinc-400">The image must be 10 MB or smaller.</p>
						{error && <p role="alert" className="text-sm text-red-400">{error}</p>}
						<div className="flex justify-end gap-3 pt-2">
							<Dialog.Close asChild><button type="button" disabled={isUploading} className="rounded-md border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800 disabled:opacity-50">Cancel</button></Dialog.Close>
							<button type="submit" disabled={isUploading} className="rounded-md bg-violet-500 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-400 disabled:cursor-wait disabled:opacity-50">{isUploading ? "Uploading..." : "Add Album"}</button>
						</div>
					</form>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

export default AddAlbumDialog;
