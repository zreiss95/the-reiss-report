"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function SignupPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);


  async function signup(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email || !password || !confirmPassword) {
      setError("Please complete all fields.");
      return;
    }


    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }


    setLoading(true);


    const {
      error,
    } = await supabase.auth.signUp({
      email,
      password,
    });


    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }


    setMessage(
      "Account created. Please check your email to confirm your account."
    );


    setLoading(false);
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
        href="/"
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
        Create Account
      </h1>


      <form onSubmit={signup}>


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


        <input
          type="password"
          placeholder="Confirm Password"
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
          {loading ? "Creating..." : "Create Account"}
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


        {message && (
          <p
            style={{
              color:"#4ade80",
              marginTop:15,
            }}
          >
            {message}
          </p>
        )}

      </form>


      <p
  style={{
    marginTop:20,
    color:"#94a3b8",
    textAlign:"center",
  }}
>
  Already have an account?{" "}
  <Link
    href="/login"
    style={{
      display:"inline-block",
      marginLeft:6,
      padding:"6px 12px",
      borderRadius:8,
      background:"#2563eb",
      color:"white",
      textDecoration:"none",
      fontWeight:700,
    }}
  >
    Login
  </Link>
</p>


    </main>
  );
}