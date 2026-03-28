import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptFile = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(scriptFile);
const repoRoot = path.resolve(scriptDir, "..");
const defaultSource = path.resolve(
  repoRoot,
  "../Psrui/backend/data/psrcat_tar/psrcat.db",
);
const defaultOutput = path.resolve(repoRoot, "public/psrcat");

function getArg(flag, fallback) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return fallback;

  const value = process.argv[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`Missing value for ${flag}`);
  }

  return path.resolve(process.cwd(), value);
}

function toNumber(value) {
  if (value == null) return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function getCatalogueLabel(content) {
  const header = content
    .split("\n")
    .find((line) => line.startsWith("# Catalogue produced"));

  if (header?.includes("version 2 database")) {
    return "PSRCAT v2 database";
  }

  return "PSRCAT catalogue";
}

function classifyPulsar(record) {
  const type = record.TYPE ?? "";
  const isMsp = typeof record.P0 === "number" && record.P0 < 0.03;
  const isBinary = record.PB != null || record.BINARY != null;
  const isMagnetar = type.includes("AXP") || type.includes("SGR");

  if (isMagnetar) return "Magnetar";
  if (isMsp) return "MSP";
  if (isBinary) return "Binary";
  return "Normal";
}

function parseRecord(rawRecord) {
  const record = {};

  for (const line of rawRecord.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const [parameter, value] = trimmed.split(/\s+/, 2);
    if (!parameter || !value || record[parameter] != null) continue;

    record[parameter] = value;
  }

  if (!record.PSRJ && !record.PSRB) return null;

  record.P0 = toNumber(record.P0);
  record.P1 = toNumber(record.P1);
  record.F0 = toNumber(record.F0);
  record.F1 = toNumber(record.F1);
  record.DM = toNumber(record.DM);
  record.PB = toNumber(record.PB);

  if (record.P0 == null && typeof record.F0 === "number" && record.F0 !== 0) {
    record.P0 = 1 / record.F0;
  }

  if (
    record.P1 == null &&
    typeof record.F1 === "number" &&
    typeof record.F0 === "number" &&
    record.F0 !== 0
  ) {
    record.P1 = -record.F1 / record.F0 ** 2;
  }

  return {
    PSRJ: record.PSRJ ?? record.PSRB,
    PSRB: record.PSRB ?? null,
    P0: record.P0,
    P1: record.P1,
    DM: record.DM,
    class: classifyPulsar(record),
  };
}

function buildStats(pulsars, catalogue) {
  const classes = {
    Normal: 0,
    MSP: 0,
    Binary: 0,
    Magnetar: 0,
  };

  for (const pulsar of pulsars) {
    classes[pulsar.class] += 1;
  }

  return {
    catalogue,
    generatedAt: new Date().toISOString(),
    total: pulsars.length,
    classes,
  };
}

async function main() {
  const sourcePath = getArg("--source", defaultSource);
  const outputDir = getArg("--output", defaultOutput);
  const content = await readFile(sourcePath, "utf8");
  const catalogue = getCatalogueLabel(content);

  const pulsars = content
    .split("@")
    .map(parseRecord)
    .filter(Boolean)
    .sort((left, right) => left.PSRJ.localeCompare(right.PSRJ));

  const stats = buildStats(pulsars, catalogue);

  await mkdir(outputDir, { recursive: true });
  await writeFile(
    path.join(outputDir, "pulsars.json"),
    `${JSON.stringify(pulsars, null, 2)}\n`,
    "utf8",
  );
  await writeFile(
    path.join(outputDir, "stats.json"),
    `${JSON.stringify(stats, null, 2)}\n`,
    "utf8",
  );

  console.log(
    `Wrote ${pulsars.length} pulsars to ${path.relative(repoRoot, outputDir)}`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
