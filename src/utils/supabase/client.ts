
import { createBrowserClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

let client: SupabaseClient | undefined;

export const createClient = () => {
  if (client) return client;

  client = createBrowserClient(
    supabaseUrl!,
    supabaseKey!,
  );

  return client;
};
