import fs from "node:fs";
import path from "node:path";

export function isWordOK(word) {
  return /^[abcdefghijklmnoprstuwyz]{4,8}$/g.test(word);
}

export function getForeignWords(languagesToSkip = []) {
  const DIR = path.join("data", "common");
  const files = fs
    .readdirSync(DIR)
    .filter((file) => !languagesToSkip.includes(file.split(".")[0]));

  const foreign = new Set();

  for (const file of files) {
    const src = path.join(DIR, file);
    const words = fs
      .readFileSync(src, { encoding: "utf-8" })
      .trim()
      .split("\n");

    for (const word of words) {
      if (isWordOK(word)) {
        foreign.add(word);
      }
    }
  }

  return foreign;
}
