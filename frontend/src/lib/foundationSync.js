const DEFAULT_API = 'http://127.0.0.1:8787';

function apiBase() {
  const fromEnv = import.meta.env.VITE_SPK_API_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  if (import.meta.env.DEV) return DEFAULT_API;
  return null;
}

/** Ask local spk-v1-api to sync chain → runtime → foundation (dev only unless VITE_SPK_API_URL set). */
export async function requestFoundationSync() {
  const base = apiBase();
  if (!base) return { ok: false, skipped: true };

  try {
    const res = await fetch(`${base}/v1/foundation/sync`, { method: 'POST' });
    if (!res.ok) return { ok: false, status: res.status };
    return { ok: true, data: await res.json() };
  } catch {
    return { ok: false, skipped: true };
  }
}
