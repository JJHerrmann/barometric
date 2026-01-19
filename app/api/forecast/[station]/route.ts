import { NextResponse } from "next/server";
import { getLocationByIcao } from "@/lib/mlid";

function normalizeIcao(raw: string) {
  return raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
}

function hpaToInHg(hpa: number) {
  return hpa * 0.0295299830714;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export async function GET(req: Request, { params }: { params: { station: string } }) {
  const station = normalizeIcao(params.station);
  if (!station || station.length < 3) {
    console.error("Forecast request missing station.");
    return NextResponse.json({ station, points: [] });
  }

  const location = getLocationByIcao(station);
  const lat = location?.lat ?? null;
  const lon = location?.lon ?? null;

  if (typeof lat !== "number" || typeof lon !== "number") {
    console.error(`Forecast location unavailable for station ${station}.`);
    return NextResponse.json({ station, points: [] });
  }

  const { searchParams } = new URL(req.url);
  const hoursRaw = Number(searchParams.get("hours"));
  const hours = Number.isFinite(hoursRaw) ? clamp(Math.floor(hoursRaw), 1, 48) : 12;

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=pressure_msl&forecast_hours=${hours}&timezone=UTC`;
    const res = await fetch(url, { next: { revalidate: 900 } });

    if (!res.ok) {
      console.error(`Forecast fetch failed for ${station}: ${res.status}`);
      return NextResponse.json({ station, points: [] });
    }

    const data = (await res.json()) as {
      hourly?: {
        time?: string[];
        pressure_msl?: number[];
      };
    };

    const times = data.hourly?.time ?? [];
    const pressures = data.hourly?.pressure_msl ?? [];
    const points = times
      .map((t, idx) => {
        const hpa = pressures[idx];
        if (!t || typeof hpa !== "number") return null;
        return { t, pressure_inhg: hpaToInHg(hpa) };
      })
      .filter(Boolean) as { t: string; pressure_inhg: number }[];

    return NextResponse.json(
      {
        station,
        location: { lat, lon },
        generatedAt: new Date().toISOString(),
        points,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=900, stale-while-revalidate=900",
        },
      }
    );
  } catch (err) {
    console.error(`Forecast error for ${station}:`, err);
    return NextResponse.json({ station, points: [] });
  }
}
