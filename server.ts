import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { DonghubScraper } from './server/donghubScraper.js';
import {
  FALLBACK_HOME,
  FALLBACK_SCHEDULE,
  getFallbackDetail,
  getFallbackEpisode
} from './server/donghuaFallback.js';

const app = express();
const PORT = 3000;
const scraper = new DonghubScraper();

// In-memory cache to keep things ultra-fast and prevent hitting API on every tab switch
const cache = new Map<string, { timestamp: number; data: any }>();
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes cache

const REMOTE_API_BASE = 'https://api.alfisy.my.id/api/anime/donghub';

function getCached(key: string) {
  const item = cache.get(key);
  if (item && Date.now() - item.timestamp < CACHE_TTL_MS) {
    return item.data;
  }
  return null;
}

function setCached(key: string, data: any) {
  cache.set(key, { timestamp: Date.now(), data });
}

async function fetchFromRemoteApi(params: Record<string, string>): Promise<any> {
  const url = new URL(REMOTE_API_BASE);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  }

  const response = await fetch(url.toString(), {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
      'Accept': 'application/json, text/plain, */*'
    }
  });

  if (!response.ok) {
    throw new Error(`Remote API returned HTTP ${response.status}`);
  }

  const json = await response.json();
  if (!json || json.status === false) {
    throw new Error(json?.message || 'Remote API returned failure status');
  }

  return json.data;
}

app.use(express.json());

// API health endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Unified Donghua Router
app.all('/api/donghua', async (req: Request, res: Response) => {
  try {
    const action = (req.query.action as string) || 'home';
    const cacheKey = `donghua:${action}:${JSON.stringify(req.query)}`;

    const cached = getCached(cacheKey);
    if (cached) {
      return res.json({ status: true, fromCache: true, data: cached });
    }

    let result: any = null;

    switch (action) {
      case 'home': {
        try {
          result = await fetchFromRemoteApi({ action: 'home' });
          if (result && result.donghuaBaru && Array.isArray(result.donghuaBaru)) {
            // Enrich donghuaBaru with covers from latestRelease or recommendations if missing
            const coverMap = new Map<string, string>();
            if (result.latestRelease && Array.isArray(result.latestRelease)) {
              for (const lr of result.latestRelease) {
                if (lr.slug && lr.cover) coverMap.set(lr.slug, lr.cover);
                if (lr.title && lr.cover) coverMap.set(lr.title.toLowerCase().trim(), lr.cover);
                if (lr.seriesTitle && lr.cover) coverMap.set(lr.seriesTitle.toLowerCase().trim(), lr.cover);
              }
            }
            if (result.recommendations && Array.isArray(result.recommendations)) {
              for (const rec of result.recommendations) {
                if (rec.slug && rec.cover) coverMap.set(rec.slug, rec.cover);
                if (rec.title && rec.cover) coverMap.set(rec.title.toLowerCase().trim(), rec.cover);
              }
            }
            if (result.popularToday && Array.isArray(result.popularToday)) {
              for (const pop of result.popularToday) {
                if (pop.slug && pop.cover) coverMap.set(pop.slug, pop.cover);
                if (pop.title && pop.cover) coverMap.set(pop.title.toLowerCase().trim(), pop.cover);
              }
            }

            result.donghuaBaru = result.donghuaBaru.map((item: any) => {
              let cover = item.cover || '';
              if (!cover && item.slug && coverMap.has(item.slug)) {
                cover = coverMap.get(item.slug)!;
              }
              if (!cover && item.title) {
                const titleLower = item.title.toLowerCase().trim();
                for (const [key, val] of coverMap.entries()) {
                  if (titleLower.includes(key) || key.includes(titleLower)) {
                    cover = val;
                    break;
                  }
                }
              }
              return {
                ...item,
                cover: cover || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80',
                type: '3D Ongoing',
                status: 'Ongoing',
                subStatus: 'Sub Indo',
                hot: true
              };
            });
          }
        } catch (apiErr) {
          console.warn('Remote API getHome failed, falling back to local scraper:', apiErr);
          try {
            result = await scraper.getHome();
          } catch (scrapeErr) {
            console.warn('Local scraper getHome failed, using static fallback:', scrapeErr);
            result = FALLBACK_HOME;
          }
        }
        break;
      }
      case 'schedule': {
        try {
          result = await fetchFromRemoteApi({ action: 'schedule' });
        } catch (apiErr) {
          console.warn('Remote API getSchedule failed, falling back to local scraper:', apiErr);
          try {
            result = await scraper.getSchedule();
          } catch (scrapeErr) {
            result = FALLBACK_SCHEDULE;
          }
        }
        break;
      }
      case 'detail': {
        let slug = (req.query.slug as string) || '';
        if (!slug) {
          return res.status(400).json({ status: false, message: 'Parameter slug diperlukan untuk action detail' });
        }

        // Clean slug if full URL or trailing slash was passed
        let cleanSlug = slug.replace(/^https?:\/\/[^\/]+\//, '').replace(/\/+$/, '');

        try {
          // 1. Try to fetch detail for the provided slug
          result = await fetchFromRemoteApi({ action: 'detail', slug: cleanSlug });

          // 2. If episodes list is empty (which happens when an episode-level slug is passed like "soul-land-2-episode-167-subtitle-indonesia"),
          // resolve the parent series either via action=episode metadata or by stripping episode suffix
          if (!result || !result.episodes || result.episodes.length === 0) {
            let seriesSlugResolved: string | null = null;

            // Method A: Check action=episode for parent series info
            try {
              const epData = await fetchFromRemoteApi({ action: 'episode', slug: cleanSlug });
              if (epData?.series?.slug) {
                seriesSlugResolved = epData.series.slug;
              } else if (epData?.series?.link) {
                seriesSlugResolved = epData.series.link.replace(/^https?:\/\/[^\/]+\//, '').replace(/\/+$/, '');
              }
            } catch (e) {
              // ignore
            }

            // Method B: Regex fallback stripping "-episode-..."
            if (!seriesSlugResolved || seriesSlugResolved === cleanSlug) {
              const stripped = cleanSlug
                .replace(/-episode-\d+.*$/i, '')
                .replace(/-subtitle-indonesia.*$/i, '')
                .replace(/-sub-indo.*$/i, '');
              if (stripped && stripped !== cleanSlug) {
                seriesSlugResolved = stripped;
              }
            }

            if (seriesSlugResolved && seriesSlugResolved !== cleanSlug) {
              try {
                const seriesDetail = await fetchFromRemoteApi({ action: 'detail', slug: seriesSlugResolved });
                if (seriesDetail && seriesDetail.episodes && seriesDetail.episodes.length > 0) {
                  result = seriesDetail;
                }
              } catch (seriesErr) {
                console.warn(`Could not fetch detail for resolved series ${seriesSlugResolved}:`, seriesErr);
              }
            }
          }
        } catch (apiErr) {
          console.warn(`Remote API getDetail for ${slug} failed, falling back to local scraper:`, apiErr);
          try {
            result = await scraper.getDetail(cleanSlug);
          } catch (scrapeErr) {
            result = getFallbackDetail(cleanSlug);
          }
        }
        break;
      }
      case 'episode': {
        let slug = (req.query.slug as string) || '';
        if (!slug) {
          return res.status(400).json({ status: false, message: 'Parameter slug diperlukan untuk action episode' });
        }

        try {
          // 1. First attempt to fetch the episode directly from remote API
          result = await fetchFromRemoteApi({ action: 'episode', slug });

          // 2. If mirrors is empty (e.g. user clicked "Watch" on a series slug like "tales-of-herding-gods"),
          // auto-resolve by fetching series detail to find the latest/first episode
          if (!result || !result.mirrors || result.mirrors.length === 0) {
            try {
              const cleanSeriesSlug = slug.replace(/^https?:\/\/[^\/]+\//, '').replace(/\/+$/, '');
              const detailData = await fetchFromRemoteApi({ action: 'detail', slug: cleanSeriesSlug });
              if (detailData && detailData.episodes && detailData.episodes.length > 0) {
                const targetEp = detailData.episodes[0];
                const epSlug = targetEp.slug || targetEp.link || '';
                if (epSlug) {
                  result = await fetchFromRemoteApi({ action: 'episode', slug: epSlug });
                }
              }
            } catch (resolveErr) {
              console.warn('Could not auto-resolve series to episode:', resolveErr);
            }
          }
        } catch (apiErr) {
          console.warn(`Remote API getEpisode for ${slug} failed, falling back to local scraper:`, apiErr);
          try {
            result = await scraper.getEpisode(slug);
          } catch (scrapeErr) {
            result = getFallbackEpisode(slug);
          }
        }

        // Ensure each mirror has a valid streamUrl extracted from embedCode if missing
        if (result && result.mirrors && Array.isArray(result.mirrors)) {
          result.mirrors = result.mirrors.map((m: any) => {
            let streamUrl = m.streamUrl;
            if (!streamUrl && m.embedCode) {
              const srcMatch = m.embedCode.match(/src=["']([^"']+)["']/i);
              if (srcMatch) streamUrl = srcMatch[1];
            }
            return {
              ...m,
              streamUrl
            };
          });
        }
        break;
      }
      case 'search': {
        const query = (req.query.query as string) || '';
        const page = String(req.query.page || 1);
        if (!query) {
          return res.status(400).json({ status: false, message: 'Parameter query diperlukan untuk action search' });
        }
        try {
          result = await fetchFromRemoteApi({ action: 'search', query, page });
        } catch (apiErr) {
          console.warn(`Remote API search for ${query} failed:`, apiErr);
          try {
            result = await scraper.search(query, Number(page));
          } catch (scrapeErr) {
            const filtered = FALLBACK_HOME.popularToday.filter(
              item =>
                item.title.toLowerCase().includes(query.toLowerCase()) ||
                item.seriesTitle.toLowerCase().includes(query.toLowerCase())
            );
            result = {
              results: filtered,
              pagination: { currentPage: 1, totalPages: 1, hasNextPage: false }
            };
          }
        }
        break;
      }
      case 'genre': {
        const genre = (req.query.genre as string) || '';
        const page = String(req.query.page || 1);
        if (!genre) {
          return res.status(400).json({ status: false, message: 'Parameter genre diperlukan untuk action genre' });
        }
        try {
          result = await fetchFromRemoteApi({ action: 'genre', genre, page });
        } catch (apiErr) {
          console.warn(`Remote API getDonghuaByGenre for ${genre} failed:`, apiErr);
          try {
            result = await scraper.getDonghuaByGenre(genre, Number(page));
          } catch (scrapeErr) {
            result = {
              results: FALLBACK_HOME.popularToday,
              pagination: { currentPage: 1, totalPages: 1, hasNextPage: false }
            };
          }
        }
        break;
      }
      case 'genres': {
        try {
          result = await fetchFromRemoteApi({ action: 'genres' });
        } catch (apiErr) {
          try {
            result = await scraper.getGenres();
          } catch (scrapeErr) {
            result = FALLBACK_HOME.genres;
          }
        }
        break;
      }
      default:
        return res.status(400).json({
          status: false,
          message: `Action ${action} tidak ditemukan`
        });
    }

    if (result) {
      setCached(cacheKey, result);
    }

    return res.status(200).json({
      status: true,
      data: result
    });
  } catch (error: any) {
    console.error('API /api/donghua error:', error);
    return res.status(500).json({
      status: false,
      message: error.message || 'Terjadi kesalahan pada scraper'
    });
  }
});

// Start Express and integrate Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: 3000 },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Donghub Streaming Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
