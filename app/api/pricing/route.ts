import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    success: true,
    data: { tiers: [], features: [], featureValues: [] },
  })
}

export async function POST() {
  return NextResponse.json({
    success: true,
    message: "Pricing data is managed client-side",
  })
}
