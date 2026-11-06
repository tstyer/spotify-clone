import { Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useChatStore } from "@/stores/useChatStore";

const MessageInput = () => {
	const [draft, setDraft] = useState("");
	const [isSending, setIsSending] = useState(false);
	const [sendError, setSendError] = useState<string | null>(null);
	const selectedUser = useChatStore((state) => state.selectedUser);
	const isConnected = useChatStore((state) => state.isConnected);
	const sendMessage = useChatStore((state) => state.sendMessage);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!selectedUser || !isConnected || !draft.trim() || isSending) return;

		setIsSending(true);
		setSendError(null);
		const submittedDraft = draft;
		const sent = await sendMessage(selectedUser.clerkId, submittedDraft);
		if (sent) setDraft((currentDraft) => currentDraft === submittedDraft ? "" : currentDraft);
		else setSendError(useChatStore.getState().error ?? "Unable to send message");
		setIsSending(false);
	};

	return (
		<form onSubmit={(event) => void handleSubmit(event)} aria-busy={isSending} className="border-t border-zinc-800 p-3 sm:p-4">
			<div className="flex items-center gap-2">
				<input
					type="text"
					value={draft}
					onChange={(event) => setDraft(event.target.value)}
					maxLength={5000}
					aria-label="Message"
					placeholder={isConnected ? "Type a message" : "Waiting for chat connection"}
					className="h-11 min-w-0 flex-1 rounded-md border border-zinc-700 bg-zinc-800 px-3 text-sm text-white outline-none placeholder:text-zinc-400 focus:border-green-500"
				/>
				<button
					type="submit"
					disabled={!isConnected || !draft.trim() || isSending}
					aria-label={isSending ? "Sending message" : "Send message"}
					className="flex size-11 shrink-0 items-center justify-center rounded-md bg-green-500 text-black hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<Send className="size-5" aria-hidden="true" />
				</button>
			</div>
			{sendError && <p role="alert" className="mt-2 text-sm text-red-400">{sendError}</p>}
			{!isConnected && <p role="status" className="mt-2 text-xs text-zinc-400">Chat is offline. Your draft will stay here.</p>}
		</form>
	);
};

export default MessageInput;
