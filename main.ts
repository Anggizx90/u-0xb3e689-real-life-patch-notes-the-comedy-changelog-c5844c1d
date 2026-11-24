import { join } from "node:path";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// Real-Life Patch Notes: The Comedy Changelog — one line, at most 160
// characters: a software patch note for a bug in real life, in the terse
// register of a real release note.
const ENTRY =
  "v3.2.0: fixed a bug where the brain queued a 2014 embarrassment for 3 a.m. playback instead of sleep.";

// Gate self-check, mirroring the kit's sealed scorer: /output/entry.txt
// must be UTF-8 text of 1 to 160 characters, not only white space.
function checkGate(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > 160) {
    throw new Error(`entry must be 1-160 characters, got ${chars}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  if (/[\r\n]/.test(text)) {
    throw new Error("entry must be a single line");
  }
}

checkGate(ENTRY);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

// Read back what actually landed on disk and gate-check that, so a
// truncated or mangled write fails loudly instead of scoring a 0.
const written = readFileSync(outPath, "utf8");
checkGate(written);
if (written !== ENTRY) {
  throw new Error("written entry does not match the intended line");
}
