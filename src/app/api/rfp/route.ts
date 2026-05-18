import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Create a new RFP
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, description, questions } = body;

  if (!title || !questions?.length) {
    return NextResponse.json({ error: "Title and questions required" }, { status: 400 });
  }

  const rfp = await prisma.rfp.create({
    data: { title, description, questions },
  });

  return NextResponse.json(rfp);
}

// List all RFPs
export async function GET() {
  const rfps = await prisma.rfp.findMany({
    include: { _count: { select: { responses: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(rfps);
}
