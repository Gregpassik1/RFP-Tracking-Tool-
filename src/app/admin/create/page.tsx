"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Question {
  id: string;
  text: string;
  type: "text" | "textarea" | "number" | "select";
  options?: string[];
  required: boolean;
}

export default function CreateRfp() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { id: crypto.randomUUID(), text: "", type: "text", required: true },
  ]);
  const [saving, setSaving] = useState(false);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: crypto.randomUUID(), text: "", type: "text", required: true },
    ]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  const handleSubmit = async () => {
    if (!title.trim() || questions.some((q) => !q.text.trim())) return;
    setSaving(true);

    const res = await fetch("/api/rfp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, questions }),
    });

    if (res.ok) {
      router.push("/");
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-navy-700 px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center gap-4">
          <Link href="/" className="text-slate-400 hover:text-slate-100 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              New RFP
            </h1>
            <p className="mt-0.5 text-sm text-slate-400">
              Define your requirements and questions for vendors
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        {/* Basic Info */}
        <div className="card space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              RFP Title
            </label>
            <input
              className="input"
              placeholder="e.g. Ground Transportation Services — Q3 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              className="input"
              rows={3}
              placeholder="Brief overview of what you're looking for..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Questions */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Questions</h2>
            <button onClick={addQuestion} className="btn-secondary text-sm">
              + Add Question
            </button>
          </div>

          <div className="space-y-3">
            {questions.map((q, i) => (
              <div key={q.id} className="card">
                <div className="flex items-start gap-3">
                  <span className="mt-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy-700 text-xs font-semibold text-slate-300">
                    {i + 1}
                  </span>
                  <div className="flex-1 space-y-3">
                    <input
                      className="input"
                      placeholder="Enter your question..."
                      value={q.text}
                      onChange={(e) =>
                        updateQuestion(q.id, { text: e.target.value })
                      }
                    />
                    <div className="flex items-center gap-3">
                      <select
                        className="input w-auto"
                        value={q.type}
                        onChange={(e) =>
                          updateQuestion(q.id, {
                            type: e.target.value as Question["type"],
                          })
                        }
                      >
                        <option value="text">Short Text</option>
                        <option value="textarea">Long Text</option>
                        <option value="number">Number</option>
                        <option value="select">Multiple Choice</option>
                      </select>

                      <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={q.required}
                          onChange={(e) =>
                            updateQuestion(q.id, {
                              required: e.target.checked,
                            })
                          }
                          className="accent-amber-400"
                        />
                        Required
                      </label>

                      {questions.length > 1 && (
                        <button
                          onClick={() => removeQuestion(q.id)}
                          className="ml-auto text-sm text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    {q.type === "select" && (
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">
                          Options (one per line)
                        </label>
                        <textarea
                          className="input text-sm"
                          rows={3}
                          placeholder={"Option 1\nOption 2\nOption 3"}
                          value={q.options?.join("\n") || ""}
                          onChange={(e) =>
                            updateQuestion(q.id, {
                              options: e.target.value.split("\n"),
                            })
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="mt-8 flex justify-end gap-3">
          <Link href="/" className="btn-secondary">
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={saving || !title.trim()}
            className="btn-primary disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create RFP"}
          </button>
        </div>
      </main>
    </div>
  );
}
