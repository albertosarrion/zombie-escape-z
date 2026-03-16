import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zombie-bg font-sans text-zombie-text">
      <header className="w-full border-b border-zombie-border p-6 flex justify-between items-center bg-[#050505]">
        <h1 className="text-2xl font-bold tracking-tight text-zombie-neon">ESCAPE Z</h1>
        <div className="text-sm text-zombie-muted">
          Status: <span className="text-zombie-neon font-bold">ALIVE</span>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-12 max-w-5xl mx-auto w-full">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">SURVIVOR DASHBOARD</h2>
          <p className="text-zombie-muted">Welcome back. The horde is approaching.</p>
        </div>

        {/* Empty State: No Team */}
        <div className="bg-zombie-card border border-zombie-border rounded-lg p-10 text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-zombie-red" />
          
          <div className="text-5xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold mb-4 text-white">NO TEAM ASSIGNED</h3>
          <p className="text-zombie-muted max-w-lg mx-auto mb-8">
            Survival rate is 0% when alone. You must join or create a survivor group to receive your first coordinate.
          </p>
          
          <Link 
            href="/teams/create"
            className="inline-block px-8 py-3 bg-zombie-neon text-black font-bold rounded hover:bg-[#32e612] transition-colors"
          >
            FORM A NEW GROUP
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-zombie-border rounded-lg p-6 bg-[#0a0a0a]">
            <h4 className="text-lg font-bold mb-2 flex justify-between">
              <span>SYSTEM COMMS</span>
              <span className="text-xs text-zombie-neon bg-zombie-neon-dim px-2 py-1 rounded">ONLINE</span>
            </h4>
            <div className="space-y-4 text-sm text-zombie-muted">
              <p>[SYS] Connection established to global relay.</p>
              <p>[SYS] Awaiting team registration.</p>
              <p className="opacity-50">...</p>
            </div>
          </div>
          
          <div className="border border-zombie-border rounded-lg p-6 bg-[#0a0a0a]">
            <h4 className="text-lg font-bold mb-2 text-zombie-muted">CURRENT WAYPOINT</h4>
            <div className="h-24 flex items-center justify-center border border-dashed border-zombie-border text-zombie-muted text-sm uppercase">
              Location Unknown
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
