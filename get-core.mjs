import fs from "node:fs";

const good = [];

const alreadyDone = JSON.parse(
  fs.readFileSync("data/cores.pl.txt", { encoding: "utf8" })
);

const words = fs
  .readFileSync("data/temp.txt", {
    encoding: "utf8",
  })
  .trim()
  .split("\n")
  .filter((word) => !word.startsWith("?"));

const cores = [
  ...new Set([
    ...words.map((word) => word.slice(0, 4)),
    ...good,
    ...alreadyDone,
  ]),
].sort();

console.log({ cores: cores.length });

fs.writeFileSync("data/cores.pl.txt", JSON.stringify(cores));
