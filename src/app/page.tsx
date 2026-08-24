import { getDonghua } from '@/lib/donghuaServer';
import App from '@/App';
import type { DonghuaHomeData } from '@/types';

// Data comes from a remote API at request time, so render per-request rather
// than trying to prerender/fetch during `next build` (which has no network).
export const dynamic = 'force-dynamic';

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
