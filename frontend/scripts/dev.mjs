import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const frontendDir = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(frontendDir, "../..");
const backendDir = path.join(projectDir, "backend");
const vite = path.join(projectDir, "frontend/node_modules/vite/bin/vite.js");
const nodemon = path.join(backendDir, "node_modules/nodemon/bin/nodemon.js");

const children = [
  spawn(process.execPath, [nodemon, "src/index.js"], {
    cwd: backendDir,
    stdio: "inherit",
  }),
  spawn(process.execPath, [vite, ...process.argv.slice(2)], {
    cwd: path.join(projectDir, "frontend"),
    stdio: "inherit",
  }),
];

let stopping = false;

function stop(exitCode = 0) {
  if (stopping) return;
  stopping = true;

  for (const child of children) {
    if (!child.pid) continue;
    if (process.platform === "win32") {
      spawnSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], {
        stdio: "ignore",
      });
    } else {
      child.kill("SIGTERM");
    }
  }

  process.exit(exitCode);
}

for (const child of children) {
  child.on("error", (error) => {
    console.error(error);
    stop(1);
  });
  child.on("exit", (code) => stop(code ?? 1));
}

process.on("SIGINT", () => stop(0));
process.on("SIGTERM", () => stop(0));
