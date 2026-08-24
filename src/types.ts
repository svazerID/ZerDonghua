// Cap rendered cards per rail so the homepage doesn't mount hundreds of
// poster images / DOM nodes at once (keeps scroll and memory light on mobile).
export const MAX_VISIBLE_CARDS = 30;

export interface DonghuaRecommendation {
  title: string;
  link: string;
  slug: string;
  cover: string;
  synopsis: string;
}

export interface DonghuaCardItem {
  title: string;
  seriesTitle?: string;
  link: string;
  slug: string;
  cover: string;
  episode?: string;
  subStatus?: string;
  type?: string;
  status?: string;
  hot?: boolean;
  rating?: string;
  genres?: Array<{ name: string; link: string; slug: string }>;
  rank?: number;
}

export interface DonghuaGenre {
  name: string;
  link: string;
  slug: string;
}

export interface DonghuaScheduleItem {
  title: string;
  link: string;
  slug: string;
  cover: string;
  releaseTime: string;
  episode: string;
}

export interface DonghuaEpisodeItem {
  title: string;
  link: string;
  slug: string;
  episodeNumber: string;
  date: string;
  subStatus: string;
}

export interface DonghuaDetail {
  title: string;
  cover: string;
  synopsis: string;
  metadata: Record<string, string>;
  genres: DonghuaGenre[];
  episodes: DonghuaEpisodeItem[];
  recommended: DonghuaCardItem[];
}

export interface DonghuaMirror {
  name: string;
  embedCode: string;
  streamUrl: string | null;
}

export interface DonghuaStreamData {
  title: string;
  series: {
    name: string;
    link: string;
    slug: string;
  };
  prev: string | null;
  next: string | null;
  mirrors: DonghuaMirror[];
  relatedEpisodes: Array<{
    title: string;
    link: string;
    slug: string;
    cover: string;
    postedBy: string;
    released: string;
  }>;
  recommended: DonghuaCardItem[];
}

export interface DonghuaHomeData {
  recommendations: DonghuaRecommendation[];
  popularToday: DonghuaCardItem[];
  latestRelease: DonghuaCardItem[];
  latestBlog?: any[];
  donghuaBaru?: Array<DonghuaCardItem & { episode?: string }>;
  donghuaPopular?: {
    weekly: DonghuaCardItem[];
    monthly: DonghuaCardItem[];
    allTime: DonghuaCardItem[];
  };
  genres: DonghuaGenre[];
}

export interface WatchHistoryEntry {
  slug: string;
  seriesSlug?: string;
  title: string;
  seriesTitle: string;
  cover: string;
  episodeNumber: string;
  watchedAt: number;
  progressPercent: number;
  timeRemaining?: string;
}

export interface BookmarkEntry {
  slug: string;
  title: string;
  cover: string;
  type?: string;
  status?: string;
  latestEpisode?: string;
  addedAt: number;
}
