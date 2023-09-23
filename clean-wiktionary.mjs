import fs from "node:fs";
import { getForeignWords } from "./utils.mjs";

const dict = new Set(
  fs.readFileSync("data/pl.txt", { encoding: "utf8" }).trim().split("\n")
);

const words = fs
  .readFileSync("wiktionary/wiktionary.txt", { encoding: "utf8" })
  .trim()
  .split("\n")
  .filter((line) => /^\d+:\d+:[aąbcćdeęfghijklłmnńoóprsśtuwyzźż]+$/i.test(line))
  .map((line) => line.replace(/^\d+:\d+:/, ""));

fs.writeFileSync("wiktionary/wiktionary-clean.txt", words.join("\n"));

const usable = words
  .filter((word) => /^[abcdefghijklmnoprstuwyz]{4}/i.test(word))
  .filter((word) => /^.[abcdefghijklmnoprstuwyz]{3}/.test(word))
  // .filter((word) => !/([a-z])\1/.test(word))
  .filter(
    (word) =>
      dict.has(word) &&
      // !dictEN.has(word) &&
      // !foreignWords.has(word) &&
      !["kurw", "pierd", "sra", "cip", "jeb", "huj"].some((banned) =>
        word.includes(banned)
      )
  )
  .map((word) => word.toLocaleLowerCase());

console.log(usable.slice(0));

console.log({
  words: words.length,
  usable: usable.length,
});

fs.writeFileSync("wiktionary/wiktionary-usable.txt", usable.join("\n"));
fs.writeFileSync(
  "wiktionary/wiktionary-usable-sorted.txt",
  [...usable.sort()].join("\n")
);
