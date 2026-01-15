import "server-only";
import fs from "node:fs";
import path from "node:path";

type Location = {
  name: string | null;
  country: string | null;
  region: string | null;
  lat: number | null;
  lon: number | null;
  type: string | null;
};

type MlidLookup = Record<string, Location>;

let cached: MlidLookup | null = null;

function loadMlid(): MlidLookup {
  if (cached) return cached;
  const filePath = path.join(process.cwd(), "data", "mlid", "mlid.min.json");
  const raw = fs.readFileSync(filePath, "utf8");
  cached = JSON.parse(raw) as MlidLookup;
  return cached;
}

function normalizeIcao(raw: string) {
  const value = raw.trim().toUpperCase();
  if (!/^[A-Z0-9]{4}$/.test(value)) return null;
  return value;
}

export function getLocationByIcao(icao: string): Location | null {
  if (!icao) return null;
  const normalized = normalizeIcao(icao);
  if (!normalized) return null;
  const data = loadMlid();
  return data[normalized] ?? null;
}

export type { Location };
