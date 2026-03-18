"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    const supabase = createClient();
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Error al cerrar sesión:", error.message);
      setLoading(false);
      return;
    }

    // Redirect to home/login and refresh
    window.location.href = "/login";
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="text-xs font-bold text-zombie-red border border-zombie-red px-3 py-1 rounded hover:bg-zombie-red hover:text-black transition-colors disabled:opacity-50"
    >
      {loading ? "CERRANDO..." : "ABANDONAR SESIÓN"}
    </button>
  );
}
