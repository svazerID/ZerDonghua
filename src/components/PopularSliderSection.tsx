import React, { useRef, useState } from 'react';
import { Flame, Trophy, Star, Crown, TrendingUp, ChevronLeft, ChevronRight, LayoutGrid, Rows } from 'lucide-react';
import { DonghuaCardItem } from '../types';
import { DonghuaCard } from './DonghuaCard';

interface PopularSliderSectionProps {
  popularToday: DonghuaCardItem[];
  donghuaPopular?: {
    weekly: DonghuaCardItem[];
    monthly: DonghuaCardItem[];
    allTime: DonghuaCardItem[];
  };
  onSelect: (item: DonghuaCardItem) => void;
  onWatch: (item: DonghuaCardItem) => void;
  onToggleBookmark: (item: DonghuaCardItem) => void;
  isBookmarked: (slug: string) => boolean;
}

export const PopularSliderSection: React.FC<PopularSliderSectionProps> = ({
  popularToday,
  donghuaPopular,
  onSelect,
  onWatch,
  onToggleBookmark,
  isBookmarked
}) => {
  const [tab, setTab] = useState<'today' | 'weekly' | 'monthly' | 'allTime'>('today');
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('slider');
  const sliderRef = useRef<HTMLDivElement>(null);

  let activeList = popularToday;
  let sectionSubtitle = 'Donghua paling banyak ditonton hari ini';

  if (tab === 'weekly' && donghuaPopular?.weekly?.length) {
    activeList = donghuaPopular.weekly;
    sectionSubtitle = 'Top 10 donghua paling populer minggu ini';
  } else if (tab === 'monthly' && donghuaPopular?.monthly?.length) {
    activeList = donghuaPopular.monthly;
    sectionSubtitle = 'Peringkat donghua terfavorit bulan ini';
  } else if (tab === 'allTime' && donghuaPopular?.allTime?.length) {
    activeList = donghuaPopular.allTime;
    sectionSubtitle = 'Donghua legendaris dengan penonton terbanyak sepanjang masa';
  }

  const handleScroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="popular" className="py-6 sm:py-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#f05100]/20 border border-[#f05100]/30 flex items-center justify-center text-[#f05100] shadow-[0_0_12px_#f051004d] shrink-0">
            <Flame className="w-5 h-5 fill-[#f05100]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Peringkat & Populer
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#f05100]/20 text-[#f05100] font-semibold border border-[#f05100]/30 flex items-center gap-1">
                <Crown className="w-3 h-3" /> Top Chart
              </span>
            </h2>
            <p className="text-xs text-slate-400">{sectionSubtitle}</p>
          </div>
        </div>

        {/* Tab Switcher & Display Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#0a0c10] rounded-2xl border border-[#ffffff1a] overflow-x-auto no-scrollbar">
            <button
              onClick={() => setTab('today')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                tab === 'today'
                  ? 'bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] text-white shadow-[0_8px_30px_#0009] border border-white/20'
                  : 'text-slate-400 hover:text-white hover:bg-[#ffffff1a]'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Hari Ini ({popularToday?.length || 0})</span>
            </button>

            <button
              onClick={() => setTab('weekly')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                tab === 'weekly'
                  ? 'bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] text-white shadow-[0_8px_30px_#0009] border border-white/20'
                  : 'text-slate-400 hover:text-white hover:bg-[#ffffff1a]'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Mingguan ({donghuaPopular?.weekly?.length || 0})</span>
            </button>

            <button
              onClick={() => setTab('monthly')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                tab === 'monthly'
                  ? 'bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] text-white shadow-[0_8px_30px_#0009] border border-white/20'
                  : 'text-slate-400 hover:text-white hover:bg-[#ffffff1a]'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>Bulanan ({donghuaPopular?.monthly?.length || 0})</span>
            </button>

            <button
              onClick={() => setTab('allTime')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                tab === 'allTime'
                  ? 'bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] text-white shadow-[0_8px_30px_#0009] border border-white/20'
                  : 'text-slate-400 hover:text-white hover:bg-[#ffffff1a]'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>All-Time ({donghuaPopular?.allTime?.length || 0})</span>
            </button>
          </div>

          {/* Toggle Slider vs Grid & Navigation Arrows */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center p-1 bg-[#0a0c10] rounded-2xl border border-[#ffffff1a]">
              <button
                onClick={() => setViewMode('slider')}
                className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                  viewMode === 'slider'
                    ? 'bg-[#7c3aed] text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Slide ke samping (Carousel)"
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

      {/* Content Rendering: Slider / Carousel Mode vs Grid Mode */}
      {viewMode === 'slider' ? (
        <div
          ref={sliderRef}
          className="flex items-stretch gap-2.5 sm:gap-4 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {activeList.map((item, index) => (
            <div
              key={item.slug || `${item.title}-${index}`}
              className="w-[140px] xs:w-[160px] sm:w-[190px] md:w-[210px] shrink-0 snap-start"
            >
              <DonghuaCard
                item={item}
                rank={tab !== 'today' ? item.rank || index + 1 : undefined}
                onSelect={onSelect}
                onWatch={onWatch}
                onToggleBookmark={onToggleBookmark}
                isBookmarked={isBookmarked(item.slug)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4">
          {activeList.map((item, index) => (
            <DonghuaCard
              key={item.slug || `${item.title}-${index}`}
              item={item}
              rank={tab !== 'today' ? item.rank || index + 1 : undefined}
              onSelect={onSelect}
              onWatch={onWatch}
              onToggleBookmark={onToggleBookmark}
              isBookmarked={isBookmarked(item.slug)}
            />
          ))}
        </div>
      )}
    </section>
  );
};
