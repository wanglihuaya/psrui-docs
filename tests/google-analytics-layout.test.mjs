import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const rootDir = process.cwd();
const layoutPath = path.join(rootDir, "app/layout.tsx");
const measurementId = "G-85D98L6MZP";

test("root layout includes the Google Analytics tag", async () => {
  const layoutSource = await readFile(layoutPath, "utf8");

  assert.match(layoutSource, /import Script from "next\/script";/);
  assert.match(
    layoutSource,
    new RegExp(
      `https://www\\.googletagmanager\\.com/gtag/js\\?id=${measurementId}`,
    ),
  );
  assert.match(layoutSource, /gtag\('config', 'G-85D98L6MZP'\);/);
});
