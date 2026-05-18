import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { responseId, score, notes } = body;

  if (!responseId) {
    return NextResponse.json({ error: "Response ID required" }, { status: 400 });
  }

  const updated = await prisma.response.update({
    where: { id: responseId },
    data: { score, notes },
  });

  return NextResponse.json(updated);
}
