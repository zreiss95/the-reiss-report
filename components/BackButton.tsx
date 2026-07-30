"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      style={{
        padding: "8px 16px",
        background: "#172036",
        color: "white",
        border: "1px solid #24314f",
        borderRadius: 8,
        cursor: "pointer",
        fontWeight: 700,
      }}
    >
      ← Back
    </button>
  );
}