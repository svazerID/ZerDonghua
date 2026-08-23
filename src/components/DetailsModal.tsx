import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Bookmark,
  Check,
  Film,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { DonghuaDetail, DonghuaCardItem } from '../types';
import { donghuaApi } from '../services/donghuaApi';

interface DetailsModalProps {
  slug: string;
  onClose: () => void;
  onWatchEpisode: (episodeSlug: string, title?: string) => void;
  onToggleBookmark: (item: DonghuaCardItem) => void;
  isBookmarked: (slug: string) => boolean;
}

export const DetailsModal: React.FC<DetailsModalProps> = ({
  slug,
  onClose,
  onWatchEpisode,
  onToggleBookmark,
  isBookmarked
}) => {
  const [detail, setDetail] = useState<DonghuaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);

    donghuaApi
      .getDetail(slug)
      .then((data) => {
        setDetail(data);
      })
      .catch((err) => {
        console.error('Failed to load donghua detail:', err);
        setError('Gagal memuat detail series donghua ini.');
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (!slug) return null;

  const cardItem: DonghuaCardItem = {
    title: detail?.title || slug.replace(/-/g, ' '),
    slug: slug,
    link: '',
    cover: detail?.cover || '',
    type: detail?.metadata?.['Type'] || '3D Donghua',
    status: detail?.metadata?.['Status'] || 'Ongoing'
  };

  const bookmarked = isBookmarked(slug);

  return (
    <div
      id="details-modal"
      className="fixed inset-0 z-50 bg-[#06060b]/90 backdrop-blur-2xl flex items-center sm:items-center justify-center p-2 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] sm:max-h-[90vh] rounded-3xl bg-[#0a0c10]/95 backdrop-blur-2xl border border-[#ffffff1a] shadow-[0_24px_50px_-12px_#000000bf] overflow-hidden flex flex-col my-auto text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 p-2 sm:p-2.5 rounded-full bg-[#06060b]/80 hover:bg-[#ffffff1a] text-slate-300 hover:text-white border border-[#ffffff1a] backdrop-blur-md transition-colors cursor-pointer active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="py-32 text-center text-slate-400 space-y-3">
            <div className="w-10 h-10 rounded-full border-3 border-[#a78bfa] border-t-transparent animate-spin mx-auto" />
            <p className="text-xs">Memuat informasi donghua...</p>
          </div>
        ) : error ? (
          <div className="py-24 text-center text-slate-300 p-6 space-y-3">
            <p className="text-sm text-red-400">{error}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] text-white text-xs font-semibold shadow-[0_8px_30px_#0009]"
            >
              Tutup
            </button>
          </div>
        ) : detail ? (
          <div className="overflow-y-auto max-h-[92vh] sm:max-h-[90vh] pb-6">
            {/* Top Banner / Backdrop Area */}
            <div className="relative h-36 sm:h-64 w-full overflow-hidden bg-[#06060b]">
              {detail.cover && (
                <img
                  src={detail.cover}
                  alt={detail.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover blur-sm opacity-50 scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-[#0a0c10]/60 to-black/40" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(124,58,237,0.3),transparent_70%)]" />

              {/* Badges */}
              <div className="absolute bottom-3 left-4 right-4 sm:bottom-4 sm:left-6 sm:right-6 flex flex-wrap items-center gap-1.5 sm:gap-2">
                {detail.metadata?.['Status'] && (
                  <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-semibold bg-[#00a544]/20 text-[#00a544] border border-[#00a544]/30 backdrop-blur-md">
                    {detail.metadata['Status']}
                  </span>
                )}
                {detail.metadata?.['Type'] && (
                  <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-semibold bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] text-white shadow-md border border-white/20">
                    {detail.metadata['Type']}
                  </span>
                )}
                {detail.metadata?.['Released'] && (
                  <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-medium bg-[#06060b]/60 text-slate-300 border border-[#ffffff1a] backdrop-blur-md">
                    Tahun {detail.metadata['Released']}
                  </span>
                )}
              </div>
            </div>

            {/* Content Container */}
            <div className="p-4 sm:p-8 space-y-5 sm:space-y-6">
              {/* Header Info */}
              <div className="flex flex-row gap-3.5 sm:gap-6 items-start">
                {detail.cover && (
                  <div className="relative w-24 sm:w-40 aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_24px_50px_-12px_#000000bf] border border-[#ffffff1a] shrink-0 -mt-12 sm:-mt-16 bg-[#06060b] z-10">
                    <img
                      src={detail.cover}
                      alt={detail.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="space-y-2 sm:space-y-3 flex-1 min-w-0">
                  <div>
                    <h1 className="text-lg sm:text-3xl font-bold text-white tracking-tight leading-snug">
                      {detail.title}
                    </h1>
                    {detail.metadata?.['Studio'] && (
                      <p className="text-xs sm:text-sm text-[#a78bfa] font-semibold mt-0.5 sm:mt-1">
                        Studio: {detail.metadata['Studio']}
                      </p>
                    )}
                  </div>

                  {/* Genres Chips */}
                  {detail.genres && detail.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1 sm:gap-1.5">
                      {detail.genres.map((g) => (
                        <span
                          key={g.slug || g.name}
                          className="text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-xl bg-[#ffffff1a] border border-[#ffffff1a] text-slate-300 backdrop-blur-sm"
                        >
                          {g.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
                    {detail.episodes && detail.episodes.length > 0 && (
                      <button
                        onClick={() => {
                          const firstEp = detail.episodes[detail.episodes.length - 1] || detail.episodes[0];
                          onClose();
                          onWatchEpisode(firstEp.slug, `${detail.title} - ${firstEp.title}`);
                        }}
                        className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] hover:scale-[1.02] active:scale-95 text-white font-semibold text-xs sm:text-sm shadow-[0_8px_30px_#0009] border border-white/20 transition-all cursor-pointer"
                      >
                        <Play className="w-3.5 sm:w-4 h-3.5 sm:h-4 fill-white ml-0.5" />
                        <span>Mulai Nonton Ep 1</span>
                      </button>
                    )}

                    <button
                      onClick={() => onToggleBookmark(cardItem)}
                      className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer backdrop-blur-md active:scale-95 ${
                        bookmarked
                          ? 'bg-[#7c3aed]/30 border-[#a78bfa66] text-[#a78bfa]'
                          : 'bg-[#ffffff1a] border-[#ffffff1a] hover:bg-[#ffffff26] text-slate-300 hover:text-white'
                      }`}
                    >
                      {bookmarked ? <Check className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#a78bfa]" /> : <Bookmark className="w-3.5 sm:w-4 h-3.5 sm:h-4" />}
                      <span>{bookmarked ? 'Tersimpan' : 'Bookmark'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Synopsis */}
              <div className="space-y-1.5 sm:space-y-2">
                <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                  Sinopsis & Alur Cerita
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {detail.synopsis || 'Sinopsis belum tersedia untuk series donghua ini.'}
                </p>
              </div>

              {/* Metadata Grid */}
              {detail.metadata && Object.keys(detail.metadata).length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 p-3 sm:p-4 rounded-2xl bg-[#0d1015] border border-[#ffffff1a] backdrop-blur-md text-[11px] sm:text-xs">
                  {Object.entries(detail.metadata).map(([k, v]) => (
                    <div key={k}>
                      <span className="text-slate-500 block">{k}</span>
                      <span className="font-semibold text-white line-clamp-1">{v}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Episodes List Grid */}
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#a78bfa]" />
                    Daftar Episode ({detail.episodes?.length || 0})
                  </h3>
                  <span className="text-[10px] sm:text-[11px] text-[#00a544] font-semibold">Sub Indo Lengkap</span>
                </div>

                {detail.episodes && detail.episodes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5 max-h-80 overflow-y-auto pr-1">
                    {detail.episodes.map((ep) => (
                      <button
                        key={ep.slug}
                        onClick={() => {
                          onClose();
                          onWatchEpisode(ep.slug, `${detail.title} - ${ep.title}`);
                        }}
                        className="group p-2 sm:p-2.5 rounded-xl bg-[#0d1015] hover:bg-[#0d1015] active:bg-[#7c3aed]/20 border border-[#ffffff1a] hover:border-[#a78bfa66] flex items-center justify-between gap-2 cursor-pointer transition-all backdrop-blur-sm text-left"
                      >
                        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#ffffff1a] group-hover:bg-[#7c3aed] text-slate-300 group-hover:text-white flex items-center justify-center font-bold text-[11px] sm:text-xs shrink-0 transition-colors">
                            {ep.episodeNumber || 'EP'}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-white group-hover:text-[#a78bfa] truncate">
                              {ep.title}
                            </p>
                            {ep.date && (
                              <span className="text-[10px] text-slate-500">{ep.date}</span>
                            )}
                          </div>
                        </div>

                        <Play className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#a78bfa] shrink-0" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">Belum ada episode yang terdaftar.</p>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
