"use client";

import { useState } from "react";

export default function CopyLinkButton({ rfpId }: { rfpId: string }) {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    const url = `${window.location.origin}/rfp/${rfpId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={copyLink} className="btn-primary whitespace-nowrap">
      {copied ? "Copied!" : "Copy Link"}
    </button>
  );
}
