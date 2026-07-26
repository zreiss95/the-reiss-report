"use client";

export default function LogoutButton() {

  async function logout() {

    await fetch(
      "/api/admin-logout",
      {
        method: "POST",
      }
    );


    window.location.href =
      "/admin/login";

  }


  return (
    <button
      onClick={logout}
      style={{
        background: "#DC2626",
        color: "white",
        border: "none",
        borderRadius: 10,
        padding: "12px 20px",
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  );

}