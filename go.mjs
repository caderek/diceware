import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { getForeignWords, isWordOK } from "./utils.mjs";

const dict = "data/popular.pl.txt";

const foreignWords = getForeignWords(["polish"]);

function isForeign(word) {
  return !foreignWords.has(word);
}

const POPULAR_WORDS_TO_SKIP = 0;
const POPULAR_WORDS_COUNT = 7776;

const words = fs
  .readFileSync(dict, { encoding: "utf8" })
  .trim()
  .split("\n")
  .filter((word) => isWordOK(word) && isForeign(word));

console.log(words);

const pool = words.slice(
  POPULAR_WORDS_TO_SKIP,
  POPULAR_WORDS_TO_SKIP + POPULAR_WORDS_COUNT
);

const temp = new Set();

while (temp.size < 7776) {
  const word = pool[crypto.randomInt(pool.length)];
  temp.add(word);
}

const selected = [...temp].sort();

console.log({ words: words.length });
console.log({ pool: pool.length });
console.log({ length: selected.length });
console.log(selected);

for (let i = 0; i < 10; i++) {
  const passphrase = Array.from(
    { length: 6 },
    () => selected[crypto.randomInt(selected.length)]
  ).join(" ");

  console.log(passphrase);
}

fs.writeFileSync("data/diceware.pl.txt", selected.join("\n"));
fs.writeFileSync("data/popular-clean.pl.txt", words.join("\n"));
