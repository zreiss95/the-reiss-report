"use client";

type Props = {
  confidence: number;
  setConfidence: (value: number) => void;
};

export default function ConfidenceEditor({
  confidence,
  setConfidence,
}: Props) {
  return (
    <div
      style={{
        marginTop: 30,
      }}
    >
      <h2>Confidence</h2>

      <div
        style={{
          fontSize: 30,
          fontWeight: 700,
          color: "#22c55e",
          marginBottom: 12,
        }}
      >
        {confidence}%
      </div>

      <input
        type="range"
        min={50}
        max={100}
        value={confidence}
        onChange={(e) =>
          setConfidence(Number(e.target.value))
        }
        style={{
          width: "100%",
        }}
      />
    </div>
  );
}