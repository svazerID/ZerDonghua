import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Calendar, Clock, Play, Info, ChevronLeft, ChevronRight, CheckCircle2, Flame, Rows, LayoutGrid } from 'lucide-react';
import { donghuaApi } from '../services/donghuaApi';
import { DonghuaScheduleItem, DonghuaCardItem } from '../types';

interface HomeScheduleSectionProps {
  onSelect: (slug: string) => void;
  onWatch: (slug: string, title?: string) => void;
  onToggleBookmark?: (item: DonghuaCardItem) => void;
  isBookmarked?: (slug: string) => boolean;
}

const INDO_DAYS: Record<string, string> = {
  Monday: 'Senin',
  Tuesday: 'Selasa',
  Wednesday: 'Rabu',
  Thursday: 'Kamis',
  Friday: 'Jumat',
  Saturday: 'Sabtu',
  Sunday: 'Minggu'
};

export const HomeScheduleSection: React.FC<HomeScheduleSectionProps> = ({
  onSelect,
  onWatch,
  onToggleBookmark,
  isBookmarked
}) => {
  const [scheduleData, setScheduleData] = useState<Record<string, DonghuaScheduleItem[]>>({});
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('slider');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    donghuaApi
      .getSchedule()
      .then((data) => {
        setScheduleData(data);
        const days = Object.keys(data);
        if (days.length > 0) {
          // Detect current day
          const dayIndex = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
          const dayMapping = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const todayEn = dayMapping[dayIndex];
          const matchedDay = days.find((d) => d.toLowerCase() === todayEn.toLowerCase()) || days[0];
          setSelectedDay(matchedDay);
        }
      })
      .catch((err) => console.error('Failed to load home schedule:', err))
      .finally(() => setLoading(false));
  }, []);

  const days = Object.keys(scheduleData);
  const currentItems = selectedDay ? scheduleData[selectedDay] || [] : [];

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Determine today name
  const dayIndex = new Date().getDay();
  const todayEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayIndex];

  return (
    <section id="schedule-section" className="py-6 sm:py-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#00a544]/20 border border-[#00a544]/30 flex items-center justify-center text-[#00a544] shadow-[0_0_12px_#00a5444d] shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Jadwal Rilis Mingguan
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#00a544]/20 text-[#00a544] font-semibold border border-[#00a544]/30 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Live Schedule
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Waktu tayang dan jadwal siaran donghua terbaru setiap hari
            </p>
          </div>
        </div>

        {/* View Toggle & Slide Navigation */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center p-1 bg-[#0a0c10] rounded-2xl border border-[#ffffff1a]">
            <button
              onClick={() => setViewMode('slider')}
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                viewMode === 'slider'
                  ? 'bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] text-white shadow'
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
                  ? 'bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] text-white shadow'
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

      {/* Day Selector Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar">
        {days.map((day) => {
          const isToday = day.toLowerCase() === todayEn.toLowerCase();
          const isSelected = selectedDay === day;
          const indoName = INDO_DAYS[day] || day;
          const count = scheduleData[day]?.length || 0;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border ${
                isSelected
                  ? 'bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] text-white shadow-[0_8px_30px_#0009] border-white/20 scale-105'
                  : 'bg-[#0a0c10] hover:bg-[#0d1015] text-slate-400 hover:text-white border-[#ffffff1a]'
              }`}
            >
              <span>{indoName}</span>
              <span className="text-[10px] opacity-75">({count})</span>
              {isToday && (
                <span className="ml-1 px-1.5 py-0.2 rounded text-[9px] font-black bg-[#f05100] text-white uppercase tracking-wider shadow-[0_0_8px_#f051004d]">
                  Hari Ini
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Schedule Items List */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 rounded-3xl bg-[#0a0c10] border border-[#ffffff1a] space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#a78bfa] border-t-transparent animate-spin mx-auto" />
          <p className="text-xs">Memuat jadwal siaran donghua...</p>
        </div>
      ) : currentItems.length === 0 ? (
        <div className="py-12 text-center text-slate-400 rounded-3xl bg-[#0a0c10] border border-[#ffffff1a]">
          <p className="text-xs font-semibold">Tidak ada jadwal siaran untuk hari ini.</p>
        </div>
      ) : viewMode === 'slider' ? (
        <div
          ref={scrollRef}
          className="flex items-stretch gap-3.5 sm:gap-4 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {currentItems.map((item, idx) => (
            <div
              key={item.slug || idx}
              onClick={() => onSelect(item.slug)}
              className="w-[240px] sm:w-[270px] shrink-0 snap-start group relative rounded-2xl bg-[#0d1015] hover:bg-[#0d1015] border border-[#ffffff1a] hover:border-[#a78bfa66] p-3.5 transition-all duration-300 shadow-[0_9px_7px_#0000001a] hover:shadow-[0_24px_50px_-12px_#000000bf] flex flex-col justify-between cursor-pointer"
            >
              <div className="flex gap-3">
                {/* Poster image */}
                <div className="relative w-20 sm:w-22 aspect-[3/4] rounded-xl overflow-hidden shrink-0 bg-[#06060b] border border-[#ffffff1a]">
                  <Image
                    src={item.cover}
                    alt={item.title}
                    fill
                    loading="lazy"
                    decoding="async"
                    sizes="80px"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {item.episode && (
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-black bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] text-white">
                      Ep {item.episode}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-[#00a544] mb-1">
                      <Clock className="w-3 h-3" />
                      <span>{item.releaseTime || 'Jadwal Tayang'}</span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#a78bfa] transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  <span className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00a544] animate-pulse" />
                    <span>Rilis {INDO_DAYS[selectedDay] || selectedDay}</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-[#ffffff1a]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onWatch(item.slug, item.title);
                  }}
                  className="flex-1 py-1.5 px-2.5 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] hover:scale-[1.02] active:scale-95 text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 shadow-[0_8px_30px_#0009] transition-all cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-white" />
                  <span>Tonton</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(item.slug);
                  }}
                  className="p-1.5 rounded-xl bg-[#ffffff1a] hover:bg-[#ffffff26] active:scale-95 text-slate-300 hover:text-white border border-[#ffffff1a] transition-colors cursor-pointer"
                  title="Lihat Detail"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {currentItems.map((item, idx) => (
            <div
              key={item.slug || idx}
              onClick={() => onSelect(item.slug)}
              className="group relative rounded-2xl bg-[#0d1015] hover:bg-[#0d1015] border border-[#ffffff1a] hover:border-[#a78bfa66] p-3.5 transition-all duration-300 shadow-[0_9px_7px_#0000001a] hover:shadow-[0_24px_50px_-12px_#000000bf] flex flex-col justify-between cursor-pointer"
            >
              <div className="flex gap-3">
                <div className="relative w-20 aspect-[3/4] rounded-xl overflow-hidden shrink-0 bg-[#06060b] border border-[#ffffff1a]">
                  <Image
                    src={item.cover}
                    alt={item.title}
                    fill
                    loading="lazy"
                    decoding="async"
                    sizes="80px"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {item.episode && (
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-black bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] text-white">
                      Ep {item.episode}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-[#00a544] mb-1">
                      <Clock className="w-3 h-3" />
                      <span>{item.releaseTime || 'Jadwal Tayang'}</span>
                    </div>
                    <h3 className="text-xs font-semibold text-white group-hover:text-[#a78bfa] transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  <span className="text-[10px] text-slate-400 mt-2">
                    Rilis setiap {INDO_DAYS[selectedDay] || selectedDay}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-[#ffffff1a]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onWatch(item.slug, item.title);
                  }}
                  className="flex-1 py-1.5 px-2.5 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] hover:scale-[1.02] active:scale-95 text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 shadow-[0_8px_30px_#0009] transition-all cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-white" />
                  <span>Tonton</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(item.slug);
                  }}
                  className="p-1.5 rounded-xl bg-[#ffffff1a] hover:bg-[#ffffff26] active:scale-95 text-slate-300 hover:text-white border border-[#ffffff1a] transition-colors cursor-pointer"
                  title="Lihat Detail"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
