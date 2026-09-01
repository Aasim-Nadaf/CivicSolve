import { NextResponse } from "next/server";
import { prisma } from "db";
import { processNewReport } from "@/lib/engine";

// EXPORT endpoint (GET)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") || "json";

  const reports = await prisma.canonicalReport.findMany({
    include: { raw_reports: true }
  });

  if (format === "csv") {
    // Basic CSV generation
    const header = "ID,Category,Score,Status,Latitude,Longitude,SDGs\n";
    const rows = reports.map((r: any) => 
      `${r.id},${r.category},${r.urgency_score},${r.status},${r.latitude},${r.longitude},"${r.sdg_tags.join(';')}"`
    ).join("\n");
    return new NextResponse(header + rows, {
      headers: { "Content-Type": "text/csv" }
    });
  }

  return NextResponse.json(reports);
}

// IMPORT endpoint (POST)
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "Expected an array of reports" }, { status: 400 });
    }

    const results = [];
    for (const report of data) {
      const res = await processNewReport(
        report.citizenId || "system-import",
        report.category,
        report.description,
        report.severityRating || 3,
        report.latitude,
        report.longitude
      );
      results.push(res);
    }

    return NextResponse.json({ success: true, processed: results.length, results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
