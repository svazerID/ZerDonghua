import React, { useState } from 'react';
import Image from 'next/image';
import { Bookmark, History, Trash2, Play, X, Clock } from 'lucide-react';
import { BookmarkEntry, WatchHistoryEntry } from '../types';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: BookmarkEntry[];
  history: WatchHistoryEntry[];
  onSelectDetail: (slug: string) => void;
  onWatch: (slug: string, title?: string) => void;
  onRemoveBookmark: (slug: string) => void;
  onRemoveHistory: (slug: string) => void;
  onClearHistory: () => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  bookmarks,
  history,
  onSelectDetail,
  onWatch,
  onRemoveBookmark,
  onRemoveHistory,
  onClearHistory
}) => {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'history'>('bookmarks');

  if (!isOpen) return null;

  return (
    <div
      id="watchlist-drawer-backdrop"
      className="fixed inset-0 z-50 bg-[#06060b]/80 backdrop-blur-xl flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md h-full bg-[#0a0c10]/95 backdrop-blur-2xl border-l border-[#ffffff1a] shadow-[0_24px_50px_-12px_#000000bf] flex flex-col animate-in slide-in-from-right duration-250 text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#ffffff1a] flex items-center justify-between bg-[#0a0c10]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#7c3aed]/20 border border-[#a78bfa66] flex items-center justify-center text-[#a78bfa] shadow-[0_0_12px_#a78bfa4d]">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                Daftar Simpan & Riwayat
              </h2>
              <p className="text-[11px] text-slate-400">Kelola bookmark & streaming history</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#ffffff1a] hover:bg-[#ffffff26] text-slate-400 hover:text-white transition-colors cursor-pointer border border-[#ffffff1a]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex p-2 bg-[#06060b] border-b border-[#ffffff1a] gap-2">
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer backdrop-blur-sm ${
              activeTab === 'bookmarks'
                ? 'bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] text-white shadow-[0_8px_30px_#0009] border border-white/20'
                : 'text-slate-400 hover:text-white bg-[#ffffff1a] border border-[#ffffff1a]'
            }`}
          >
            Bookmark ({bookmarks.length})
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer backdrop-blur-sm ${
              activeTab === 'history'
                ? 'bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] text-white shadow-[0_8px_30px_#0009] border border-white/20'
                : 'text-slate-400 hover:text-white bg-[#ffffff1a] border border-[#ffffff1a]'
            }`}
          >
            Riwayat Nonton ({history.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24 sm:pb-6">
          {activeTab === 'bookmarks' ? (
            bookmarks.length > 0 ? (
              <div className="space-y-2.5">
                {bookmarks.map((item) => (
                  <div
                    key={item.slug}
                    className="group p-3 rounded-2xl bg-[#0d1015] border border-[#ffffff1a] hover:border-[#a78bfa66] flex items-center justify-between gap-3 transition-all backdrop-blur-md shadow-[0_9px_7px_#0000001a]"
                  >
                    <div
                      className="flex items-center gap-3 min-w-0 cursor-pointer"
                      onClick={() => {
                        onClose();
                        onSelectDetail(item.slug);
                      }}
                    >
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
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-white group-hover:text-[#a78bfa] truncate">
                          {item.title}
                        </h4>
                        {item.type && (
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {item.type} • {item.status || 'Ongoing'}
                          </p>
                        )}
                        <span className="text-[10px] font-semibold text-[#00a544]">
                          Tersimpan
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          onClose();
                          onWatch(item.slug, item.title);
                        }}
                        className="p-2 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] text-white shadow-[0_8px_30px_#0009] transition-colors cursor-pointer"
                        title="Nonton Sekarang"
                      >
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </button>
                      <button
                        onClick={() => onRemoveBookmark(item.slug)}
                        className="p-2 rounded-xl bg-[#ffffff1a] hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-[#ffffff1a] transition-colors cursor-pointer"
                        title="Hapus Bookmark"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-3 text-slate-500">
                <Bookmark className="w-10 h-10 text-slate-700 stroke-1" />
                <p className="text-sm font-semibold text-slate-400">Bookmark Anda masih kosong</p>
                <p className="text-xs">Klik tombol bookmark pada poster donghua untuk menyimpannya di sini.</p>
              </div>
            )
          ) : (
            history.length > 0 ? (
              <div className="space-y-3">
                <div className="flex justify-end">
                  <button
                    onClick={onClearHistory}
                    className="text-[11px] text-red-400/80 hover:text-red-300 flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" /> Bersihkan Riwayat
                  </button>
                </div>
                <div className="space-y-2.5">
                  {history.map((item) => (
                    <div
                      key={item.slug}
                      className="group p-3 rounded-2xl bg-[#0d1015] border border-[#ffffff1a] hover:border-[#a78bfa66] flex items-center justify-between gap-3 transition-all backdrop-blur-md shadow-[0_9px_7px_#0000001a]"
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
                            {item.seriesTitle || item.title}
                          </h4>
                          <p className="text-[11px] text-[#a78bfa] font-semibold">
                            {item.episodeNumber ? `Ep ${item.episodeNumber}` : item.title}
                          </p>
                          <div className="w-24 h-1 bg-[#ffffff1a] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] rounded-full"
                              style={{ width: `${item.progressPercent || 50}%` }}
                            />
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
                          title="Lanjutkan Nonton"
                        >
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        </button>
                        <button
                          onClick={() => onRemoveHistory(item.slug)}
                          className="p-2 rounded-xl bg-[#ffffff1a] hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-[#ffffff1a] transition-colors cursor-pointer"
                          title="Hapus riwayat"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-3 text-slate-500">
                <Clock className="w-10 h-10 text-slate-700 stroke-1" />
                <p className="text-sm font-semibold text-slate-400">Belum ada riwayat streaming</p>
                <p className="text-xs">Mulai tonton episode donghua untuk mencatat progress pemutaran Anda.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
