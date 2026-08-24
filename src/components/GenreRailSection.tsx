import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { donghuaApi } from '../services/donghuaApi';
import { DonghuaCardItem } from '../types';
import { DonghuaCard } from './DonghuaCard';

interface GenreRailSectionProps {
  genreSlug: string;
  onSelect: (item: DonghuaCardItem) => void;
  onWatch: (item: DonghuaCardItem) => void;
  onToggleBookmark: (item: DonghuaCardItem) => void;
  isBookmarked: (slug: string) => boolean;
}

const genreTitle = (slug: string) =>
  slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

export const GenreRailSection: React.FC<GenreRailSectionProps> = ({
  genreSlug,
  onSelect,
  onWatch,
  onToggleBookmark,
  isBookmarked
}) => {
  const [items, setItems] = useState<DonghuaCardItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    donghuaApi
      .getDonghuaByGenre(genreSlug)
      .then((data) => {
        if (alive) setItems(data.results || []);
      })
      .catch((err) => console.error(`Failed to load genre ${genreSlug}:`, err))
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [genreSlug]);

  const handleScroll = (direction: 'left' | 'right') => {
    sliderRef.current?.scrollBy({ left: direction === 'left' ? -380 : 380, behavior: 'smooth' });
  };

  if (!loading && items.length === 0) return null;

  return (
    <section id={`genre-${genreSlug}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-2xl bg-[#7c3aed]/20 border border-[#a78bfa66] flex items-center justify-center text-[#a78bfa] shadow-[0_0_12px_#a78bfa4d] shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight truncate">
            Genre {genreTitle(genreSlug)}
          </h2>
          {!loading && items.length > 0 && (
            <span className="hidden sm:inline text-xs px-2.5 py-0.5 rounded-full bg-[#7c3aed]/20 text-[#a78bfa] font-semibold border border-[#a78bfa66] shrink-0">
              {items.length} Judul
            </span>
          )}
        </div>

        {/* Prev / Next Arrows */}
        <div className="flex items-center gap-1.5 shrink-0">
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
      </div>

      {/* Cards Slider */}
      {loading ? (
        <div className="flex gap-3 sm:gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="w-[160px] sm:w-[185px] shrink-0 aspect-[3/4.4] rounded-2xl bg-white/[0.04] border border-white/5 animate-pulse"
            />
          ))}
        </div>
      ) : (
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
      )}
    </section>
  );
};
