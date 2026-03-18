"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();

    // 1. Sign up user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        }
      }
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // 2. Insert into profiles table
    if (authData.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        full_name: name,
        role: "survivor"
      });

      if (profileError) {
        console.error("Profile creation error:", profileError);
      }
    }

    // Wait for the session cookie to be fully set in the browser
    setTimeout(() => {
      // Force a hard refresh to the protected route so middleware sees the new cookie
      window.location.href = "/dashboard";
    }, 500); 
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zombie-bg font-sans p-6">
      <div className="w-full max-w-md bg-zombie-card border border-zombie-border rounded-lg p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-zombie-neon" />
        
        <h2 className="text-3xl font-bold text-zombie-text mb-2 text-center">NUEVO SUPERVIVIENTE</h2>
        <p className="text-zombie-muted text-center mb-8">Regístrate en la red de la crisis.</p>

        {error && (
          <div className="mb-6 p-3 bg-[#1a0505] border border-zombie-red rounded text-zombie-red text-sm text-center">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleRegister}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zombie-text" htmlFor="name">Nombre Completo</label>
            <input 
              id="name"
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-zombie-border rounded p-3 text-white focus:outline-none focus:border-zombie-neon transition-colors"
              placeholder="Juan Pérez"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zombie-text" htmlFor="email">Correo Electrónico</label>
            <input 
              id="email"
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-zombie-border rounded p-3 text-white focus:outline-none focus:border-zombie-neon transition-colors"
              placeholder="superviviente@ejemplo.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zombie-text" htmlFor="password">Contraseña</label>
            <input 
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-zombie-border rounded p-3 text-white focus:outline-none focus:border-zombie-neon transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-zombie-neon text-black font-bold py-3 rounded hover:bg-[#32e612] transition-colors mt-4 disabled:opacity-50"
          >
            {loading ? "Sincronizando..." : "CREAR PROTOCOLO"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-zombie-muted">
          ¿Ya te registraste? <Link href="/login" className="text-zombie-neon hover:underline">Acceder a la Terminal</Link>
        </div>
      </div>
    </div>
  );
}
