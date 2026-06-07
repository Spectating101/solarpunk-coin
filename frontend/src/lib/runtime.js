/** Resolve public assets for GitHub Pages (base ./) and local dev. */
export function runtimeAssetUrl(filename) {
  const base = import.meta.env.BASE_URL || '/';
  return `${base}${filename}`.replace(/\/{2,}/g, '/').replace(':/', '://');
}

export async function loadSpkV1Runtime() {
  const url = runtimeAssetUrl('spk_v1.json');
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not load ${url} (${response.status})`);
  }
  return response.json();
}
