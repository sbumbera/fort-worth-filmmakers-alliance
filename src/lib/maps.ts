export function buildMapsUrl(params: { name?: string; address?: string }) {
  const q = [params.name, params.address].filter(Boolean).join(", ");
  const query = q.trim();

  if (!query) return null;

  // Works well on iOS and Android; opens user's chosen maps app
  const url = new URL("https://www.google.com/maps/search/");
  url.searchParams.set("api", "1");
  url.searchParams.set("query", query);
  return url.toString();
}
