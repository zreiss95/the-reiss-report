export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function RankingsAdmin() {
  const links = [
    {
      label: "QB Rankings",
      href: "/admin/rankings/qb",
    },
    {
      label: "RB Rankings",
      href: "/admin/rankings/rb",
    },
    {
      label: "WR Rankings",
      href: "/admin/rankings/wr",
    },
    {
      label: "TE Rankings",
      href: "/admin/rankings/te",
    },
    {
      label: "K Rankings",
      href: "/admin/rankings/k",
    },
    {
      label: "DEF Rankings",
      href: "/admin/rankings/def",
    },
  ];


  return (
    <main
      style={{
        maxWidth: 1200,
        margin: "40px auto",
        padding: 20,
        color: "white",
      }}
    >
      <h1
        style={{
          fontSize: 42,
          fontWeight: 800,
          marginBottom: 30,
        }}
      >
        Fantasy Rankings Admin
      </h1>


      <div
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            style={{
              padding: "12px 18px",
              borderRadius: 10,
              background: "#1e293b",
              color: "white",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </main>
  );
}