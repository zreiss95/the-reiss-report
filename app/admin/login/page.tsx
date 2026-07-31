"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberEmail, setRememberEmail] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const savedEmail = localStorage.getItem(
      "remembered-email"
    );

    if (savedEmail) {
      setEmail(savedEmail);
      setRememberEmail(true);
    }
  }, []);


  async function login(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);


    try {

      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });


      if (error) {
        setError(
          "Invalid email or password."
        );
        return;
      }


      if (rememberEmail) {
        localStorage.setItem(
          "remembered-email",
          email
        );
      } else {
        localStorage.removeItem(
          "remembered-email"
        );
      }


      router.push("/admin");
      router.refresh();


    } catch (err) {

      console.error(
        "Login error:",
        err
      );

      setError(
        "Login failed. Please try again."
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
          Login
        </h1>


        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>
            setEmail(e.target.value)
          }
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
          onChange={(e)=>
            setPassword(e.target.value)
          }
          autoComplete="current-password"
          style={{
            width:"100%",
            padding:12,
            marginBottom:15,
            borderRadius:8,
            border:"1px solid #334155",
            boxSizing:"border-box",
          }}
        />


        <label
          style={{
            display:"flex",
            alignItems:"center",
            gap:8,
            color:"#94a3b8",
            fontSize:14,
            marginBottom:15,
          }}
        >
          <input
            type="checkbox"
            checked={rememberEmail}
            onChange={(e)=>
              setRememberEmail(
                e.target.checked
              )
            }
          />

          Remember email
        </label>


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