import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
      }}
    >
      <a
  href="/admin/login"
  style={{
    color: "#94a3b8",
    textDecoration: "none",
    fontWeight: 700,
  }}
>
  Admin
</a>
      <div
        style={{
          padding: 20,
          borderBottom: "1px solid #24314f",
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/weekly-picks">Weekly Picks</Link>
        <Link href="/admin/survivor">Survivor</Link>
        <Link href="/admin/loser-survivor">Loser Survivor</Link>
        <Link href="/admin/rankings">Player Rankings</Link>
        <Link href="/admin/team-rankings">Team Rankings</Link>
        <Link href="/admin/fantasy">Fantasy ADP</Link>
      </div>

      {children}
    </main>
  );
}