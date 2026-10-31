import type { Metadata } from 'next';
import { getDonghua } from '@/lib/donghuaServer';
import { metadataForSlug } from '@/lib/ogMeta';
import App from '@/App';
import type { DonghuaHomeData } from '@/types';

// Catch-all so deep links like /tales-of-herding-gods/ and
// /tales-of-herding-gods-episode-01-subtitle-indonesia/ serve the app
// shell instead of a 404. The client-side router in App.tsx then reads
// the URL on load and opens the matching detail / stream view, so the
// back button steps back through views instead of exiting.
// Same per-request rendering as src/app/page.tsx (no prerender fetch).
export const dynamic = 'force-dynamic';

// Per-page link preview (Open Graph + Twitter Cards) for shared deep
// links: the title/description come from the slug, so a shared detail or
// episode link previews that title instead of the generic site title.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return metadataForSlug(slug);
}

export default async function SlugPage() {
  let initialHomeData: DonghuaHomeData | null = null;
  try {
    initialHomeData = await getDonghua('home', {});
  } catch (err) {
    console.error('Failed to load initial home data for SSR:', err);
    initialHomeData = null;
  }

  return <App initialHomeData={initialHomeData} />;
}
