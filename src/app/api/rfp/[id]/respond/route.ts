import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { vendorName, vendorEmail, answers } = body;

  if (!vendorName || !vendorEmail || !answers) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Verify RFP exists and is active
  const rfp = await prisma.rfp.findUnique({ where: { id } });
  if (!rfp) {
    return NextResponse.json({ error: "RFP not found" }, { status: 404 });
  }
  if (rfp.status === "closed") {
    return NextResponse.json({ error: "RFP is closed" }, { status: 400 });
  }

  const response = await prisma.response.create({
    data: { rfpId: id, vendorName, vendorEmail, answers },
  });

  return NextResponse.json(response);
}
