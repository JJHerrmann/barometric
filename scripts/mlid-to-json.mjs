import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";

const root = process.cwd();
const csvPath = path.join(root, "data", "mlid", "master-location-identifier-database-202507_standard.csv");
const jsonPath = path.join(root, "data", "mlid", "mlid.min.json");

if (!fs.existsSync(csvPath)) {
  console.error(`Missing CSV at ${csvPath}`);
  process.exit(1);
}

const csvText = fs.readFileSync(csvPath, "utf8");
const records = parse(csvText, {
  columns: true,
  skip_empty_lines: true,
  relax_quotes: true,
  relax_column_count: true,
  trim: true,
});

if (!records.length) {
  console.error("CSV contains no rows.");
  process.exit(1);
}

const headers = Object.keys(records[0]);

function normalizeHeader(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function pickColumn(candidates) {
  for (const header of headers) {
    const normalized = normalizeHeader(header);
    if (candidates.includes(normalized)) {
      return header;
    }
  }
  return null;
}

const icaoCandidates = [
  "icao",
  "icao code",
  "icao identifier",
  "icao id",
  "icao_code",
  "icao_identifier",
  "icaoid",
  "station icao",
  "station id",
];

const icaoCol = pickColumn(icaoCandidates) ?? pickColumn(["ident"]);
if (!icaoCol) {
  console.error(`Could not find ICAO column. Headers: ${headers.join(", ")}`);
  process.exit(1);
}

const nameCol = pickColumn([
  "name",
  "location name",
  "airport name",
  "facility name",
  "station name",
  "official name",
]);

const countryCol = pickColumn([
  "country",
  "country code",
  "iso country",
  "iso_country",
  "country_code",
]);

const regionCol = pickColumn([
  "region",
  "region code",
  "iso region",
  "subdivision",
  "state",
  "province",
]);

const latCol = pickColumn([
  "latitude",
  "lat",
  "latitude deg",
  "latitude_deg",
  "latitude decimal",
  "latitude_decimal",
]);

const lonCol = pickColumn([
  "longitude",
  "lon",
  "longitude deg",
  "longitude_deg",
  "longitude decimal",
  "longitude_decimal",
]);

const typeCol = pickColumn([
  "type",
  "location type",
  "facility type",
  "location_type",
  "facility_type",
  "site type",
]);

function toString(value) {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  return text.length ? text : null;
}

function toNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

const lookup = {};
for (const row of records) {
  const rawIcao = toString(row[icaoCol]);
  if (!rawIcao) continue;
  const icao = rawIcao.toUpperCase();
  if (!/^[A-Z0-9]{4}$/.test(icao)) continue;

  lookup[icao] = {
    name: nameCol ? toString(row[nameCol]) : null,
    country: countryCol ? toString(row[countryCol]) : null,
    region: regionCol ? toString(row[regionCol]) : null,
    lat: latCol ? toNumber(row[latCol]) : null,
    lon: lonCol ? toNumber(row[lonCol]) : null,
    type: typeCol ? toString(row[typeCol]) : null,
  };
}

fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
fs.writeFileSync(jsonPath, JSON.stringify(lookup), "utf8");
console.log(`Wrote ${Object.keys(lookup).length} ICAO entries to ${jsonPath}`);
