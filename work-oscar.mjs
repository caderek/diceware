import fs, { fsyncSync } from "node:fs";
import readline from "node:readline";
import path from "node:path";

let processedFiles = new Set();

try {
  processedFiles = new Set(
    fs
      .readFileSync("processed-oscar-dumps.txt", { encoding: "utf8" })
      .trim()
      .split("\n")
  );
} catch {}

function isWordOK(word) {
  return /^[abcdefghijklmnoprstuwyz]{4,8}$/i.test(word);
}

const dict = new Map();

try {
  fs.readFileSync("data/popular-oscar.pl.txt", { encoding: "utf8" })
    .split("\n")
    .map((line) => {
      const [word, num] = line.split(" ");
      return [word, Number(num)];
    })
    .forEach(([word, num]) => dict.set(word, num));
} catch {}

async function processLineByLine(folder) {
  const files = fs
    .readdirSync(folder)
    .filter((file) => !processedFiles.has(file) && file.endsWith(".txt"));
  let i = 1;

  for (const file of files) {
    console.log(`Processing: ${file}`);
    const fileStream = fs.createReadStream(path.join(folder, file));

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const content of rl) {
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

      // if (i === 1000) {
      //   break;
      // }

      if (i % 1e5 === 0) {
        const num = new Intl.NumberFormat("en-US").format(i);
        console.log(`Processed: ${num} lines`);
      }

      i++;
    }

    processedFiles.add(file);
    fs.writeFileSync(
      "processed-oscar-dumps.txt",
      [...processedFiles].join("\n")
    );
  }

  const sorted = [...dict.entries()]
    .sort((a, b) => b[1] - a[1])
    .map((v) => `${v[0].toLocaleLowerCase()} ${v[1]}`);

  const withoutDuplicates = [...new Set(sorted)];

  console.log(withoutDuplicates.slice(0, 100));
  fs.writeFileSync("data/popular-oscar.pl.txt", withoutDuplicates.join("\n"));
}

processLineByLine("/media/caderek/ARCHIWUM/dumps");
