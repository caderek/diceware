import fs from "node:fs";

const words = fs
  .readFileSync("wiktionary/sjp-usable-sorted.txt", {
    encoding: "utf8",
  })
  .trim()
  .split("\n");

const groups = new Map();

for (const word of words) {
  const sig = word.slice(0, 4);
  const wordList = groups.get(sig) ?? [];
  groups.set(sig, wordList.concat(word));
}

// console.log(groups);

const withAtLeastOneNonDiacritic = [...groups.entries()].filter(([_, words]) =>
  words.some((word) => /^[abcdefghijklmnoprstuwyz]{4,8}$/.test(word))
);

const byUsefulness = (a, b) => {
  const aa = /^[abcdefghijklmnoprstuwyz]+$/.test(a);
  const bb = /^[abcdefghijklmnoprstuwyz]+$/.test(b);

  return aa === bb ? 0 : aa === true ? -1 : 1;
};

const byLength = (a, b) => a.length - b.length;

const finalGroups = withAtLeastOneNonDiacritic.map(([core, words]) => ({
  core,
  words: words.sort((a, b) => byUsefulness(a, b) || byLength(a, b)),
}));

console.dir(finalGroups.slice(5000), { depth: null });

console.log({ groups: groups.size });
console.log({ final: finalGroups.length });

fs.writeFileSync(
  "wiktionary/sjp-groups-of-4.json",
  JSON.stringify(finalGroups)
);
