import { NextResponse } from "next/server";
import { getLocationByIcao } from "@/lib/mlid";

function normalizeIcao(raw: string) {
  return raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
}

function cToF(c: number) {
  return c * (9 / 5) + 32;
}

function mpsToMph(mps: number) {
  return mps * 2.2369362921;
}

function hpaToInHg(hpa: number) {
  return hpa * 0.0295299830714;
}

export async function GET(
  _req: Request,
  { params }: { params: { icao: string } }
) {
  const icao = normalizeIcao(params.icao);

  if (!icao || icao.length < 3) {
    return NextResponse.json(
      { error: `Unknown station (${params.icao})` },
      { status: 400 }
    );
  }

  const location = getLocationByIcao(icao);

  if (!location) {
    return NextResponse.json(
      { error: `Unknown station (${icao})` },
      { status: 404 }
    );
  }

  try {
    const url = `https://aviationweather.gov/api/data/metar?ids=${encodeURIComponent(
      icao
    )}&format=json&hours=1`;

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "barometer.rook.works (contact: jacobjaredherrmann@gmail.com)",
        Accept: "application/json",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json({
        station: icao,
        location,
        observedAt: null,
        observedAtEpochMs: null,
        pressure_inhg: null,
        temp_f: null,
        wind_mph: null,
        humidity: null,
        warning: `No live METAR available for (${icao}). Showing fallback.`,
        metar_status: res.status,
      });
    }

    const arr = (await res.json()) as unknown;

    if (!Array.isArray(arr) || arr.length === 0) {
      return NextResponse.json({
        station: icao,
        location,
        observedAt: null,
        observedAtEpochMs: null,
        pressure_inhg: null,
        temp_f: null,
        wind_mph: null,
        humidity: null,
        warning: `No recent METAR returned for (${icao}). Showing fallback.`,
      });
    }

    const m = arr[0] as Record<string, unknown>;

    const tempC =
      typeof m.temp === "number" ? m.temp : (m.tempC as number | undefined);

    const dewC =
      typeof m.dewp === "number" ? m.dewp : (m.dewpointC as number | undefined);

    const windMps =
      typeof m.wspd === "number" ? m.wspd : (m.windSpeed as number | undefined);

    const altRaw =
      typeof m.altim === "number"
        ? m.altim
        : typeof m.altimeter === "number"
        ? m.altimeter
        : typeof m.altimeter_hpa === "number"
        ? m.altimeter_hpa
        : undefined;

    const altInHg =
      typeof altRaw === "number"
        ? altRaw > 80
          ? hpaToInHg(altRaw)
          : altRaw
        : undefined;

    if (typeof tempC !== "number" || typeof altInHg !== "number") {
      return NextResponse.json({
        station: icao,
        location,
        observedAt: null,
        observedAtEpochMs: null,
        pressure_inhg: null,
        temp_f: null,
        wind_mph: null,
        humidity: null,
        warning: `METAR payload missing expected fields for (${icao}). Showing fallback.`,
        raw: m,
      });
    }

    const humidity =
      typeof dewC === "number"
        ? Math.max(0, Math.min(100, Math.round(100 - (tempC - dewC) * 5)))
        : null;

    const observedAt =
      typeof m.reportTime === "string"
        ? m.reportTime
        : typeof m.obsTime === "number"
        ? new Date(m.obsTime * 1000).toISOString()
        : typeof m.time === "string"
        ? m.time
        : null;

    const observedAtEpochMs =
      typeof m.obsTime === "number" ? Math.round(m.obsTime * 1000) : null;

    return NextResponse.json({
      station: icao,
      location,
      observedAt,
      observedAtEpochMs,
      pressure_inhg: altInHg,
      temp_f: cToF(tempC),
      wind_mph:
        typeof windMps === "number"
          ? Math.round(mpsToMph(windMps))
          : null,
      humidity,
      raw: m,
    });
  } catch {
    return NextResponse.json({
      station: icao,
      location,
      observedAt: null,
      observedAtEpochMs: null,
      pressure_inhg: null,
      temp_f: null,
      wind_mph: null,
      humidity: null,
      warning: `METAR fetch failed for (${icao}). Showing fallback.`,
    });
  }
}
