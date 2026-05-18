"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ScoreForm({
  responseId,
  currentScore,
  currentNotes,
}: {
  responseId: string;
  currentScore: number | null;
  currentNotes: string | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState(currentScore?.toString() || "");
  const [notes, setNotes] = useState(currentNotes || "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await fetch(`/api/rfp/score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        responseId,
        score: score ? parseInt(score) : null,
        notes,
      }),
    });
    setSaving(false);
    setOpen(false);
    router.refresh();
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-amber-400 hover:text-amber-300 font-medium"
      >
        {currentScore !== null ? "Edit Score" : "Score this response"}
      </button>
    );
  }

  return (
    <div className="flex items-end gap-3 pt-3 border-t border-navy-700">
      <div>
        <label className="block text-xs text-slate-400 mb-1">
          Score (0–100)
        </label>
        <input
          type="number"
          min="0"
          max="100"
          className="input w-24"
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />
      </div>
      <div className="flex-1">
        <label className="block text-xs text-slate-400 mb-1">Notes</label>
        <input
          className="input"
          placeholder="Optional notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <button onClick={save} disabled={saving} className="btn-primary">
        {saving ? "..." : "Save"}
      </button>
      <button onClick={() => setOpen(false)} className="btn-secondary">
        Cancel
      </button>
    </div>
  );
}
