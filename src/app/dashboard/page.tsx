import Link from "next/link";
import GPSMap from "@/components/Map";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zombie-bg font-sans text-zombie-text">
      <header className="w-full border-b border-zombie-border p-6 flex justify-between items-center bg-[#050505] z-10 relative">
        <h1 className="text-2xl font-bold tracking-tight text-zombie-neon">ESCAPE Z</h1>
        <div className="text-sm text-zombie-muted">
          Estado: <span className="text-zombie-neon font-bold">VIVO</span>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full flex flex-col h-[calc(100vh-80px)]">
        <div className="mb-6 flex-shrink-0">
          <h2 className="text-3xl font-bold mb-2">PANEL DEL SUPERVIVIENTE</h2>
          <p className="text-zombie-muted">Bienvenido de nuevo. Protege tu señal.</p>
        </div>

        {/* Dashboard Grid layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
          
          {/* Left Column: Comms & Team */}
          <div className="flex flex-col gap-6 lg:col-span-1 overflow-y-auto pr-2">
            {/* Empty State: No Team */}
            <div className="bg-zombie-card border border-zombie-border rounded-lg p-6 text-center shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-zombie-red" />
              
              <div className="text-4xl mb-2">⚠️</div>
              <h3 className="text-xl font-bold mb-2 text-white">SIN DATOS DE EQUIPO</h3>
              <p className="text-zombie-muted text-sm mx-auto mb-6">
                La tasa de supervivencia es del 0% en solitario.
              </p>
              
              <Link 
                href="/teams/create"
                className="inline-block px-4 py-2 bg-zombie-neon text-black font-bold text-sm rounded hover:bg-[#32e612] transition-colors w-full"
              >
                FORMAR GRUPO
              </Link>
            </div>

            <div className="border border-zombie-border rounded-lg p-6 bg-[#0a0a0a] flex-1">
              <h4 className="text-lg font-bold mb-4 flex justify-between items-center">
                <span>COMUNICACIONES DEL SISTEMA</span>
                <span className="text-[10px] text-zombie-neon bg-zombie-neon-dim px-2 py-1 rounded">EN LÍNEA</span>
              </h4>
              <div className="space-y-4 text-xs font-mono text-zombie-muted">
                <p>[SYS] Conexión establecida con el relé global.</p>
                <p>[SYS] Módulo GPS activado.</p>
                <p>[SYS] Esperando registro de equipo.</p>
                <p className="text-zombie-neon animate-pulse">_</p>
              </div>
            </div>
          </div>

          {/* Right Column: GPS Map Area */}
          <div className="border border-zombie-border rounded-lg bg-[#0a0a0a] lg:col-span-2 flex flex-col overflow-hidden min-h-[400px]">
            <div className="p-4 border-b border-zombie-border flex justify-between items-center bg-[#050505]">
              <h4 className="text-sm font-bold text-zombie-muted">ENLACE SATELLITAL</h4>
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
