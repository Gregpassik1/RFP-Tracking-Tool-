import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import CopyLinkButton from "./CopyLinkButton";
import ScoreForm from "./ScoreForm";

export const dynamic = "force-dynamic";

interface Question {
  id: string;
  text: string;
  type: string;
}

interface Answer {
  questionId: string;
  value: string;
}

export default async function RfpDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rfp = await prisma.rfp.findUnique({
    where: { id },
    include: { responses: { orderBy: { submittedAt: "desc" } } },
  });

  if (!rfp) notFound();

  const questions = rfp.questions as unknown as Question[];

  return (
    <div className="min-h-screen">
      <header className="border-b border-navy-700 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center gap-4">
          <Link
            href="/"
            className="text-slate-400 hover:text-slate-100 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1
                className="text-2xl tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {rfp.title}
              </h1>
              <span
                className={
                  rfp.status === "active" ? "badge-active" : "badge-closed"
                }
              >
                {rfp.status}
              </span>
            </div>
            {rfp.description && (
              <p className="mt-0.5 text-sm text-slate-400">
                {rfp.description}
              </p>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* Vendor Link */}
        <div className="card flex items-center justify-between mb-8">
          <div>
            <p className="text-sm font-medium text-slate-300">
              Vendor Submission Link
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Share this link with vendors so they can submit their proposals
            </p>
          </div>
          <CopyLinkButton rfpId={rfp.id} />
        </div>

        {/* Questions summary */}
        <div className="card mb-8">
          <h2 className="text-sm font-semibold text-slate-300 mb-3">
            Questions ({questions.length})
          </h2>
          <div className="space-y-2">
            {questions.map((q, i) => (
              <div key={q.id} className="flex gap-3 text-sm">
                <span className="text-slate-400 font-mono">{i + 1}.</span>
                <span className="text-slate-200">{q.text}</span>
                <span className="text-slate-400 text-xs mt-0.5">
                  ({q.type})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Responses */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            Responses ({rfp.responses.length})
          </h2>
        </div>

        {rfp.responses.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-slate-400">
              No responses yet. Share the vendor link to start collecting
              proposals.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {rfp.responses.map((response) => {
              const answers = response.answers as unknown as Answer[];
              return (
                <div key={response.id} className="card">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {response.vendorName}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {response.vendorEmail} &middot;{" "}
                        {new Date(response.submittedAt).toLocaleString()}
                      </p>
                    </div>
                    {response.score !== null && (
                      <div className="flex items-center gap-1.5 bg-navy-800 px-3 py-1 rounded-lg">
                        <span className="text-amber-400 font-bold text-lg">
                          {response.score}
                        </span>
                        <span className="text-slate-400 text-xs">/100</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 mb-4">
                    {questions.map((q) => {
                      const answer = answers.find(
                        (a) => a.questionId === q.id
                      );
                      return (
                        <div key={q.id}>
                          <p className="text-xs font-medium text-slate-400 mb-0.5">
                            {q.text}
                          </p>
                          <p className="text-sm text-slate-100">
                            {answer?.value || "—"}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <ScoreForm responseId={response.id} currentScore={response.score} currentNotes={response.notes} />
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
