"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Credenciales incorrectas o red caída. Inténtalo de nuevo.");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 500);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zombie-bg font-sans p-6">
      <div className="w-full max-w-md bg-zombie-card border border-zombie-border rounded-lg p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-zombie-neon" />
        
        <h2 className="text-3xl font-bold text-zombie-text mb-2 text-center">TERMINAL DE ACCESO</h2>
        <p className="text-zombie-muted text-center mb-8">Introduce tus credenciales para continuar.</p>

        {error && (
          <div className="mb-6 p-3 bg-[#1a0505] border border-zombie-red rounded text-zombie-red text-sm text-center">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
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
            className="w-full bg-zombie-neon text-black font-bold py-3 rounded hover:bg-[#32e612] transition-colors disabled:opacity-50"
          >
            {loading ? "VERIFICANDO..." : "AUTORIZAR"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-zombie-muted">
          ¿No tienes un código de acceso? <Link href="/register" className="text-zombie-neon hover:underline">Regístrate aquí</Link>
        </div>
      </div>
    </div>
  );
}
