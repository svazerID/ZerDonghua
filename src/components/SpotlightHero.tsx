import React, { useState, useEffect } from 'react';
import { Play, Info, ChevronLeft, ChevronRight, Sparkles, Bookmark, Check } from 'lucide-react';
import { DonghuaRecommendation, DonghuaCardItem } from '../types';

interface SpotlightHeroProps {
  recommendations: DonghuaRecommendation[];
  onOpenDetail: (slug: string) => void;
  onWatch: (slug: string, title?: string) => void;
  onToggleBookmark: (item: DonghuaCardItem) => void;
  isBookmarked: (slug: string) => boolean;
}

export const SpotlightHero: React.FC<SpotlightHeroProps> = ({
  recommendations,
  onOpenDetail,
  onWatch,
  onToggleBookmark,
  isBookmarked
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    if (!recommendations || recommendations.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % recommendations.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [recommendations, isPaused]);

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  const current = recommendations[currentIndex] || recommendations[0];
  const bookmarked = isBookmarked(current.slug);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + recommendations.length) % recommendations.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % recommendations.length);
  };

  // Mobile touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;

    if (Math.abs(diffX) > 45) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    setTouchStartX(null);
    setIsPaused(false);
  };

  const currentCardItem: DonghuaCardItem = {
    title: current.title,
    slug: current.slug,
    link: current.link,
    cover: current.cover,
    type: '3D Donghua',
    status: 'Ongoing',
    subStatus: 'Sub Indo'
  };

  return (
    <section
      id="spotlight"
      className="w-full pt-18 sm:pt-24 pb-3 sm:pb-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        {/* Lightweight Modern Hero Banner Container */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0d1015] border border-[#ffffff1a] shadow-[0_9px_7px_#0000001a]">
          {/* Subtle Ambient Background Lighting */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img
              src={current.cover}
              alt=""
              aria-hidden="true"
              decoding="async"
              className="w-full h-full object-cover object-center opacity-25 scale-100 transition-opacity duration-500"
            />
            {/* Smooth dark overlay gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1015] via-[#0d1015]/85 to-[#0d1015]/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d1015] via-[#0d1015]/90 to-transparent" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#7c3aed]/10 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Banner Content */}
          <div className="relative z-10 p-4 sm:p-8 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-center">
              {/* Left Column: Information & Actions */}
              <div className="lg:col-span-8 space-y-3 sm:space-y-4">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-xl text-[11px] sm:text-xs font-semibold bg-[#7c3aed]/20 border border-[#a78bfa66] text-[#a78bfa]">
                    <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#a78bfa]" />
                    Rekomendasi #{currentIndex + 1}
                  </span>
                  <span className="px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-medium bg-[#ffffff1a] text-slate-300 border border-[#ffffff1a]">
                    3D Cultivation
                  </span>
                  <span className="px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-semibold bg-[#00a544]/20 text-[#00a544] border border-[#00a544]/30">
                    Sub Indo HD
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight line-clamp-2">
                  {current.title}
                </h1>

                {/* Synopsis */}
                <p className="text-sm sm:text-base text-slate-300 line-clamp-2 sm:line-clamp-3 max-w-2xl leading-relaxed">
                  {current.synopsis || 'Petualangan kultivasi epik dengan grafis animasi memukau, pertempuran jurus sihir legendaris, dan alur cerita petualangan menegangkan.'}
                </p>

                {/* Action Buttons & Navigation */}
                <div className="flex items-center gap-2 sm:gap-3 pt-1">
                  <button
                    onClick={() => onWatch(current.slug, current.title)}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] hover:scale-[1.02] active:scale-95 text-white font-semibold text-xs sm:text-sm shadow-[0_8px_30px_#0009] transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                    <span>Nonton Sekarang</span>
                  </button>

                  <button
                    onClick={() => onOpenDetail(current.slug)}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-[#ffffff1a] hover:bg-[#ffffff26] active:scale-95 text-white font-semibold text-xs sm:text-sm border border-[#ffffff26] transition-all cursor-pointer"
                  >
                    <Info className="w-4 h-4 text-[#a78bfa]" />
                    <span>Detail</span>
                  </button>

                  <button
                    onClick={() => onToggleBookmark(currentCardItem)}
                    className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border transition-all cursor-pointer active:scale-95 shrink-0 ${
                      bookmarked
                        ? 'bg-[#7c3aed]/30 border-[#a78bfa66] text-[#a78bfa]'
                        : 'bg-[#ffffff1a] hover:bg-[#ffffff26] border-[#ffffff26] text-slate-300 hover:text-white'
                    }`}
                    title={bookmarked ? 'Hapus Bookmark' : 'Simpan ke Bookmark'}
                  >
                    {bookmarked ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Right Column: Compact Poster Preview */}
              <div className="lg:col-span-4 hidden lg:flex justify-end">
                <div
                  onClick={() => onOpenDetail(current.slug)}
                  className="relative group w-52 xl:w-60 aspect-[3/4] rounded-2xl overflow-hidden border border-[#ffffff1a] hover:border-[#a78bfa66] shadow-[0_9px_7px_#0000001a] hover:shadow-[0_24px_50px_-12px_#000000bf] bg-[#0a0c10] cursor-pointer transition-all duration-300"
                >
                  <img
                    src={current.cover}
                    alt={current.title}
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-black/80 text-[#a78bfa] border border-[#ffffff1a]">
                      Rekomendasi #{currentIndex + 1}
                    </span>
                    <span className="text-[11px] font-medium text-slate-300">
                      {currentIndex + 1} / {recommendations.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Banner Bottom Controls */}
            <div className="flex items-center justify-between pt-3.5 sm:pt-4 mt-4 sm:mt-5 border-t border-[#ffffff1a]">
              {/* Slide Indicators */}
              <div className="flex items-center gap-1.5">
                {recommendations.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentIndex
                        ? 'w-6 sm:w-7 bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] shadow-[0_0_8px_#a78bfa66]'
                        : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                    title={`Ke rekomendasi ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Prev / Next Arrows */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrev}
                  className="w-7 sm:w-8 h-7 sm:h-8 rounded-xl bg-[#ffffff1a] hover:bg-[#ffffff26] active:scale-95 text-slate-300 hover:text-white border border-[#ffffff1a] flex items-center justify-center transition-colors cursor-pointer"
                  title="Sebelumnya"
                >
                  <ChevronLeft className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-7 sm:w-8 h-7 sm:h-8 rounded-xl bg-[#ffffff1a] hover:bg-[#ffffff26] active:scale-95 text-slate-300 hover:text-white border border-[#ffffff1a] flex items-center justify-center transition-colors cursor-pointer"
                  title="Selanjutnya"
                >
                  <ChevronRight className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

