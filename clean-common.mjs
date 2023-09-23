import fs from "node:fs";

const cores = new Set(
  JSON.parse(fs.readFileSync("data/cores.pl.txt", { encoding: "utf8" }))
);

const popularWiki = fs
  .readFileSync("data/by-popularity-wiki.pl.txt", { encoding: "utf8" })
  .trim()
  .split("\n");

const words = fs
  .readFileSync("data/common/polish.txt", { encoding: "utf8" })
  .trim()
  .split("\n");

const good = words.filter(
  (word) => /^[abcdefghijklmnoprstuwyz]{4,8}$/.test(word)
  // !cores.has(word.slice(0, 4))
);

// const combined = [...new Set([...good, ...popularWiki])];

console.log(good.length);

fs.writeFileSync("data/popular.pl.txt", good.join("\n"));

// console.log(cores);
