// Notify IndexNow search engines (Bing, Yandex, Seznam, Naver) that the sitemap URLs changed.
// The key is public by design: it is served at https://www.sozorockfoundation.org/<key>.txt.
import { readFile, readdir } from "node:fs/promises";

const host = "www.sozorockfoundation.org";
const files = await readdir(new URL("../public/", import.meta.url));
const keyFile = files.find((name) => /^[0-9a-f]{32}\.txt$/u.test(name));
if (!keyFile) throw new Error("IndexNow key file is missing from public/.");
const key = keyFile.slice(0, -4);
const sitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
const urlList = [...sitemap.matchAll(/<loc>(https:\/\/www\.sozorockfoundation\.org[^<]*)<\/loc>/gu)].map((match) => match[1]);
if (!urlList.length) throw new Error("No sitemap URLs found.");
if (process.argv.includes("--dry-run")) {
  console.log(JSON.stringify({ host, key, urls: urlList.length }));
  process.exit(0);
}
const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation: `https://${host}/${keyFile}`, urlList }),
});
console.log(`IndexNow responded ${response.status} for ${urlList.length} URLs.`);
if (response.status >= 400 && response.status !== 429) process.exitCode = 1;
