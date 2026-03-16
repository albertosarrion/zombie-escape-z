import Link from "next/link";

export default function CreateTeamPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zombie-bg font-sans text-zombie-text">
      <header className="w-full border-b border-zombie-border p-6 flex items-center bg-[#050505]">
        <Link href="/dashboard" className="text-zombie-muted hover:text-white mr-4 transition-colors">
          ← Back
        </Link>
        <h1 className="text-xl font-bold tracking-tight text-white">FORM GROUP</h1>
      </header>

      <main className="flex-1 p-6 flex justify-center items-center">
        <div className="w-full max-w-md bg-zombie-card border border-zombie-border rounded-lg p-8 shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-zombie-neon" />
          
          <h2 className="text-2xl font-bold text-white mb-2">REGISTER A NEW GROUP</h2>
          <p className="text-zombie-muted mb-8 text-sm">
            Create a team and share the access code with your fellow survivors so they can join you.
          </p>

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zombie-text" htmlFor="teamName">Group Name / Call Sign</label>
              <input 
                id="teamName"
                type="text" 
                className="w-full bg-[#0a0a0a] border border-zombie-border rounded p-3 text-white focus:outline-none focus:border-zombie-neon transition-colors"
                placeholder="e.g. Echo Squad"
              />
            </div>

            <button 
              type="button"
              className="w-full bg-zombie-neon text-black font-bold py-3 rounded hover:bg-[#32e612] transition-colors"
            >
              INITIALIZE GROUP
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
