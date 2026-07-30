"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {

  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);


  async function updatePassword(e: React.FormEvent) {

    e.preventDefault();

    setError("");
    setMessage("");


    if (!password || !confirmPassword) {
      setError("Please complete both fields.");
      return;
    }


    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }


    setLoading(true);


    const {
      error,
    } = await supabase.auth.updateUser({
      password,
    });


    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }


    setMessage(
      "Password updated successfully."
    );


    setLoading(false);


    setTimeout(() => {
      router.push("/login");
    }, 2000);

  }


  return (
    <main
      style={{
        maxWidth:400,
        margin:"100px auto",
        padding:20,
        color:"white",
      }}
    >

      <Link
        href="/login"
        style={{
          display:"inline-block",
          marginBottom:20,
          color:"#94a3b8",
          textDecoration:"none",
          fontWeight:600,
        }}
      >
        ← Back
      </Link>


      <h1
        style={{
          fontSize:32,
          marginBottom:20,
        }}
      >
        Reset Password
      </h1>


      <form onSubmit={updatePassword}>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          style={{
            width:"100%",
            padding:12,
            marginBottom:15,
            borderRadius:8,
          }}
        />


        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e)=>setConfirmPassword(e.target.value)}
          style={{
            width:"100%",
            padding:12,
            marginBottom:15,
            borderRadius:8,
          }}
        />


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
          {loading
            ? "Updating..."
            : "Update Password"}
        </button>


        {error && (
          <p style={{color:"#ef4444",marginTop:15}}>
            {error}
          </p>
        )}


        {message && (
          <p style={{color:"#4ade80",marginTop:15}}>
            {message}
          </p>
        )}

      </form>

    </main>
  );
}