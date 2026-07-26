import Link from "next/link";

type Props = {
  title: string;
  description: string;
  href?: string;
  disabled?: boolean;
};

export default function FeatureCard({
  title,
  description,
  href,
  disabled = false,
}: Props) {
  const card = (
    <div
      style={{
        background: "#172036",
        border: "1px solid #24314f",
        borderRadius: 16,
        padding: 24,
        height: 180,
        display: "flex",
        flexDirection: "column",
        transition: "all .2s",
        cursor: disabled ? "default" : "pointer",
      }}
    >
      <h3
  style={{
    fontSize: 28,
    fontWeight: 800,
    marginBottom: 16,
    color: "white",
  }}
>
  {title}
</h3>

<p
  style={{
    color: "#94a3b8",
    lineHeight: 1.5,
    fontSize: 16,
    flex: 1,
    margin: 0,
  }}
>
  {description}
</p>

{disabled && (
  <div
    style={{
      marginTop: 16,
      color: "#fbbf24",
      fontWeight: 700,
      fontSize: 15,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
    }}
  >
    Coming Soon
  </div>
)}
    </div>
  );

  if (disabled || !href) return card;

  return (
    <Link
      href={href}
      style={{
        textDecoration: "none",
      }}
    >
      {card}
    </Link>
  );
}