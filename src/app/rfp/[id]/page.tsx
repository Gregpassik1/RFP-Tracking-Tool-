import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import VendorForm from "./VendorForm";

export const dynamic = "force-dynamic";

interface Question {
  id: string;
  text: string;
  type: string;
  options?: string[];
  required: boolean;
}

export default async function RfpPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rfp = await prisma.rfp.findUnique({ where: { id } });

  if (!rfp) notFound();

  if (rfp.status === "closed") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="card text-center max-w-md">
          <h1
            className="text-3xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            RFP Closed
          </h1>
          <p className="mt-2 text-slate-400">
            This request for proposal is no longer accepting responses.
          </p>
        </div>
      </div>
    );
  }

  const questions = rfp.questions as Question[];

  return (
    <div className="min-h-screen">
      <header className="border-b border-navy-700 px-6 py-6">
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">
            Request for Proposal
          </p>
          <h1
            className="text-3xl tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {rfp.title}
          </h1>
          {rfp.description && (
            <p className="mt-2 text-slate-400">{rfp.description}</p>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-10">
        <VendorForm rfpId={rfp.id} questions={questions} />
      </main>
    </div>
  );
}
