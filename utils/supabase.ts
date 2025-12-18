import { createBrowserClient } from "@supabase/ssr";

// On crée le client Supabase qui sait gérer les cookies automatiquement
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default supabase;
