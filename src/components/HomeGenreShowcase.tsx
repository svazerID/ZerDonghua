import React, { useState, useEffect, useRef } from 'react';
import { Layers, Sparkles, ChevronLeft, ChevronRight, Rows, LayoutGrid, Play, Info, Bookmark, Check, RefreshCw } from 'lucide-react';
import { donghuaApi } from '../services/donghuaApi';
import { DonghuaCardItem } from '../types';
import { DonghuaCard } from './DonghuaCard';

interface HomeGenreShowcaseProps {
  selectedGenre: string;
  genres: Array<{ name: string; slug: string; count?: string }>;
  onSelectGenre: (slug: string) => void;
  onSelect: (item: DonghuaCardItem) => void;
  onWatch: (item: DonghuaCardItem) => void;
  onToggleBookmark: (item: DonghuaCardItem) => void;
  isBookmarked: (slug: string) => boolean;
}

export const HomeGenreShowcase: React.FC<HomeGenreShowcaseProps> = ({
  selectedGenre,
  genres,
  onSelectGenre,
  onSelect,
  onWatch,
  onToggleBookmark,
  isBookmarked
}) => {
  const [items, setItems] = useState<DonghuaCardItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('slider');
  const [hasMore, setHasMore] = useState<boolean>(true);
  const sliderRef = useRef<HTMLDivElement>(null);

  const activeGenreObj = genres.find((g) => g.slug === selectedGenre) || {
    name: selectedGenre || 'Cultivation',
    slug: selectedGenre || 'cultivation'
  };

  useEffect(() => {
    if (!selectedGenre) return;
    setLoading(true);
    donghuaApi
      .getDonghuaByGenre(selectedGenre, page)
      .then((data) => {
        setItems(data.results || []);
        setHasMore(data.pagination?.hasNextPage ?? false);
      })
      .catch((err) => console.error('Failed to load genre donghua:', err))
      .finally(() => setLoading(false));
  }, [selectedGenre, page]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!selectedGenre && items.length === 0) return null;

  return (
    <section id="genre-showcase" className="py-6 sm:py-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#7c3aed]/20 border border-[#a78bfa66] flex items-center justify-center text-[#a78bfa] shadow-[0_0_12px_#a78bfa4d] shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Koleksi Genre: {activeGenreObj.name}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#7c3aed]/20 text-[#a78bfa] font-semibold border border-[#a78bfa66]">
                {items.length} Judul
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Jelajahi serial donghua terbaik dalam kategori {activeGenreObj.name}
            </p>
          </div>
        </div>

        {/* Quick Genre Switcher & View Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Pill Switcher for popular genres */}
          <div className="flex items-center gap-1 p-1 bg-[#0a0c10] rounded-2xl border border-[#ffffff1a] overflow-x-auto no-scrollbar max-w-full">
            {['action', 'cultivation', 'fantasy', 'martial-arts', 'sci-fi', 'romance', '2d'].map((gSlug) => {
              const matched = genres.find((g) => g.slug === gSlug) || { name: gSlug, slug: gSlug };
              const isActive = selectedGenre === gSlug;
              return (
                <button
                  key={gSlug}
                  onClick={() => {
                    setPage(1);
                    onSelectGenre(gSlug);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap capitalize ${
                    isActive
                      ? 'bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] text-white shadow-[0_8px_30px_#0009] border border-white/20'
                      : 'text-slate-400 hover:text-white hover:bg-[#ffffff1a]'
                  }`}
                >
                  {matched.name}
                </button>
              );
            })}
          </div>

          {/* View Mode Toggle & Arrows */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center p-1 bg-[#0a0c10] rounded-2xl border border-[#ffffff1a]">
              <button
                onClick={() => setViewMode('slider')}
                className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                  viewMode === 'slider'
                    ? 'bg-[#7c3aed] text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Slide ke samping"
              >
                <Rows className="w-3.5 h-3.5 rotate-90" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#7c3aed] text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Tampilan Grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>

            {viewMode === 'slider' && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleScroll('left')}
                  className="w-8 h-8 rounded-xl bg-[#ffffff1a] hover:bg-[#ffffff26] active:scale-95 border border-[#ffffff1a] flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
                  title="Geser ke kiri"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleScroll('right')}
                  className="w-8 h-8 rounded-xl bg-[#ffffff1a] hover:bg-[#ffffff26] active:scale-95 border border-[#ffffff1a] flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
                  title="Geser ke kanan"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Rendering */}
      {loading ? (
        <div className="py-16 text-center text-gray-400 rounded-3xl bg-white/[0.02] border border-white/5 space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs">Memuat koleksi {activeGenreObj.name}...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="py-12 text-center text-gray-400 rounded-3xl bg-white/[0.02] border border-white/5 space-y-2">
          <p className="text-sm font-semibold">Tidak ada donghua ditemukan untuk genre ini.</p>
        </div>
      ) : viewMode === 'slider' ? (
        <div
          ref={sliderRef}
          className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item, index) => (
            <div
              key={item.slug || `${item.title}-${index}`}
              className="w-[160px] sm:w-[185px] md:w-[200px] shrink-0 snap-start"
            >
              <DonghuaCard
                item={item}
                onSelect={onSelect}
                onWatch={onWatch}
                onToggleBookmark={onToggleBookmark}
                isBookmarked={isBookmarked(item.slug)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {items.map((item, index) => (
              <DonghuaCard
                key={item.slug || `${item.title}-${index}`}
                item={item}
                onSelect={onSelect}
                onWatch={onWatch}
                onToggleBookmark={onToggleBookmark}
                isBookmarked={isBookmarked(item.slug)}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-bold border border-white/10 transition-colors"
            >
              Halaman Sebelumnya
            </button>
            <span className="text-xs text-gray-400 font-semibold px-2">
              Halaman {page}
            </span>
            <button
              disabled={!hasMore}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-bold shadow-lg shadow-cyan-950 transition-all"
            >
              Halaman Selanjutnya
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
