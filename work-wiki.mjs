import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";

function getFilePaths(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const paths = [];

  for (const entry of entries) {
    if (entry.isFile()) {
      paths.push(path.join(dir, entry.name));
    }

    if (entry.isDirectory()) {
      const subDir = path.join(dir, entry.name);

      for (const path of getFilePaths(subDir)) {
        paths.push(path);
      }
    }
  }

  return paths;
}

function isWordOK(word) {
  // return /^[abcdefghijklmnoprstuwyz]+$/.test(word);
  return /^[aąbcćdeęfghijklłmnńoóprsśtuwyzźż]+$/.test(word);
}

const files = getFilePaths("dump");

console.log({ files: files.length });

const dict = new Map();
let i = 0;

for (const file of files) {
  const content = fs.readFileSync(file, { encoding: "utf8" });
  const words = content
    .replace(
      /[^aąbcćdeęfghijklłmnńoóprsśtuwyzźżAĄBCĆDEĘFGHIJKLŁMNŃOÓPRSŚTUWYZŹŻ ]/g,
      ""
    )
    .trim()
    .split(/\s+/)
    .filter(isWordOK);

  for (const word of words) {
    dict.set(word, (dict.get(word) ?? 0) + 1);
  }

  if (i % 1000 === 0) {
    console.log(`Processed: ${i} of ${files.length}`);
  }

  i++;
}

console.log(dict);

const sorted = [...dict.entries()].sort((a, b) => b[1] - a[1]).map((v) => v[0]);

console.log(sorted.slice(0, 100));

fs.writeFileSync("data/popular.pl.txt", sorted.join("\n"));
