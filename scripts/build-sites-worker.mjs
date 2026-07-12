import { copyFile, mkdir, readdir, rename } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export async function stageSitesBuild({ distDir, workerFile }) {
  const clientDir = join(distDir, "client");
  const serverEntry = join(distDir, "server", "index.js");

  await mkdir(clientDir, { recursive: true });
  await mkdir(dirname(serverEntry), { recursive: true });

  const entries = await readdir(distDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name === "client" || entry.name === "server") {
      continue;
    }

    await rename(join(distDir, entry.name), join(clientDir, entry.name));
  }

  await copyFile(workerFile, serverEntry);
}

const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? resolve(process.argv[1]) : "";

if (currentFile === invokedFile) {
  await stageSitesBuild({
    distDir: fileURLToPath(new URL("../dist", import.meta.url)),
    workerFile: fileURLToPath(new URL("../worker/index.js", import.meta.url)),
  });
}
