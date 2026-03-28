import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const rootDir = process.cwd();
const layoutSharedPath = path.join(rootDir, "lib/layout.shared.tsx");

test("home toolbar does not include a docs button", async () => {
  const source = await readFile(layoutSharedPath, "utf8");

  assert.match(source, /links:\s*undefined/);
  assert.doesNotMatch(source, /text:\s*"文档"/);
});
