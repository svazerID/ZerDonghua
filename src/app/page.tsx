import type { Metadata } from 'next';
import { getDonghua } from '@/lib/donghuaServer';
import { metadataForSearch } from '@/lib/ogMeta';
import App from '@/App';
import type { DonghuaHomeData } from '@/types';

// Data comes from a remote API at request time, so render per-request rather
// than trying to prerender/fetch during `next build` (which has no network).
export const dynamic = 'force-dynamic';

// Shared search links (/?s=...) preview the query; plain home visits
// keep the site-wide metadata from layout.tsx.
export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<{ s?: string | string[] }>;
}): Promise<Metadata> {
  const sp = searchParams ? await searchParams : undefined;
  const q = Array.isArray(sp?.s) ? sp.s[0] : sp?.s;
  if (!q) return {};
  return metadataForSearch(q);
}

export default async function Page() {
  let initialHomeData: DonghuaHomeData | null = null;
  try {
    initialHomeData = await getDonghua('home', {});
  } catch (err) {
    console.error('Failed to load initial home data for SSR:', err);
    initialHomeData = null;
  }

  return <App initialHomeData={initialHomeData} />;
}
