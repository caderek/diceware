import fs from "node:fs";

// [aąbcćdeęfghijklłmnńoóprsśtuwyzźż]{0,6}

const words = fs
  .readFileSync("data/pl.txt", { encoding: "utf8" })
  .trim()
  .split("\n")
  .filter((line) =>
    /^[abcdefghijklmnoprstuwyzABCDEFGHIJKLMNOPRSTUWYZ]{1}[abcdefghijklmnoprstuwyz]{3,9}$/i.test(
      line
    )
  )
  .map((word) => word.toLocaleLowerCase())
  .sort();

console.log({
  words: words.length,
});

fs.writeFileSync("wiktionary/sjp-usable-sorted.txt", words.join("\n"));
