import fs from "node:fs";

const cores = new Set(
  JSON.parse(fs.readFileSync("data/cores.pl.txt", { encoding: "utf8" }))
);

const words = fs
  .readFileSync("data/by-popularity-wiki.pl.txt", { encoding: "utf8" })
  .trim()
  .split("\n")
  .filter(
    (word) =>
      /^[abcdefghijklmnoprstuwyz]{4,8}$/.test(word) &&
      !cores.has(word.slice(0, 4))
  );

const usedCores = new Set();
const unique = [];

for (const word of words) {
  const core = word.slice(0, 4);

  if (usedCores.has(core)) {
    continue;
  }

  unique.push(word);
  usedCores.add(core);
}

console.log({ words: unique.length });

fs.writeFileSync("data/popular-wiki.pl.txt", unique.join("\n"));
