import fs from "node:fs";

const cores = new Set(
  JSON.parse(fs.readFileSync("data/cores.pl.txt", { encoding: "utf8" }))
);

const dict = new Set(
  fs.readFileSync("data/pl.txt", { encoding: "utf8" }).trim().split("\n")
);

const words = fs
  .readFileSync("data/popular-oscar.pl.txt", { encoding: "utf8" })
  .trim()
  .split("\n")
  .map((line) => line.split(" ")[0])
  .filter((word) => !cores.has(word.slice(0, 4)) && dict.has(word));

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

fs.writeFileSync(
  "data/popular-oscar-clean.pl.txt",
  unique.filter((word) => !cores.has(word.slice(0, 4))).join("\n")
);
