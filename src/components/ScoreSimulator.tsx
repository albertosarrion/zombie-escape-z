"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface ScoreSimulatorProps {
  userId: string;
}

export default function ScoreSimulator({ userId }: ScoreSimulatorProps) {
  const [loading, setLoading] = useState(false);

  const handleAddPoints = async () => {
    setLoading(true);
    const supabase = createClient();
    
    // 1. Get current score
    const { data: profile } = await supabase
      .from('profiles')
      .select('score')
      .eq('id', userId)
      .single();

    const currentScore = profile?.score || 0;

    // 2. Increment score
    const { error } = await supabase
      .from('profiles')
      .update({ score: currentScore + 10 })
      .eq('id', userId);

    if (error) {
      console.error("Error updating score:", error);
    } else {
      // Force a refresh or just let real-time handle it (if implemented)
      // Since this is a server component parent, we'll just reload the page for now
      window.location.reload();
    }
    setLoading(false);
  };

  return (
    <button 
      onClick={handleAddPoints}
      disabled={loading}
      className="text-[10px] bg-zombie-neon/10 border border-zombie-neon/30 px-3 py-1 text-zombie-neon hover:bg-zombie-neon hover:text-black transition-colors uppercase font-mono rounded"
    >
      {loading ? "PROCESANDO..." : "+10 SUMINISTROS (TEST)"}
    </button>
  );
}
