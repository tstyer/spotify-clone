import fileUpload from "express-fileupload";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cron from "node-cron";

const tempDir = fileURLToPath(new URL("../../tmp/", import.meta.url));
const maxFileAgeMs = 60 * 60 * 1000;

export const uploadFiles = fileUpload({
	useTempFiles: true,
	tempFileDir: tempDir,
	createParentPath: true,
	limits: { fileSize: 10 * 1024 * 1024 },
	abortOnLimit: true,
});

export const cleanupTempFiles = async () => {
	let entries;
	try {
		entries = await fs.readdir(tempDir, { withFileTypes: true });
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}

	const cutoff = Date.now() - maxFileAgeMs;
	await Promise.all(
		entries
			.filter((entry) => entry.isFile() && entry.name.startsWith("tmp-"))
			.map(async (entry) => {
				const filePath = path.join(tempDir, entry.name);
				try {
					const { mtimeMs } = await fs.stat(filePath);
					if (mtimeMs < cutoff) await fs.unlink(filePath);
				} catch (error) {
					if (error.code !== "ENOENT") throw error;
				}
			})
	);
};

export const scheduleTempFileCleanup = () =>
	cron.schedule("0 * * * *", () => {
		cleanupTempFiles().catch((error) => console.error("Failed to clean temporary uploads", error));
	});
