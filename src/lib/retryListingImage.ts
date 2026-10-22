/** A fresh source URL lets the image optimizer retry a transient upstream failure. */
export function retryImageSource(source: string, attempt: number): string {
  const hashIndex = source.indexOf("#");
  const path = hashIndex === -1 ? source : source.slice(0, hashIndex);
  const hash = hashIndex === -1 ? "" : source.slice(hashIndex);
  return `${path}${path.includes("?") ? "&" : "?"}_preview_retry=${attempt}-${Date.now()}${hash}`;
}

export function retryOptimizedImageUrl(url: string, attempt: number): string {
  const [path, query] = url.split("?", 2);
  if (path !== "/_next/image" || !query) return retryImageSource(url, attempt);
  const params = new URLSearchParams(query);
  const source = params.get("url");
  if (!source) return retryImageSource(url, attempt);
  params.set("url", retryImageSource(source, attempt));
  return `${path}?${params}`;
}
