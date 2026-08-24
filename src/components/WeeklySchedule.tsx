import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Calendar, Clock, X, Play, Info } from 'lucide-react';
import { donghuaApi } from '../services/donghuaApi';
import { DonghuaScheduleItem } from '../types';

interface WeeklyScheduleProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (slug: string) => void;
  onWatch: (slug: string, title?: string) => void;
}

export const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({
  isOpen,
  onClose,
  onSelect,
  onWatch
}) => {
  const [scheduleData, setScheduleData] = useState<Record<string, DonghuaScheduleItem[]>>({});
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    donghuaApi
      .getSchedule()
      .then((data) => {
        setScheduleData(data);
        const days = Object.keys(data);
        if (days.length > 0) {
          // Default to today or first day
          const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
          const todayName = dayNames[new Date().getDay()];
          const matchingDay = days.find(d => d.toLowerCase().includes(todayName.toLowerCase())) || days[0];
          setSelectedDay(matchingDay);
        }
      })
      .catch((err) => console.error('Failed to load schedule:', err))
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const days = Object.keys(scheduleData);
  const currentItems = selectedDay ? scheduleData[selectedDay] || [] : [];

  return (
    <div
      id="schedule-modal"
      className="fixed inset-0 z-50 bg-[#06060b]/85 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[85vh] rounded-3xl bg-[#0a0c10]/95 backdrop-blur-2xl border border-[#ffffff1a] shadow-[0_24px_50px_-12px_#000000bf] overflow-hidden flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#ffffff1a] flex items-center justify-between bg-[#0a0c10]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00a544]/20 border border-[#00a544]/30 flex items-center justify-center text-[#00a544] shadow-[0_0_12px_#00a5444d]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Jadwal Rilis Donghua
              </h2>
              <p className="text-xs text-slate-400">Waktu update rilis episode donghua mingguan</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#ffffff1a] hover:bg-[#ffffff26] text-slate-400 hover:text-white border border-[#ffffff1a] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Day Pills Bar */}
        <div className="p-3 bg-[#06060b] border-b border-[#ffffff1a] flex items-center gap-2 overflow-x-auto no-scrollbar">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedDay === day
                  ? 'bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] text-white shadow-[0_8px_30px_#0009] border border-white/20'
                  : 'bg-[#ffffff1a] hover:bg-[#ffffff26] text-slate-400 hover:text-white border border-[#ffffff1a]'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Content Items */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 pb-20 sm:pb-6">
          {loading ? (
            <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-[#a78bfa] border-t-transparent animate-spin" />
              <p className="text-xs">Memuat jadwal donghua...</p>
            </div>
          ) : currentItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {currentItems.map((item, idx) => (
                <div
                  key={item.slug || idx}
                  className="group p-3 rounded-2xl bg-[#0d1015] hover:bg-[#0d1015] border border-[#ffffff1a] hover:border-[#a78bfa66] flex items-center justify-between gap-3 backdrop-blur-xl transition-all shadow-[0_9px_7px_#0000001a]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {item.cover && (
                      <div className="relative w-12 h-16 rounded-xl overflow-hidden shrink-0 bg-[#06060b] border border-[#ffffff1a]">
                        <Image
                          src={item.cover}
                          alt={item.title}
                          fill
                          loading="lazy"
                          decoding="async"
                          sizes="48px"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="min-w-0 space-y-1">
                      <h4 className="text-xs font-semibold text-white group-hover:text-[#a78bfa] truncate">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="text-[#a78bfa] font-semibold">{item.episode}</span>
                        {item.releaseTime && (
                          <span className="text-[#00a544] flex items-center gap-0.5">
                            <Clock className="w-3 h-3" /> {item.releaseTime}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        onClose();
                        onWatch(item.slug, item.title);
                      }}
                      className="p-2 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] text-white shadow-[0_8px_30px_#0009] transition-colors cursor-pointer"
                      title="Nonton"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onSelect(item.slug);
                      }}
                      className="p-2 rounded-xl bg-[#ffffff1a] hover:bg-[#ffffff26] text-slate-300 hover:text-white border border-[#ffffff1a] transition-colors cursor-pointer"
                      title="Detail Series"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <Calendar className="w-10 h-10 mx-auto text-slate-600" />
              <p className="text-sm font-semibold">Tidak ada jadwal rilis untuk hari ini</p>
              <p className="text-xs text-slate-500">Pilih hari lain untuk melihat jadwal rilis donghua.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
