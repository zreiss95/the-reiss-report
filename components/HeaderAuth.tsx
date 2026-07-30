"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function HeaderAuth() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function checkUser() {
      const {
        data: {
          user,
        },
      } = await supabase.auth.getUser();

      setUser(user);
    }

    checkUser();
  }, []);

  if (user) {
    return (
      <Link href="/account">
        Account
      </Link>
    );
  }

  return (
    <Link href="/login">
      Login
    </Link>
  );
}