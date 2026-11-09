import * as Dialog from "@radix-ui/react-dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useMusicStore } from "@/stores/useMusicStore";
import type { Album } from "@/types";

const DeleteAlbumDialog = ({ album }: { album: Album }) => {
	const [open, setOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const deleteAlbum = useMusicStore((state) => state.deleteAlbum);

	const handleDelete = async () => {
		if (isDeleting) return;
		setIsDeleting(true);
		setError(null);
		const deleted = await deleteAlbum(album._id);
		if (deleted) setOpen(false);
		else setError(useMusicStore.getState().error ?? "Unable to delete album");
		setIsDeleting(false);
	};

	return (
		<Dialog.Root open={open} onOpenChange={(nextOpen) => {
			if (isDeleting) return;
			if (nextOpen) setError(null);
			setOpen(nextOpen);
		}}>
			<Dialog.Trigger asChild>
				<button type="button" aria-label={`Delete ${album.title}`} className="rounded p-2 text-red-400 hover:bg-red-400/10 hover:text-red-300">
					<Trash2 className="size-4" aria-hidden="true" />
				</button>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 z-40 bg-black/75" />
				<Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-zinc-700 bg-zinc-900 p-6 text-white shadow-2xl">
					<Dialog.Title className="text-xl font-semibold">Delete album and its songs?</Dialog.Title>
					<Dialog.Description className="mt-2 text-sm text-zinc-300">
						This will remove <span className="font-medium text-white">{album.title}</span> and every song in it from the catalog. Uploaded media will remain in Cloudinary.
					</Dialog.Description>
					{error && <p role="alert" className="mt-4 text-sm text-red-400">{error}</p>}
					<div className="mt-6 flex justify-end gap-3">
						<Dialog.Close asChild><button type="button" disabled={isDeleting} className="rounded-md border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800 disabled:opacity-50">Cancel</button></Dialog.Close>
						<button type="button" onClick={() => void handleDelete()} disabled={isDeleting} className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:cursor-wait disabled:opacity-50">{isDeleting ? "Deleting..." : "Delete Album"}</button>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

export default DeleteAlbumDialog;
