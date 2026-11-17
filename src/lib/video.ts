/**
 * Converteix enllaços de vídeo (YouTube, Vimeo) al format "embed" que es pot
 * incrustar en un <iframe>. Les URLs normals de YouTube (watch?v=, youtu.be)
 * no es poden incrustar i el navegador rebutja la connexió.
 */
export function toEmbedUrl(url: string): string {
  if (!url) return url;
  const u = url.trim();

  // YouTube: watch, youtu.be, shorts, live o ja embed → ID d'11 caràcters.
  const yt = u.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );
  if (yt) {
    return `https://www.youtube.com/embed/${yt[1]}`;
  }

  // Vimeo: vimeo.com/123456789 o player.vimeo.com/video/123456789
  const vimeo = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) {
    return `https://player.vimeo.com/video/${vimeo[1]}`;
  }

  // Si ja és un enllaç embed o un host desconegut, el deixem tal qual.
  return u;
}
