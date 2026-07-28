const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

export const getSupabaseUserId = async (authorization?: string) => {
  if (!supabaseUrl || !supabaseKey || !authorization?.startsWith("Bearer ")) return null;
  const response = await fetch(`${supabaseUrl}/auth/v1/user`, { headers: { apikey: supabaseKey, Authorization: authorization } });
  if (!response.ok) return null;
  const user = await response.json() as { id?: string };
  return user.id || null;
};

export const supabaseRequest = async <T = unknown>(path: string, options: RequestInit = {}) => {
  if (!supabaseUrl || !supabaseKey) throw new Error("Supabase is not configured.");
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...options,
    headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, "Content-Type": "application/json", ...(options.headers || {}) },
  });
  if (!response.ok) throw new Error(`Supabase request failed with status ${response.status}.`);
  const text = await response.text();
  return (text ? JSON.parse(text) : null) as T;
};

export const insertSupabaseRow = async (table: string, payload: Record<string, unknown>) => {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase is not configured.");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Supabase insert failed with status ${response.status}.`);
  }
};
