import { NextResponse } from "next/server";

function normalizeIcao(raw: string) {
  return raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
}

function hpaToInHg(hpa: number) {
  return hpa * 0.0295299830714;
}

function getAltimeterInHg(m: Record<string, unknown>) {
  const altRaw =
    typeof m.altim === "number"
      ? m.altim
      : typeof m.altimeter === "number"
      ? m.altimeter
      : typeof m.altimeter_hpa === "number"
      ? m.altimeter_hpa
      : undefined;

  if (typeof altRaw !== "number") return null;
  return altRaw > 80 ? hpaToInHg(altRaw) : altRaw;
}

function getObservedAt(m: Record<string, unknown>) {
  if (typeof m.reportTime === "string") return m.reportTime;
  if (typeof m.obsTime === "number") return new Date(m.obsTime * 1000).toISOString();
  if (typeof m.time === "string") return m.time;
  return null;
}

export async function GET(req: Request, { params }: { params: { icao: string } }) {
  const icao = normalizeIcao(params.icao);

  if (!icao || icao.length < 3) {
    return NextResponse.json({ error: `Unknown station (${params.icao})` }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const hoursRaw = Number(searchParams.get("hours"));
  const hours = Number.isFinite(hoursRaw) ? Math.min(48, Math.max(1, Math.floor(hoursRaw))) : 24;

  try {
    const url = `https://aviationweather.gov/api/data/metar?ids=${encodeURIComponent(
      icao
    )}&format=json&hours=${hours}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "barometer.rook.works (contact: jacobjaredherrmann@gmail.com)",
        Accept: "application/json",
      },
      next: { revalidate: 300 },
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

    const points = arr
      .map((raw) => {
        const m = raw as Record<string, unknown>;
        const t = getObservedAt(m);
        const p = getAltimeterInHg(m);
        if (!t || typeof p !== "number") return null;
        return { t, pressure_inhg: p };
      })
      .filter(Boolean)
      .sort((a, b) => (a!.t < b!.t ? -1 : a!.t > b!.t ? 1 : 0));

    if (points.length === 0) {
      return NextResponse.json({ error: `Bad METAR payload for (${icao})` }, { status: 502 });
    }

    return NextResponse.json({ station: icao, points });
  } catch {
    return NextResponse.json(
      { error: `Connection failed. Unknown station (${icao})` },
      { status: 502 }
    );
  }
}
