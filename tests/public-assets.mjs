import { readdir } from "node:fs/promises";

export async function publicAssets(directory = new URL("../public/", import.meta.url), prefix = "") {
  const assets = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const name = `${prefix}/${entry.name}`;
    if (entry.isDirectory()) assets.push(...await publicAssets(new URL(`${entry.name}/`, directory), name));
    else if (entry.isFile()) assets.push(name);
  }
  return assets;
}
