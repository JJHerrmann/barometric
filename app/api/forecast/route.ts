import { NextResponse } from "next/server";

function hpaToInHg(hpa: number) {
  return hpa * 0.0295299830714;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const latRaw = Number(searchParams.get("lat"));
  const lonRaw = Number(searchParams.get("lon"));
  const hoursRaw = Number(searchParams.get("hours"));

  if (!Number.isFinite(latRaw) || !Number.isFinite(lonRaw)) {
    return NextResponse.json({ error: "Missing or invalid lat/lon." }, { status: 400 });
  }

  const lat = clamp(latRaw, -90, 90);
  const lon = clamp(lonRaw, -180, 180);
  const hours = Number.isFinite(hoursRaw) ? clamp(Math.floor(hoursRaw), 1, 48) : 24;

  try {
    const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "barometer.rook.works (contact: jacobjaredherrmann@gmail.com)",
        Accept: "application/json",
      },
      next: { revalidate: 900 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Forecast unavailable." }, { status: 502 });
    }

    const data = (await res.json()) as {
      properties?: {
        timeseries?: Array<{
          time?: string;
          data?: {
            instant?: {
              details?: {
                air_pressure_at_sea_level?: number;
              };
            };
          };
        }>;
      };
    };

    const series = data.properties?.timeseries ?? [];
    const hourly = series
      .map((entry) => {
        const t = entry.time;
        const hpa = entry.data?.instant?.details?.air_pressure_at_sea_level;
        if (!t || typeof hpa !== "number") return null;
        return { t, pressure_inhg: hpaToInHg(hpa) };
      })
      .filter(Boolean)
      .slice(0, hours) as { t: string; pressure_inhg: number }[];

    if (hourly.length === 0) {
      return NextResponse.json({ error: "Forecast unavailable." }, { status: 502 });
    }

    return NextResponse.json(
      {
        location: { lat, lon },
        generatedAt: new Date().toISOString(),
        hourly,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=900, stale-while-revalidate=900",
        },
      }
    );
  } catch {
    return NextResponse.json({ error: "Forecast unavailable." }, { status: 502 });
  }
}
