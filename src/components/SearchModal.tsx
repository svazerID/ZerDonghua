import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Search, X, Flame, Play, Info } from 'lucide-react';
import { DonghuaCardItem } from '../types';
import { donghuaApi } from '../services/donghuaApi';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDetail: (slug: string) => void;
  onWatch: (slug: string, title?: string) => void;
}

const TRENDING_SEARCHES = [
  'Battle Through the Heavens',
  'Perfect World',
  'Renegade Immortal',
  'Soul Land',
  'Throne of Seal',
  'Swallowed Star',
  'Shrouding the Heavens',
  'The Great Ruler'
];

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectDetail,
  onWatch
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DonghuaCardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle search
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      donghuaApi
        .search(query.trim())
        .then((res) => {
          setResults(res.results || []);
        })
        .catch((err) => {
          console.error('Search error:', err);
          setResults([]);
        })
        .finally(() => setLoading(false));
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      id="search-modal"
      className="fixed inset-0 z-50 bg-[#06060b]/90 backdrop-blur-2xl flex items-start justify-center pt-16 sm:pt-24 px-4 pb-6 overflow-y-auto animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-3xl bg-[#0a0c10]/95 backdrop-blur-2xl border border-[#ffffff1a] shadow-[0_24px_50px_-12px_#000000bf] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#ffffff1a] bg-[#0a0c10] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#a78bfa] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul donghua (contoh: Perfect World, BTTH, Xian Ni)..."
            className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-lg bg-[#ffffff1a] text-slate-400 hover:text-white text-xs font-semibold"
          >
            ESC
          </button>
        </div>

        {/* Trending Searches Suggestions */}
        {!query && (
          <div className="p-4 border-b border-[#ffffff1a] bg-[#0d1015] space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-[#f05100]" />
              Pencarian Populer
            </span>
            <div className="flex flex-wrap gap-2">
              {TRENDING_SEARCHES.map((k) => (
                <button
                  key={k}
                  onClick={() => setQuery(k)}
                  className="px-3 py-1.5 rounded-xl bg-[#ffffff1a] hover:bg-[#7c3aed]/20 text-slate-300 hover:text-[#a78bfa] border border-[#ffffff1a] hover:border-[#a78bfa66] text-xs transition-colors cursor-pointer backdrop-blur-sm"
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 sm:p-4 divide-y divide-[#ffffff1a] space-y-1">
          {loading ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <div className="w-6 h-6 rounded-full border-2 border-[#a78bfa] border-t-transparent animate-spin mx-auto" />
              <p className="text-xs">Mencari judul donghua...</p>
            </div>
          ) : results.length > 0 ? (
            results.map((item) => (
              <div
                key={item.slug}
                onClick={() => {
                  onClose();
                  onSelectDetail(item.slug);
                }}
                className="group p-2.5 rounded-2xl hover:bg-[#0d1015] flex items-center justify-between gap-3 cursor-pointer transition-all border border-transparent hover:border-[#a78bfa66] backdrop-blur-sm"
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

                  <div className="min-w-0 space-y-0.5">
                    <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#a78bfa] transition-colors truncate">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      {item.type && (
                        <span className="px-1.5 py-0.2 rounded bg-[#7c3aed]/20 text-[#a78bfa] border border-[#a78bfa66]">
                          {item.type}
                        </span>
                      )}
                      {item.episode && (
                        <span className="text-[#00a544] font-semibold">{item.episode}</span>
                      )}
                      {item.subStatus && (
                        <span className="text-slate-400">{item.subStatus}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                      onWatch(item.slug, item.title);
                    }}
                    className="p-2 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] text-white transition-colors shadow-[0_8px_30px_#0009]"
                    title="Nonton Sekarang"
                  >
                    <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                  </button>
                </div>
              </div>
            ))
          ) : query ? (
            <div className="p-8 text-center text-slate-400 text-sm space-y-2">
              <p>Tidak ada donghua ditemukan untuk "{query}"</p>
              <p className="text-xs text-slate-500">Coba kata kunci lain atau pilih dari pencarian populer di atas.</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
