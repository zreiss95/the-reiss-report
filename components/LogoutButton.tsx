"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await supabase.auth.signOut();

    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      style={{
        marginTop:30,
        width:"100%",
        padding:12,
        background:"#dc2626",
        color:"white",
        borderRadius:8,
        border:"none",
        fontWeight:700,
        cursor:"pointer",
      }}
    >
      Logout
    </button>
  );
}