"use client";

export default function FixDefPage() {
  async function fix() {
    const res = await fetch("/api/fix-def", {
      method: "POST",
    });

    const json = await res.json();

    alert(JSON.stringify(json));
  }

  return (
    <button onClick={fix}>
      Fix DEF Rankings
    </button>
  );
}