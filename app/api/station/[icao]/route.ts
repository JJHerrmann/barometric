import { NextResponse } from "next/server";

function normalizeIcao(raw: string) {
  return raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
}

function cToF(c: number) {
  return c * (9 / 5) + 32;
}

function mpsToMph(mps: number) {
  return mps * 2.2369362921;
}

// If needed later:
function hpaToInHg(hpa: number) {
  return hpa * 0.0295299830714;
}

export async function GET(_req: Request, { params }: { params: { icao: string } }) {
  const icao = normalizeIcao(params.icao);

  if (!icao || icao.length < 3) {
    return NextResponse.json({ error: `Unknown station (${params.icao})` }, { status: 400 });
  }

  try {
    // NOAA/NWS Aviation Weather Center METAR JSON endpoint
    // NOTE: Field names can vary; we will normalize defensively and log raw payload.
    const url = `https://aviationweather.gov/api/data/metar?ids=${encodeURIComponent(
      icao
    )}&format=json&hours=1`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "barometer.rook.works (contact: jacobjaredherrmann@gmail.com)",
        Accept: "application/json",
      },
      // avoid hammering NOAA; cache for 60s at the edge
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Connection failed. Unknown station (${icao})` },
        { status: 502 }
      );
    }

    const arr = (await res.json()) as unknown;

    if (!Array.isArray(arr) || arr.length === 0) {
      return NextResponse.json({ error: `No recent METAR for (${icao})` }, { status: 404 });
    }

    const m = arr[0] as Record<string, unknown>;

    // Common-ish fields across versions:
    const tempC = typeof m.temp === "number" ? m.temp : m.tempC;
    const dewC = typeof m.dewp === "number" ? m.dewp : m.dewpointC;
    const windMps = typeof m.wspd === "number" ? m.wspd : m.windSpeed;
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
      return NextResponse.json(
        { error: `Bad METAR payload for (${icao})`, raw: m },
        { status: 502 }
      );
    }

    // Humidity is usually not explicit in METAR; derive cheaply from temp/dew.
    // This is an approximation for UI usefulness, not medical accuracy.
    const humidity =
      typeof dewC === "number"
        ? Math.max(0, Math.min(100, Math.round(100 - (tempC - dewC) * 5)))
        : null;

    return NextResponse.json({
      station: icao,
      observedAt: typeof m.obsTime === "string" ? m.obsTime : typeof m.time === "string" ? m.time : null,
      pressure_inhg: altInHg,
      temp_f: cToF(tempC),
      wind_mph: typeof windMps === "number" ? Math.round(mpsToMph(windMps)) : null,
      humidity,
      raw: m,
    });
  } catch {
    return NextResponse.json(
      { error: `Connection failed. Unknown station (${icao})` },
      { status: 502 }
    );
  }
}
