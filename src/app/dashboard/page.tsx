import Link from "next/link";
import GPSMap from "@/components/Map";
import LogoutButton from "@/components/LogoutButton";
import ScoreSimulator from "@/components/ScoreSimulator";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Should be handled by middleware, but safely handle here
    return null;
  }

  // Fetch profile and team data
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, team_id, is_alive, score')
    .eq('id', user.id)
    .single();

  console.log("DEBUG: Player profile fetched:", profile);

  let team = null;
  let members: any[] = [];

  if (profile?.team_id) {
    const { data: teamData } = await supabase
      .from('teams')
      .select('*')
      .eq('id', profile.team_id)
      .single();
    
    team = teamData;

    if (team) {
      const { data: memberData } = await supabase
        .from('profiles')
        .select('full_name, role, is_alive, last_location_lat, last_location_lng, score')
        .eq('team_id', team.id);
      
      members = memberData || [];
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-zombie-bg font-sans text-zombie-text">
      <header className="w-full border-b border-zombie-border p-6 flex justify-between items-center bg-[#050505] z-10 relative">
        <h1 className="text-2xl font-bold tracking-tight text-zombie-neon">ESCAPE Z</h1>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end mr-4">
            <div className="text-[10px] text-zombie-muted uppercase font-bold tracking-widest">Suministros</div>
            <div className="text-zombie-neon font-mono font-bold leading-none">{profile?.score || 0}</div>
          </div>
          <div className="text-sm text-zombie-muted hidden md:block">
            Estado: <span className={profile?.is_alive ? "text-zombie-neon font-bold" : "text-zombie-red font-bold"}>
              {profile?.is_alive ? "VIVO" : "ELIMINADO"}
            </span>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full flex flex-col h-[calc(100vh-80px)]">
        <div className="mb-6 flex-shrink-0 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold mb-2 uppercase">TERMINAL: {user.email?.split('@')[0]}</h2>
            <p className="text-zombie-muted">Módulo táctico operativo activado.</p>
          </div>
          <ScoreSimulator userId={user.id} />
        </div>

        {/* Dashboard Grid layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
          
          {/* Left Column: Comms & Team */}
          <div className="flex flex-col gap-6 lg:col-span-1 overflow-y-auto pr-2">
            
            {team ? (
              /* Team Active State */
              <div className="bg-zombie-card border border-zombie-border rounded-lg p-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-zombie-neon" />
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white uppercase">{team.name}</h3>
                  <span className="text-[10px] font-mono text-zombie-neon border border-zombie-neon px-2 py-0.5 rounded">
                    {team.access_code}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-end border-b border-zombie-border pb-1">
                    <p className="text-[10px] text-zombie-muted uppercase font-bold tracking-widest">Integrantes del Escuadrón</p>
                    <p className="text-[10px] text-zombie-neon font-mono uppercase">PTS Equipo: {team.score || 0}</p>
                  </div>
                  {members.map((member, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${member.is_alive ? "bg-zombie-neon" : "bg-zombie-red"}`} />
                        <span className="text-white">{member.full_name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] text-zombie-neon font-mono">{member.score || 0} PTS</span>
                        <span className="text-[10px] text-zombie-muted font-mono">{member.role.toUpperCase()}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-zombie-border flex gap-2">
                  <button className="flex-1 text-[10px] bg-zombie-card border border-zombie-border py-2 text-zombie-muted hover:text-white transition-colors uppercase">Abandonar</button>
                  <button className="flex-1 text-[10px] bg-zombie-card border border-zombie-border py-2 text-zombie-muted hover:text-white transition-colors uppercase">Informar</button>
                </div>
              </div>
            ) : (
              /* Empty State: No Team */
              <div className="bg-zombie-card border border-zombie-border rounded-lg p-6 text-center shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-zombie-red" />
                
                <div className="text-4xl mb-2">⚠️</div>
                <h3 className="text-xl font-bold mb-2 text-white uppercase">SIN DATOS DE EQUIPO</h3>
                <p className="text-zombie-muted text-sm mx-auto mb-6">
                  La tasa de supervivencia es del 0% en solitario. Regístrate en un escuadrón.
                </p>
                
                <Link 
                  href="/teams/create"
                  className="inline-block px-4 py-2 bg-zombie-neon text-black font-bold text-sm rounded hover:bg-[#32e612] transition-colors w-full uppercase"
                >
                  FORMAR GRUPO
                </Link>
              </div>
            )}

            <div className="border border-zombie-border rounded-lg p-6 bg-[#0a0a0a] flex-1">
              <h4 className="text-lg font-bold mb-4 flex justify-between items-center">
                <span>COMUNICACIONES</span>
                <span className="text-[10px] text-zombie-neon bg-zombie-neon-dim px-2 py-1 rounded">EN LÍNEA</span>
              </h4>
              <div className="space-y-4 text-xs font-mono text-zombie-muted">
                <p>[SYS] Conexión establecida con el relé global.</p>
                <p>[SYS] Módulo GPS activado.</p>
                <p>[SYS] {team ? `Señal de equipo '${team.name}' vinculada.` : "Esperando registro de equipo."}</p>
                <p className="text-zombie-neon animate-pulse">_</p>
              </div>
            </div>
          </div>

          {/* Right Column: GPS Map Area */}
          <div className="border border-zombie-border rounded-lg bg-[#0a0a0a] lg:col-span-2 flex flex-col overflow-hidden min-h-[400px]">
            <div className="p-4 border-b border-zombie-border flex justify-between items-center bg-[#050505]">
              <h4 className="text-sm font-bold text-zombie-muted uppercase">Mapa Táctico de Proximidad</h4>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zombie-neon opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-zombie-neon"></span>
              </span>
            </div>
            <div className="flex-1 relative bg-black">
              <GPSMap />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
