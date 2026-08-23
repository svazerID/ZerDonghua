import React from 'react';
import { History, Play, Trash2, Clock } from 'lucide-react';
import { WatchHistoryEntry } from '../types';

interface ContinueWatchingSectionProps {
  history: WatchHistoryEntry[];
  onResume: (item: WatchHistoryEntry) => void;
  onRemove: (slug: string) => void;
  onClear: () => void;
}

export const ContinueWatchingSection: React.FC<ContinueWatchingSectionProps> = ({
  history,
  onResume,
  onRemove,
  onClear
}) => {
  if (!history || history.length === 0) return null;

  return (
    <section className="py-4">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#7c3aed]/20 border border-[#a78bfa66] flex items-center justify-center text-[#a78bfa] shadow-[0_0_12px_#a78bfa4d]">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Lanjutkan Menonton
            </h2>
            <p className="text-xs text-slate-400">Tersimpan dari pemutaran terakhir Anda</p>
          </div>
        </div>

        <button
          onClick={onClear}
          className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Hapus Semua</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {history.map((item) => (
          <div
            key={item.slug}
            className="group relative p-3 rounded-2xl bg-[#0d1015] hover:bg-[#0d1015] border border-[#ffffff1a] hover:border-[#a78bfa66] flex items-center justify-between gap-3 transition-all shadow-[0_9px_7px_#0000001a] hover:shadow-[0_24px_50px_-12px_#000000bf] cursor-pointer"
            onClick={() => onResume(item)}
          >
            <div className="flex items-center gap-3 min-w-0">
              {item.cover && (
                <div className="relative w-12 h-16 rounded-xl overflow-hidden shrink-0 bg-[#06060b] border border-[#ffffff1a]">
                  <img
                    src={item.cover}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-4 h-4 fill-white text-white" />
                  </div>
                </div>
              )}

              <div className="min-w-0 space-y-1">
                <h4 className="text-xs font-semibold text-white group-hover:text-[#a78bfa] truncate">
                  {item.seriesTitle || item.title}
                </h4>
                <p className="text-[11px] text-[#a78bfa] font-medium truncate">
                  {item.episodeNumber ? `Ep ${item.episodeNumber}` : item.title}
                </p>
                {/* Progress bar */}
                <div className="w-24 h-1 bg-[#ffffff1a] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] rounded-full"
                    style={{ width: `${Math.max(item.progressPercent || 25, 10)}%` }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(item.slug);
              }}
              className="p-1.5 rounded-lg bg-[#ffffff1a] hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors border border-transparent hover:border-red-500/30"
              title="Hapus"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
