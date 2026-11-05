import { useEffect, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Outlet } from "react-router-dom";
import AudioPlayer from "./components/AudioPlayer";
import FriendsActivity from "./components/FriendsActivity";
import LeftSidebar from "./components/LeftSidebar";
import { PlaybackControls } from "./components/PlaybackControls";

type LayoutSize = "mobile" | "tablet" | "desktop";

const currentLayoutSize = (): LayoutSize => {
	if (typeof window === "undefined") return "desktop";
	if (window.innerWidth < 768) return "mobile";
	if (window.innerWidth < 1280) return "tablet";
	return "desktop";
};

const MainLayout = () => {
	const [layoutSize, setLayoutSize] = useState<LayoutSize>(currentLayoutSize);

	useEffect(() => {
		const updateLayout = () => setLayoutSize(currentLayoutSize());
		window.addEventListener("resize", updateLayout);
		return () => window.removeEventListener("resize", updateLayout);
	}, []);

	return (
		<div className="flex h-screen flex-col bg-black text-white">
			<AudioPlayer />
			{layoutSize === "mobile" ? (
				<div className="flex min-h-0 flex-1 p-2">
					<Outlet />
				</div>
			) : (
				<PanelGroup key={layoutSize} direction="horizontal" className="min-h-0 flex-1 p-2">
					<Panel defaultSize={layoutSize === "desktop" ? 20 : 25} minSize={15} maxSize={35}>
						<LeftSidebar />
					</Panel>
					<PanelResizeHandle aria-label="Resize albums sidebar" className="w-2 cursor-col-resize rounded bg-black hover:bg-zinc-700 focus-visible:bg-zinc-700" />
					<Panel defaultSize={layoutSize === "desktop" ? 60 : 75} minSize={35}>
						<div className="flex h-full min-h-0 flex-col">
							<Outlet />
						</div>
					</Panel>
					{layoutSize === "desktop" && (
						<>
							<PanelResizeHandle aria-label="Resize listening activity sidebar" className="w-2 cursor-col-resize rounded bg-black hover:bg-zinc-700 focus-visible:bg-zinc-700" />
							<Panel defaultSize={20} minSize={15} maxSize={30}>
								<FriendsActivity />
							</Panel>
						</>
					)}
				</PanelGroup>
			)}
			<PlaybackControls />
		</div>
	);
};

export default MainLayout;
