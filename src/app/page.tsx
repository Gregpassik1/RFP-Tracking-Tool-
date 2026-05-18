import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const rfps = await prisma.rfp.findMany({
    include: { _count: { select: { responses: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-navy-700 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <h1
              className="text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              RFP Portal
            </h1>
            <p className="mt-0.5 text-sm text-slate-400">
              Manage proposals &amp; vendor responses
            </p>
          </div>
          <Link href="/admin/create" className="btn-primary">
            + New RFP
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-6 py-10">
        {rfps.length === 0 ? (
          <div className="card text-center py-16">
            <p
              className="text-3xl text-slate-300"
              style={{ fontFamily: "var(--font-display)" }}
            >
              No RFPs yet
            </p>
            <p className="mt-2 text-slate-400 text-sm">
              Create your first request for proposal to get started.
            </p>
            <Link href="/admin/create" className="btn-primary mt-6 inline-block">
              Create RFP
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {rfps.map((rfp) => {
              const questions = rfp.questions as unknown as Array<Record<string, unknown>>;
              return (
                <Link
                  key={rfp.id}
                  href={`/admin/rfp/${rfp.id}`}
                  className="card flex items-center justify-between hover:border-slate-400 transition-colors block"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-semibold">{rfp.title}</h2>
                      <span
                        className={
                          rfp.status === "active"
                            ? "badge-active"
                            : "badge-closed"
                        }
                      >
                        {rfp.status}
                      </span>
                    </div>
                    {rfp.description && (
                      <p className="mt-1 text-sm text-slate-400 line-clamp-1">
                        {rfp.description}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-slate-400">
                      {questions.length} question
                      {questions.length !== 1 ? "s" : ""} &middot;{" "}
                      {rfp._count.responses} response
                      {rfp._count.responses !== 1 ? "s" : ""} &middot;{" "}
                      {new Date(rfp.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
