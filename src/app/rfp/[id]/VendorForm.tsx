"use client";

import { useState } from "react";

interface Question {
  id: string;
  text: string;
  type: string;
  options?: string[];
  required: boolean;
}

export default function VendorForm({
  rfpId,
  questions,
}: {
  rfpId: string;
  questions: Question[];
}) {
  const [vendorName, setVendorName] = useState("");
  const [vendorEmail, setVendorEmail] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const updateAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (!vendorName.trim() || !vendorEmail.trim()) return;

    const missing = questions
      .filter((q) => q.required)
      .some((q) => !answers[q.id]?.trim());
    if (missing) return;

    setSubmitting(true);

    const res = await fetch(`/api/rfp/${rfpId}/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vendorName,
        vendorEmail,
        answers: questions.map((q) => ({
          questionId: q.id,
          value: answers[q.id] || "",
        })),
      }),
    });

    if (res.ok) {
      setSubmitted(true);
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="card text-center py-16">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600/20 mb-4">
          <svg
            className="w-7 h-7 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2
          className="text-2xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Response Submitted
        </h2>
        <p className="mt-2 text-slate-400 text-sm">
          Thank you for your proposal. We&apos;ll be in touch.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Vendor Info */}
      <div className="card space-y-4">
        <h2 className="text-sm font-semibold text-slate-300">
          Your Information
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Company / Name *
            </label>
            <input
              className="input"
              placeholder="Acme Corp"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Email *
            </label>
            <input
              className="input"
              type="email"
              placeholder="contact@acme.com"
              value={vendorEmail}
              onChange={(e) => setVendorEmail(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Questions */}
      {questions.map((q, i) => (
        <div key={q.id} className="card">
          <label className="block text-sm font-medium text-slate-200 mb-2">
            <span className="text-amber-400 font-mono mr-2">{i + 1}.</span>
            {q.text}
            {q.required && <span className="text-red-400 ml-1">*</span>}
          </label>

          {q.type === "textarea" ? (
            <textarea
              className="input"
              rows={4}
              placeholder="Your response..."
              value={answers[q.id] || ""}
              onChange={(e) => updateAnswer(q.id, e.target.value)}
            />
          ) : q.type === "number" ? (
            <input
              className="input w-48"
              type="number"
              placeholder="0"
              value={answers[q.id] || ""}
              onChange={(e) => updateAnswer(q.id, e.target.value)}
            />
          ) : q.type === "select" && q.options ? (
            <select
              className="input w-auto"
              value={answers[q.id] || ""}
              onChange={(e) => updateAnswer(q.id, e.target.value)}
            >
              <option value="">Select an option...</option>
              {q.options
                .filter((o) => o.trim())
                .map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
            </select>
          ) : (
            <input
              className="input"
              placeholder="Your response..."
              value={answers[q.id] || ""}
              onChange={(e) => updateAnswer(q.id, e.target.value)}
            />
          )}
        </div>
      ))}

      {/* Submit */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSubmit}
          disabled={submitting || !vendorName.trim() || !vendorEmail.trim()}
          className="btn-primary text-base px-8 py-3 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Proposal"}
        </button>
      </div>
    </div>
  );
}
