import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zombie-bg text-zombie-text font-sans p-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(57,255,20,0.05)_0%,rgba(0,0,0,1)_70%)] pointer-events-none" />
      
      <main className="flex flex-col items-center justify-center w-full max-w-2xl z-10 text-center space-y-8">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-zombie-neon drop-shadow-[0_0_15px_rgba(57,255,20,0.5)]">
          ESCAPE ROOM Z
        </h1>
        
        <p className="text-xl md:text-2xl text-zombie-muted max-w-lg">
          The outbreak has started. Your survival depends on teamwork, speed, and real-time tracking.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-8">
          <Link 
            href="/login"
            className="px-8 py-4 bg-zombie-card border border-zombie-border rounded hover:bg-[#1f1f1f] hover:border-zombie-neon transition-all duration-300 text-lg font-medium shadow-[0_4px_14px_0_rgba(0,0,0,0.39)] hover:shadow-[0_0_15px_rgba(57,255,20,0.3)]"
          >
            LOGIN
          </Link>
          <Link 
            href="/register"
            className="px-8 py-4 bg-zombie-neon text-black rounded hover:bg-[#32e612] transition-colors duration-300 text-lg font-bold shadow-[0_0_15px_rgba(57,255,20,0.4)]"
          >
            REGISTER SURVIVOR
          </Link>
        </div>
      </main>

      <footer className="absolute bottom-6 text-zombie-border text-sm">
        v0.2.0 • Zombie Survival Tracking System
      </footer>
    </div>
  );
}
