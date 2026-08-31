import { readdir, readFile, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";

const publicEnvironmentVariables = [
  "NEXT_PUBLIC_API_BASE_URL",
  "NEXT_PUBLIC_DISABLE_WIDGET_PRELOAD",
  "NEXT_PUBLIC_HIDE_ON_IMAGE_ERROR",
  "NEXT_PUBLIC_PCOB_URL",
];

const textExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".map",
  ".txt",
]);

async function patchDirectory(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);

      if (entry.isDirectory()) {
        await patchDirectory(path);
        return;
      }

      if (!entry.isFile() || !textExtensions.has(extname(entry.name))) return;

      const original = await readFile(path, "utf8");
      let updated = original;

      for (const name of publicEnvironmentVariables) {
        const placeholder = `__COOLIFY_${name}__`;
        updated = updated.replaceAll(placeholder, process.env[name] ?? "");
      }

      if (updated !== original) await writeFile(path, updated);
    }),
  );
}

const nextDirectory = join(process.cwd(), ".next");

await Promise.all([
  patchDirectory(join(nextDirectory, "server")),
  patchDirectory(join(nextDirectory, "static")),
]);
