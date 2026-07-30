"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberEmail, setRememberEmail] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const savedEmail = localStorage.getItem("login_email");

    if (savedEmail) {
      setEmail(savedEmail);
      setRememberEmail(true);
    }
  }, []);


  async function login(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);


    if (!email || !password) {
      setError(
        "Please enter your email and password."
      );

      setLoading(false);
      return;
    }


    const {
      data,
      error,
    } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });


    if (error || !data.user) {
      setError(
        "Invalid email or password."
      );

      setLoading(false);
      return;
    }


    if (rememberEmail) {
      localStorage.setItem(
        "login_email",
        email
      );
    } else {
      localStorage.removeItem(
        "login_email"
      );
    }


    // Create CSRF token after successful login
    await fetch("/api/auth/csrf", {
      method: "GET",
    });


    // Check account role
    const {
      data: profile,
    } =
      await supabase
        .from("profiles")
        .select("role")
        .eq(
          "id",
          data.user.id
        )
        .single();


    if (profile?.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/account");
    }


    router.refresh();
  }


  return (
    <main
      style={{
        maxWidth: 400,
        margin: "100px auto",
        padding: 20,
        color: "white",
      }}
    >

      <Link
        href="/"
        style={{
          display: "inline-block",
          marginBottom: 20,
          color: "#94a3b8",
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        ← Back
      </Link>


      <h1
        style={{
          fontSize: 32,
          marginBottom: 20,
        }}
      >
        Login
      </h1>


      <form onSubmit={login}>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          style={{
            width:"100%",
            padding:12,
            marginBottom:15,
            borderRadius:8,
          }}
        />


        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          style={{
            width:"100%",
            padding:12,
            marginBottom:15,
            borderRadius:8,
          }}
        />


        <div
          style={{
            display:"flex",
            alignItems:"center",
            gap:8,
            marginBottom:15,
            color:"#94a3b8",
          }}
        >
          <input
            type="checkbox"
            checked={rememberEmail}
            onChange={(e)=>setRememberEmail(e.target.checked)}
          />

          <span>
            Remember email
          </span>
        </div>


        <button
          type="submit"
          disabled={loading}
          style={{
            width:"100%",
            padding:12,
            background:"#2563eb",
            color:"white",
            borderRadius:8,
            border:"none",
            fontWeight:700,
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>


        {error && (
          <p
            style={{
              color:"#ef4444",
              marginTop:15,
            }}
          >
            {error}
          </p>
        )}


      </form>


      <div
        style={{
          marginTop:25,
          textAlign:"center",
          color:"#94a3b8",
        }}
      >

        <div style={{ marginBottom:10 }}>
          <Link
            href="/forgot-password"
            style={{
              color:"#60a5fa",
              fontWeight:700,
              textDecoration:"none",
            }}
          >
            Forgot password?
          </Link>
        </div>

        Don't have an account?{" "}

        <Link
          href="/signup"
          style={{
            color:"#60a5fa",
            fontWeight:700,
            textDecoration:"none",
          }}
        >
          Create one
        </Link>

      </div>

    </main>
  );
}