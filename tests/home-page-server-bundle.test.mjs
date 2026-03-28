import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const rootDir = process.cwd();
const tracePath = path.join(rootDir, ".next/server/app/(home)/page.js.nft.json");

test("home page server trace excludes plotly", async () => {
  const trace = JSON.parse(await readFile(tracePath, "utf8"));
  const plotlyChunkPattern = /plotly(?:[._-]|_js-)(?:js(?:[._-]|_)dist(?:[._-]|_)min|min)/i;

  assert.ok(Array.isArray(trace.files), "expected traced files to be an array");
  assert.equal(
    trace.files.some((file) => plotlyChunkPattern.test(file)),
    false,
    "plotly.js-dist-min should stay out of the server bundle",
  );
});
