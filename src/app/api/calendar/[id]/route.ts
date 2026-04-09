import { NextRequest, NextResponse } from "next/server";
import { getVenueById } from "@/lib/venues";
import { generateICS } from "@/lib/calendar";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const venue = getVenueById(id);

  if (!venue) {
    return NextResponse.json({ error: "Venue not found" }, { status: 404 });
  }

  const ics = generateICS(venue);

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${venue.id}.ics"`,
    },
  });
}
