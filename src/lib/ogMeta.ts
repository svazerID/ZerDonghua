import type { Metadata } from 'next';
import { OG_IMAGE, OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH, SITE_URL } from './site';

// Per-page link-preview metadata for deep links, derived from the slug
// alone (no extra upstream fetch — the slug page already fetches home
// data for SSR, and a second detail/episode fetch here would double the
// upstream calls on every deep-link visit). The preview image is the
// shared OG image; the title/description are personalized per title, so
// a shared detail/episode link shows the actual donghua instead of the
// generic site title.

const SMALL_WORDS = new Set([
  'of', 'the', 'and', 'a', 'an',
  'dan', 'di', 'ke', 'dari', 'untuk', 'dengan',
]);

function titleCaseSlug(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word, i) => {
      if (/^\d+$/.test(word)) return word;
      const lower = word.toLowerCase();
      if (i > 0 && SMALL_WORDS.has(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
}

function pageMetadata(title: string, description: string, url: string, ogType: 'article' | 'video.other'): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'ZerDonghua',
      locale: 'id_ID',
      type: ogType,
      images: [{ url: OG_IMAGE, width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}

export function metadataForSlug(slugParts: string[]): Metadata {
  const slug = slugParts.join('/');
  const url = `${SITE_URL}/${slug}`;

  // Episode deep link: <series-slug>-episode-<n>-subtitle-indonesia
  const epMatch = slug.match(/^(.*)-episode-(\d+)-subtitle-indonesia$/);
  if (epMatch) {
    const series = titleCaseSlug(epMatch[1]);
    const ep = String(Number(epMatch[2]));
    const title = `Nonton ${series} Episode ${ep} Subtitle Indonesia - ZerDonghua`;
    const description = `Streaming ${series} episode ${ep} subtitle Indonesia gratis dengan multi-server player di ZerDonghua.`;
    return pageMetadata(title, description, url, 'video.other');
  }

  // Series detail deep link: <series-slug>
  const series = titleCaseSlug(slug);
  const title = `${series} Subtitle Indonesia - ZerDonghua`;
  const description = `Nonton ${series} subtitle Indonesia gratis dengan multi-server player, update tercepat, di ZerDonghua.`;
  return pageMetadata(title, description, url, 'article');
}

export function metadataForSearch(query: string): Metadata {
  const title = `Hasil Pencarian "${query}" - ZerDonghua`;
  const description = `Cari donghua "${query}" subtitle Indonesia di ZerDonghua.`;
  return pageMetadata(title, description, `${SITE_URL}/?s=${encodeURIComponent(query)}`, 'article');
}
