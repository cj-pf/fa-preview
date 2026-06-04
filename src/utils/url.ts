// Prefix an absolute path with the site's base path (e.g. "/fa-web/" on GitHub Pages).
// Mailto, tel, and external URLs pass through unchanged.
export function url(path: string): string {
  if (!path) return import.meta.env.BASE_URL;
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;

  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const clean = path.replace(/^\/+/, '');
  return clean ? `${base}/${clean}` : `${base}/`;
}
