/**
 * Bakes the rendered page into dist/index.html so visitors (and crawlers,
 * and link previews) get real content before any JavaScript runs. The client
 * bundle then hydrates it.
 *
 * Runs as the last step of `npm run build`, after the client build and the
 * SSR build of src/entry-server.jsx.
 */
import { readFile, readdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");
const MARKER = '<div id="root"></div>';

const entry = (await readdir(ssrDir)).find((f) => /^entry-server\.(m?js|cjs)$/.test(f));
if (!entry) throw new Error("prerender: no SSR bundle found in dist-ssr/");

const { render } = await import(pathToFileURL(path.join(ssrDir, entry)).href);
const markup = render();

const htmlPath = path.join(dist, "index.html");
const html = await readFile(htmlPath, "utf8");
if (!html.includes(MARKER)) {
  throw new Error(`prerender: could not find ${MARKER} in dist/index.html`);
}

await writeFile(htmlPath, html.replace(MARKER, `<div id="root">${markup}</div>`));
await rm(ssrDir, { recursive: true, force: true });

console.log(
  `prerendered index.html (${(markup.length / 1024).toFixed(1)} kB of markup)`
);
