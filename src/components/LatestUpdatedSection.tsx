import React, { useRef, useState } from 'react';
import { Film, Search, Flame, Rows, LayoutGrid, ChevronLeft, ChevronRight } from 'lucide-react';
import { DonghuaCardItem } from '../types';
import { DonghuaCard } from './DonghuaCard';

interface LatestUpdatedSectionProps {
  latestRelease: DonghuaCardItem[];
  onSelect: (item: DonghuaCardItem) => void;
  onWatch: (item: DonghuaCardItem) => void;
  onToggleBookmark: (item: DonghuaCardItem) => void;
  isBookmarked: (slug: string) => boolean;
}

export const LatestUpdatedSection: React.FC<LatestUpdatedSectionProps> = ({
  latestRelease,
  onSelect,
  onWatch,
  onToggleBookmark,
  isBookmarked
}) => {
  const [filter, setFilter] = useState<'all' | 'hot' | 'sub'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('slider');
  const sliderRef = useRef<HTMLDivElement>(null);

  // Filter items
  const filteredList = latestRelease.filter((item) => {
    // Search match
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(term);
      const matchSeries = item.seriesTitle?.toLowerCase().includes(term);
      if (!matchTitle && !matchSeries) return false;
    }

    if (filter === 'hot') return item.hot === true;
    if (filter === 'sub') return item.subStatus?.toLowerCase().includes('sub');
    return true;
  });

  const handleScroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="latest" className="py-6 sm:py-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#7c3aed]/20 border border-[#a78bfa66] flex items-center justify-center text-[#a78bfa] shadow-[0_0_12px_#a78bfa4d] shrink-0">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Update Episode Terbaru
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#00a544]/20 text-[#00a544] font-semibold border border-[#00a544]/30">
                Live Release
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Episode donghua subtitle Indonesia terbaru yang baru saja tayang
            </p>
          </div>
        </div>

        {/* Filter, View Switcher & Search Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Filter Pills */}
          <div className="flex items-center gap-1 p-1 bg-[#0a0c10] rounded-2xl border border-[#ffffff1a]">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] text-white shadow-[0_8px_30px_#0009] border border-white/20'
                  : 'text-slate-400 hover:text-white hover:bg-[#ffffff1a]'
              }`}
            >
              Semua ({latestRelease.length})
            </button>
            <button
              onClick={() => setFilter('hot')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                filter === 'hot'
                  ? 'bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] text-white shadow-[0_8px_30px_#0009] border border-white/20'
                  : 'text-slate-400 hover:text-white hover:bg-[#ffffff1a]'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-[#f05100]" />
              <span>Hot 🔥</span>
            </button>
            <button
              onClick={() => setFilter('sub')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filter === 'sub'
                  ? 'bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] text-white shadow-[0_8px_30px_#0009] border border-white/20'
                  : 'text-slate-400 hover:text-white hover:bg-[#ffffff1a]'
              }`}
            >
              Sub Indo
            </button>
          </div>

          {/* Quick Search in Latest Releases */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari rilis terbaru..."
              className="w-36 sm:w-44 pl-8 pr-3 py-1.5 rounded-xl bg-[#0a0c10] border border-[#ffffff1a] focus:border-[#a78bfa66] text-xs text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* View Mode Toggle & Slider Arrows */}
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

      {/* Main Section: Full-width Slider or Grid */}
      <div>
        {filteredList.length > 0 ? (
          viewMode === 'slider' ? (
            <div
              ref={sliderRef}
              className="flex items-stretch gap-2.5 sm:gap-4 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {filteredList.map((item, index) => (
                <div
                  key={item.slug || `${item.title}-${index}`}
                  className="w-[140px] xs:w-[160px] sm:w-[185px] md:w-[200px] shrink-0 snap-start"
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
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4">
              {filteredList.map((item, index) => (
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
          )
        ) : (
          <div className="py-20 text-center text-gray-400 rounded-3xl bg-white/[0.02] border border-white/5 space-y-2">
            <p className="text-sm font-semibold">Tidak ada episode yang sesuai filter.</p>
            <button
              onClick={() => {
                setFilter('all');
                setSearchTerm('');
              }}
              className="px-4 py-1.5 rounded-xl bg-violet-600 text-white text-xs font-bold cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
