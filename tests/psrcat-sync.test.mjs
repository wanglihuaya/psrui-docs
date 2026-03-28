import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

const rootDir = process.cwd();
const fixturePath = path.join(rootDir, "tests/fixtures/psrcat-sample.db");
const scriptPath = path.join(rootDir, "scripts/sync-psrcat-data.mjs");

test("sync script converts catalogue records into trimmed homepage JSON", async () => {
  const outputDir = await mkdtemp(path.join(tmpdir(), "psrcat-sync-"));

  try {
    const result = spawnSync(
      "node",
      [scriptPath, "--source", fixturePath, "--output", outputDir],
      {
        cwd: rootDir,
        encoding: "utf8",
      },
    );

    assert.equal(result.status, 0, result.stderr || result.stdout);

    const pulsars = JSON.parse(
      await readFile(path.join(outputDir, "pulsars.json"), "utf8"),
    );
    const stats = JSON.parse(
      await readFile(path.join(outputDir, "stats.json"), "utf8"),
    );

    assert.equal(pulsars.length, 4);
    assert.deepEqual(stats.classes, {
      Normal: 1,
      MSP: 1,
      Binary: 1,
      Magnetar: 1,
    });
    assert.equal(stats.total, 4);
    assert.equal(stats.catalogue, "PSRCAT v2 database");

    const msp = pulsars.find((item) => item.PSRJ === "J0002+0002");
    assert.ok(msp);
    assert.equal(msp.class, "MSP");
    assert.equal(msp.PSRB, "B0002+00");
    assert.ok(Math.abs(msp.P0 - 0.002) < 1e-12);
    assert.ok(Math.abs(msp.P1 - 4e-19) < 1e-30);

    const magnetar = pulsars.find((item) => item.PSRJ === "J0004+0004");
    assert.ok(magnetar);
    assert.equal(magnetar.class, "Magnetar");
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});

test("sync script keeps only homepage fields in pulsar records", async () => {
  const outputDir = await mkdtemp(path.join(tmpdir(), "psrcat-sync-"));

  try {
    const result = spawnSync(
      "node",
      [scriptPath, "--source", fixturePath, "--output", outputDir],
      {
        cwd: rootDir,
        encoding: "utf8",
      },
    );

    assert.equal(result.status, 0, result.stderr || result.stdout);

    const pulsars = JSON.parse(
      await readFile(path.join(outputDir, "pulsars.json"), "utf8"),
    );

    assert.deepEqual(Object.keys(pulsars[0]).sort(), [
      "DM",
      "P0",
      "P1",
      "PSRB",
      "PSRJ",
      "class",
    ]);
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});
