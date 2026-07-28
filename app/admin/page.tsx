import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "../../lib/auth/admin";
import LogoutButton from "./LogoutButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;
const cards = [
  {
    title: "🏈 Weekly Picks",
    description: "Create and edit weekly picks.",
    href: "/admin/weekly-picks",
  },
  {
    title: "🎯 Survivor",
    description: "Manage survivor selections.",
    href: "/admin/survivor",
  },
  {
    title: "💀 Loser Survivor",
    description: "Manage weekly loser survivor selections.",
    href: "/admin/loser-survivor",
  },
  {
    title: "📊 Player Rankings",
    description: "Edit QB, RB, WR and TE rankings.",
    href: "/admin/rankings",
  },
  {
    title: "🏆 Fantasy ADP",
    description: "Manage fantasy draft rankings.",
    href: "/admin/fantasy",
  },
];


export default async function AdminHome() {

  const authenticated =
    await isAdminAuthenticated();


  if (!authenticated) {
    redirect("/admin/login");
  }


  return (
    <main
      style={{
        maxWidth: 1100,
        margin: "40px auto",
        padding: 20,
        color: "white",
      }}
    >

      <h1
        style={{
          fontSize: 48,
          marginBottom: 10,
        }}
      >
        Admin Dashboard
      </h1>


      <p
        style={{
          color: "#94a3b8",
          marginBottom: 20,
        }}
      >
        The Reiss Report Administration
      </p>


      <LogoutButton />


      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(300px,1fr))",
          gap: 24,
          marginTop: 40,
        }}
      >

        {cards.map((card) => (

          <Link
            key={card.href}
            href={card.href}
            style={{
              textDecoration: "none",
              color: "white",
            }}
          >

            <div
  style={{
    background: "#172036",
    border: "1px solid #24314f",
    borderRadius: 18,
    padding: 28,
    height: 170,
    boxSizing: "border-box",
    transition: ".2s",
    cursor: "pointer",
  }}
>

              <h2
                style={{
                  marginBottom: 12,
                  fontSize: 28,
                }}
              >
                {card.title}
              </h2>


              <p
                style={{
                  color: "#94a3b8",
                  fontSize: 16,
                  lineHeight: 1.5,
                }}
              >
                {card.description}
              </p>

            </div>

          </Link>

        ))}

      </div>

    </main>
  );
}