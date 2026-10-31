// Normalization shared by the server route and the client API layer, because
// episode data can arrive through either path.
//
// The embed snippet carries the authoritative, complete URL. The API's
// streamUrl is sometimes truncated (e.g. Dailymotion video id cut off)
// and HTML-entity encoded (&amp;), which breaks when set as iframe.src.
//
// Dailymotion URLs are normalized to the source's geo player form,
// geo.dailymotion.com/player/xid0t.html?video=<id> (xid0t is the player id
// anichin serves for every episode). The old canonical form,
// www.dailymotion.com/embed/video/<id>, must NOT be used: verified
// 2026-10-31, it renders a black "Forbidden" frame for these videos, while
// the geo xid0t player loads its UI. Referer spoofing does not rescue the
// www form (403 with an anichin referer too).

export interface MirrorLike {
  name?: string;
  streamUrl?: string | null;
  embedCode?: string;
}

export function normalizeMirrors<T extends MirrorLike>(mirrors: T[]): T[] {
  const normalized = (mirrors || [])
    // Keep only actual video embeds — drop chat widgets, trackers, ads.
    .filter((m: any) => {
      const src = String(m.streamUrl || '') + String(m.embedCode || '');
      return !/cbox\.ws|disqus|facebook\.com\/plugins|addthis/i.test(src);
    })
    .map((m: any) => {
    let streamUrl = m.streamUrl || '';
    if (m.embedCode) {
      const srcMatch = m.embedCode.match(/src=["']([^"']+)["']/i);
      if (srcMatch) streamUrl = srcMatch[1];
    }
    streamUrl = String(streamUrl).replace(/&amp;/g, '&');

    const dmId =
      streamUrl.match(/dailymotion\.com\/(?:embed\/)?video\/([A-Za-z0-9]+)/i)?.[1] ||
      streamUrl.match(/[?&]video=([A-Za-z0-9]+)/i)?.[1] ||
      streamUrl.match(/dai\.ly\/([A-Za-z0-9]+)/i)?.[1];
    if (dmId && /dailymotion|dai\.ly/i.test(streamUrl)) {
      streamUrl = `https://geo.dailymotion.com/player/xid0t.html?video=${dmId}`;
    }

    return { ...m, streamUrl };
  });

  // Sort ad-free mirrors first. Anichin labels ad-bearing servers with "[Ads]".
  normalized.sort((a, b) => {
    const aHasAds = /\[ads\]/i.test((a.name || '').toString());
    const bHasAds = /\[ads\]/i.test((b.name || '').toString());
    return (aHasAds ? 1 : -1) - (bHasAds ? 1 : -1);
  });

  return normalized;
}
