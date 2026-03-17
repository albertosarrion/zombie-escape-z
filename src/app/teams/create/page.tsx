import Link from "next/link";

export default function CreateTeamPage() {
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
                  className="w-full bg-black border border-zombie-border rounded p-3 text-white focus:outline-none focus:border-zombie-neon transition-colors"
                  placeholder="Ej: Los Caminantes"
                />
              </div>
              <button 
                type="button"
                className="w-full bg-zombie-card border border-zombie-neon text-zombie-neon font-bold py-3 rounded hover:bg-zombie-neon hover:text-black transition-colors"
              >
                CREAR Y GENERAR CÓDIGO
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
                  className="w-full bg-black border border-zombie-border rounded p-3 text-white focus:outline-none focus:border-zombie-neon transition-colors font-mono uppercase"
                  placeholder="ZMB-1234-XYZ"
                />
              </div>
              <button 
                type="button"
                className="w-full bg-zombie-muted text-black font-bold py-3 rounded hover:bg-white transition-colors"
              >
                SOLICITAR UNIÓN
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
