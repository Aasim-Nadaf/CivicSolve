import { prisma, Category } from "db";
import { compareTwoStrings } from "string-similarity";

// Haversine formula to calculate distance in meters
function getDistanceFromLatLonInM(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // Radius of the earth in m
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in m
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

const DEDUPLICATION_RADIUS_M = 50;
const NLP_SIMILARITY_THRESHOLD = 0.75;

export async function processNewReport(
  citizenId: string,
  category: Category,
  description: string,
  severityRating: number,
  latitude: number,
  longitude: number,
  photoUrl?: string
) {
  // 1. Deduplication Engine
  // Find recent canonical reports of the same category
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const potentialDuplicates = await prisma.canonicalReport.findMany({
    where: {
      category,
      created_at: { gte: thirtyDaysAgo },
    },
    include: { raw_reports: true }
  });

  let duplicateOf: string | null = null;
  let maxConfidence = 0;

  for (const canonical of potentialDuplicates) {
    const distance = getDistanceFromLatLonInM(latitude, longitude, canonical.latitude, canonical.longitude);
    
    if (distance <= DEDUPLICATION_RADIUS_M) {
      // Compare description with all raw reports in this canonical report
      let highestSimilarity = 0;
      for (const raw of canonical.raw_reports) {
        const similarity = compareTwoStrings(description, raw.description);
        if (similarity > highestSimilarity) highestSimilarity = similarity;
      }

      if (highestSimilarity >= NLP_SIMILARITY_THRESHOLD) {
        if (highestSimilarity > maxConfidence) {
          maxConfidence = highestSimilarity;
          duplicateOf = canonical.id;
        }
      }
    }
  }

  let canonicalReportId = duplicateOf;

  // 2. Persist Report
  if (canonicalReportId) {
    // Increment report count
    await prisma.canonicalReport.update({
      where: { id: canonicalReportId },
      data: {
        report_count: { increment: 1 }
      }
    });

    await prisma.rawReport.create({
      data: {
        canonical_report_id: canonicalReportId,
        citizen_id: citizenId,
        description,
        severity_rating: severityRating,
        latitude,
        longitude,
        photo_url: photoUrl,
        is_duplicate: true
      }
    });
  } else {
    // Create new canonical report
    const newCanonical = await prisma.canonicalReport.create({
      data: {
        category,
        latitude,
        longitude,
        // Calculate initial urgency score (will be recalculated anyway)
      }
    });
    canonicalReportId = newCanonical.id;

    await prisma.rawReport.create({
      data: {
        canonical_report_id: canonicalReportId,
        citizen_id: citizenId,
        description,
        severity_rating: severityRating,
        latitude,
        longitude,
        photo_url: photoUrl,
        is_duplicate: false
      }
    });
  }

  // 3. Recalculate Urgency Score
  await recalculateUrgencyScore(canonicalReportId as string);

  return { canonicalReportId, isDuplicate: !!duplicateOf, confidence: maxConfidence };
}

// Rule-Based Urgency Scoring System
export async function recalculateUrgencyScore(canonicalReportId: string) {
  const canonical = await prisma.canonicalReport.findUnique({
    where: { id: canonicalReportId },
    include: { raw_reports: true }
  });

  if (!canonical) return;

  // Weights
  const W_FREQ = 0.30;
  const W_RISK = 0.25;
  const W_SEV_CAT = 0.20;
  const W_SEV_CIT = 0.15;
  const W_TIME = 0.10;

  // 1. Report Frequency (normalize max 50 reports = 100 points)
  let freqScore = (canonical.report_count / 50) * 100;
  if (freqScore > 100) freqScore = 100;

  // 2. Location Risk (mock logic: 100 if flood zone tag exists, else 50)
  // Real implementation would intersect with GIS zones
  let riskScore = 50; 
  if (canonical.sdg_tags.includes("11") && canonical.category === "FLOOD") riskScore = 100;

  // 3. Category Severity
  let catScore = 0;
  switch (canonical.category) {
    case Category.FLOOD: catScore = 100; break;
    case Category.DRAINAGE: catScore = 80; break;
    case Category.POTHOLES: catScore = 60; break;
    case Category.STREETLIGHTS: catScore = 40; break;
    case Category.TREE_PLANTING: catScore = 20; break;
    default: catScore = 10;
  }

  // 4. Citizen Severity Rating (Average)
  const avgSev = canonical.raw_reports.reduce((acc, curr) => acc + curr.severity_rating, 0) / canonical.raw_reports.length;
  const citSevScore = (avgSev / 5) * 100;

  // 5. Time Elapsed (Older = higher score, max 30 days = 100)
  const daysElapsed = (new Date().getTime() - canonical.created_at.getTime()) / (1000 * 3600 * 24);
  let timeScore = (daysElapsed / 30) * 100;
  if (timeScore > 100) timeScore = 100;

  // Composite Score
  const totalScore = 
    (freqScore * W_FREQ) +
    (riskScore * W_RISK) +
    (catScore * W_SEV_CAT) +
    (citSevScore * W_SEV_CIT) +
    (timeScore * W_TIME);

  await prisma.canonicalReport.update({
    where: { id: canonicalReportId },
    data: { urgency_score: totalScore }
  });

  return totalScore;
}
