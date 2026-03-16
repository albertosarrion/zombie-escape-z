import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zombie-bg font-sans p-6">
      <div className="w-full max-w-md bg-zombie-card border border-zombie-border rounded-lg p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 w-full h-1 bg-zombie-neon" />
        
        <h2 className="text-3xl font-bold text-zombie-text mb-2 text-center">ACCESS TERMINAL</h2>
        <p className="text-zombie-muted text-center mb-8">Enter your credentials to continue.</p>

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zombie-text" htmlFor="email">Email Address</label>
            <input 
              id="email"
              type="email" 
              className="w-full bg-[#0a0a0a] border border-zombie-border rounded p-3 text-white focus:outline-none focus:border-zombie-neon transition-colors"
              placeholder="survivor@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zombie-text" htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              className="w-full bg-[#0a0a0a] border border-zombie-border rounded p-3 text-white focus:outline-none focus:border-zombie-neon transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="button"
            className="w-full bg-zombie-neon text-black font-bold py-3 rounded hover:bg-[#32e612] transition-colors"
          >
            AUTHORIZE
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-zombie-muted">
          Don't have an access code? <Link href="/register" className="text-zombie-neon hover:underline">Register here</Link>
        </div>
      </div>
    </div>
  );
}
