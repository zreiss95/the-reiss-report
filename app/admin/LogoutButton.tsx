"use client";

import { useState } from "react";

export default function LogoutButton() {

  const [loading, setLoading] = useState(false);


  async function logout() {

    try {

      setLoading(true);


      await fetch(
        "/api/admin-logout",
        {
          method: "POST",
        }
      );


      window.location.href = "/login";


    } catch (error) {

      console.error(
        "Logout failed:",
        error
      );


      setLoading(false);

    }

  }


  return (
    <button
      onClick={logout}
      disabled={loading}
      style={{
        background: "#DC2626",
        color: "white",
        border: "none",
        borderRadius: 10,
        padding: "12px 20px",
        fontWeight: 700,
        cursor: loading
          ? "not-allowed"
          : "pointer",
        opacity: loading
          ? 0.7
          : 1,
      }}
    >
      {loading
        ? "Logging out..."
        : "Logout"}
    </button>
  );

}