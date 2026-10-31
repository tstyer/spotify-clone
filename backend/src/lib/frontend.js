import express from "express";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const frontendDist = fileURLToPath(new URL("../../../frontend/dist/", import.meta.url));

export const serveFrontend = (app, distDir = frontendDist) => {
	const indexFile = path.join(distDir, "index.html");
	if (!existsSync(indexFile)) return false;

	app.use(express.static(distDir));
	app.get("*", (req, res, next) => {
		if (path.extname(req.path)) return next();
		res.sendFile(indexFile, (error) => {
			if (error) next(error);
		});
	});

	return true;
};
