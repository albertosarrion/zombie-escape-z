import { createClient } from "@/lib/supabase/server";

export default async function Page() {
    const supabase = await createClient();
    const { data: profiles, error } = await supabase.from('profiles').select('*').limit(5);
    
    return (
        <pre>{JSON.stringify({ profiles, error }, null, 2)}</pre>
    );
}
