"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function CreateTeamPage() {
  const router = useRouter();
  const [teamName, setTeamName] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCode = () => {
    return "ZMB-" + Math.random().toString(36).substring(2, 6).toUpperCase() + "-" + Math.random().toString(36).substring(2, 5).toUpperCase();
  };

  const handleCreateTeam = async () => {
    if (!teamName) return setError("El nombre del equipo es obligatorio");
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("Debes iniciar sesión para crear un equipo");
      setLoading(false);
      return;
    }

    const newCode = generateCode();

    const { data, error: createError } = await supabase
      .from('teams')
      .insert({
        name: teamName,
        access_code: newCode,
        leader_id: user.id
      })
      .select()
      .single();

    if (createError) {
      setError(createError.message);
      setLoading(false);
      return;
    }

    // Update user profile with team_id
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ team_id: data.id })
      .eq('id', user.id);

    if (profileError) {
      console.error("Error linking team to profile:", profileError);
    }

    router.push("/dashboard");
  };

  const handleJoinTeam = async () => {
    if (!accessCode) return setError("Introduce un código de acceso");
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("Debes iniciar sesión para unirte a un equipo");
      setLoading(false);
      return;
    }

    // Find team by code
    const { data: team, error: findError } = await supabase
      .from('teams')
      .select('id')
      .eq('access_code', accessCode.toUpperCase())
      .single();

    if (findError || !team) {
      setError("Código de acceso no válido o equipo no encontrado");
      setLoading(false);
      return;
    }

    // Update user profile with team_id
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ team_id: team.id })
      .eq('id', user.id);

    if (profileError) {
      setError("No se pudo unir al equipo: " + profileError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zombie-bg font-sans p-6">
      <div className="w-full max-w-lg bg-zombie-card border border-zombie-border rounded-lg p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 w-full h-1 bg-zombie-neon" />
        
        <div className="mb-6 flex items-center justify-between">
          <Link href="/dashboard" className="text-zombie-muted hover:text-white text-sm flex items-center gap-2 transition-colors">
            <span>←</span> Volver
          </Link>
          <span className="text-xs font-mono text-zombie-neon bg-zombie-neon-dim px-2 py-1 rounded">RED SEGURA</span>
        </div>

        <h2 className="text-3xl font-bold text-white mb-2">FORMAR GRUPO</h2>
        <p className="text-zombie-muted mb-8">
          Inicia un nuevo escuadrón o únete a un grupo de supervivientes existente usando su código de acceso.
        </p>

        {error && (
          <div className="mb-6 p-3 bg-[#1a0505] border border-zombie-red rounded text-zombie-red text-sm text-center">
            {error}
          </div>
        )}

        {/* Tabs / Actions */}
        <div className="space-y-8">
          
          {/* Create Team Form */}
          <div className="p-6 border border-zombie-border rounded-lg bg-[#0a0a0a]">
            <h3 className="text-xl font-bold text-zombie-neon mb-4">INICIAR NUEVO ESCUADRÓN</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zombie-text" htmlFor="teamName">Nombre del Grupo</label>
                <input 
                  id="teamName"
                  type="text" 
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full bg-black border border-zombie-border rounded p-3 text-white focus:outline-none focus:border-zombie-neon transition-colors"
                  placeholder="Ej: Los Caminantes"
                />
              </div>
              <button 
                type="button"
                disabled={loading}
                onClick={handleCreateTeam}
                className="w-full bg-zombie-card border border-zombie-neon text-zombie-neon font-bold py-3 rounded hover:bg-zombie-neon hover:text-black transition-colors disabled:opacity-50"
              >
                {loading ? "PROCESANDO..." : "CREAR Y GENERAR CÓDIGO"}
              </button>
            </div>
          </div>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-zombie-border"></div>
            <span className="flex-shrink-0 mx-4 text-zombie-muted text-sm font-bold">O</span>
            <div className="flex-grow border-t border-zombie-border"></div>
          </div>

          {/* Join Team Form */}
          <div className="p-6 border border-zombie-border rounded-lg bg-[#0a0a0a]">
            <h3 className="text-xl font-bold text-white mb-4">UNIRSE A GRUPO EXISTENTE</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zombie-text" htmlFor="code">Código de Acceso del Escuadrón</label>
                <input 
                  id="code"
                  type="text" 
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="w-full bg-black border border-zombie-border rounded p-3 text-white focus:outline-none focus:border-zombie-neon transition-colors font-mono uppercase"
                  placeholder="ZMB-1234-XYZ"
                />
              </div>
              <button 
                type="button"
                disabled={loading}
                onClick={handleJoinTeam}
                className="w-full bg-zombie-muted text-black font-bold py-3 rounded hover:bg-white transition-colors disabled:opacity-50"
              >
                {loading ? "VERIFICANDO..." : "SOLICITAR UNIÓN"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
