import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";

const dict = new Set(
  fs.readFileSync("data/pl.txt", { encoding: "utf8" }).trim().split("\n")
);

const words = fs
  .readFileSync("data/popular.pl.txt", { encoding: "utf8" })
  .trim()
  .split("\n");

const correct = words.filter((word) => dict.has(word));

console.log({ dict: dict.size });
console.log({ words: words.length });
console.log({ correct: correct.length });

fs.writeFileSync("data/by-popularity.pl.txt", correct.join("\n"));
