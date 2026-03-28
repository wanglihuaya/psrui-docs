import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { resolveDocHref } from "../lib/resolve-doc-href.mjs";

const rootDir = process.cwd();
const docsRoot = path.join(rootDir, "content", "docs");

test("resolveDocHref keeps section index links inside the docs tree", () => {
  const pages = [
    {
      locale: "zh",
      path: "pulsar-physics/index.zh.mdx",
      slugs: ["pulsar-physics"],
      url: "/docs/pulsar-physics",
    },
    {
      locale: "zh",
      path: "pulsar-physics/preface.zh.mdx",
      slugs: ["pulsar-physics", "preface"],
      url: "/docs/pulsar-physics/preface",
    },
    {
      locale: "zh",
      path: "handbook-pulsar-astronomy/index.zh.mdx",
      slugs: ["handbook-pulsar-astronomy"],
      url: "/docs/handbook-pulsar-astronomy",
    },
  ];

  const page = pages[0];

  assert.equal(
    resolveDocHref("./preface", page, pages),
    "/docs/pulsar-physics/preface",
  );
  assert.equal(
    resolveDocHref("../handbook-pulsar-astronomy", page, pages),
    "/docs/handbook-pulsar-astronomy",
  );
});

test("docs content does not link to local filesystem paths", async () => {
  const targets = [
    path.join(docsRoot, "index.en.mdx"),
    path.join(docsRoot, "index.zh.mdx"),
    path.join(docsRoot, "pulsar-physics", "index.en.mdx"),
    path.join(docsRoot, "pulsar-physics", "index.zh.mdx"),
  ];

  for (const filePath of targets) {
    const source = await readFile(filePath, "utf8");

    assert.doesNotMatch(
      source,
      /\]\(\/Users\/[^)]+\)/,
      `${path.relative(rootDir, filePath)} still points to a local file`,
    );
  }
});
