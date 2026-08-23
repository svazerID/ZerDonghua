import React, { useRef } from 'react';
import { Sparkles, Play, Bookmark, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { DonghuaRecommendation, DonghuaCardItem } from '../types';

interface FeaturedRailProps {
  recommendations: DonghuaRecommendation[];
  onSelect: (slug: string) => void;
  onWatch: (slug: string, title?: string) => void;
  onToggleBookmark: (item: DonghuaCardItem) => void;
  isBookmarked: (slug: string) => boolean;
}

export const FeaturedRail: React.FC<FeaturedRailProps> = ({
  recommendations,
  onSelect,
  onWatch,
  onToggleBookmark,
  isBookmarked
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!recommendations || recommendations.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="recommendations" className="py-6 sm:py-8">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center text-white shadow-[0_0_12px_#a78bfa4d] shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Rekomendasi Pilihan Editor
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#7c3aed]/20 text-[#a78bfa] font-semibold border border-[#a78bfa66]">
                Masterpiece
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Serial donghua kultivasi & fantasi terbaik dengan rating tertinggi
            </p>
          </div>
        </div>

        {/* Scroll Control Arrows */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full bg-[#ffffff1a] hover:bg-[#ffffff26] border border-[#ffffff1a] flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer shadow"
            title="Geser ke kiri"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full bg-[#ffffff1a] hover:bg-[#ffffff26] border border-[#ffffff1a] flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer shadow"
            title="Geser ke kanan"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel (Slide ke samping) */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-4 overflow-x-auto pb-3 scroll-smooth no-scrollbar snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {recommendations.map((item, idx) => {
          const bookmarked = isBookmarked(item.slug);
          const cardItem: DonghuaCardItem = {
            title: item.title,
            slug: item.slug,
            link: item.link,
            cover: item.cover,
            type: '3D Cultivation',
            status: 'Ongoing'
          };

          return (
            <div
              key={item.slug || idx}
              onClick={() => onSelect(item.slug)}
              className="w-[290px] sm:w-[340px] md:w-[380px] shrink-0 snap-start group relative rounded-3xl bg-[#0d1015] border border-[#ffffff1a] hover:border-[#a78bfa66] p-4 transition-all duration-300 backdrop-blur-xl shadow-[0_9px_7px_#0000001a] hover:shadow-[0_24px_50px_-12px_#000000bf] flex gap-3.5 cursor-pointer overflow-hidden"
            >
              {/* Cover Image */}
              <div className="relative w-24 sm:w-28 aspect-[3/4] rounded-2xl overflow-hidden shrink-0 bg-[#06060b] border border-[#ffffff1a]">
                <img
                  src={item.cover}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] text-white shadow">
                  #{idx + 1}
                </span>
              </div>

              {/* Information Content */}
              <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#7c3aed]/20 text-[#a78bfa] border border-[#a78bfa66]">
                      3D Donghua
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#00a544]/20 text-[#00a544] border border-[#00a544]/30">
                      Sub Indo
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-white group-hover:text-[#a78bfa] transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.synopsis || 'Petualangan kultivasi epik penuh aksi dan sihir memukau.'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onWatch(item.slug, item.title);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] hover:opacity-95 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-[0_8px_30px_#0009] transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Nonton</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(cardItem);
                    }}
                    className={`p-2 rounded-xl border backdrop-blur-md transition-all cursor-pointer ${
                      bookmarked
                        ? 'bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] text-white border-[#a78bfa66] shadow-[0_0_12px_#a78bfa4d]'
                        : 'bg-[#ffffff1a] hover:bg-[#ffffff26] text-slate-300 hover:text-white border-[#ffffff1a]'
                    }`}
                    title={bookmarked ? 'Hapus Bookmark' : 'Simpan Bookmark'}
                  >
                    {bookmarked ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
