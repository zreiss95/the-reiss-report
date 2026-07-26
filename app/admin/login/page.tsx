"use client";

import { useState } from "react";

export default function AdminLogin() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  async function login(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);


    try {

      const res = await fetch(
        "/api/admin-login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );


      const data = await res.json();



      if (!res.ok) {

        setError(
          data.message ||
          "Invalid username or password"
        );

        return;
      }



      // Full browser reload so the new cookie is recognized
      window.location.assign("/admin");


    } catch (err) {

      console.error(
        "Login error:",
        err
      );

      setError(
        "Login failed. Try again."
      );


    } finally {

      setLoading(false);

    }

  }


  return (
    <main
      style={{
        maxWidth:400,
        margin:"100px auto",
        color:"white",
        padding:20,
      }}
    >

      <form onSubmit={login}>

        <h1
          style={{
            fontSize:32,
            marginBottom:20,
          }}
        >
          Admin Login
        </h1>


        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
          autoComplete="username"
          style={{
            width:"100%",
            padding:12,
            marginBottom:15,
            borderRadius:8,
            border:"1px solid #334155",
            boxSizing:"border-box",
          }}
        />


        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          autoComplete="current-password"
          style={{
            width:"100%",
            padding:12,
            borderRadius:8,
            border:"1px solid #334155",
            boxSizing:"border-box",
          }}
        />


        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop:20,
            width:"100%",
            padding:12,
            background:"#2563eb",
            color:"white",
            borderRadius:8,
            border:"none",
            fontWeight:700,
            cursor:loading
              ? "not-allowed"
              : "pointer",
            opacity:loading ? .7 : 1,
          }}
        >
          {loading
            ? "Logging in..."
            : "Login"}
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

    </main>
  );
}