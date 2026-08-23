import React from 'react';
import { ShieldCheck, Zap, Tv, Calendar, Heart, Award } from 'lucide-react';

interface PortalStatsBannerProps {
  onOpenSchedule: () => void;
  totalGenres: number;
}

export const PortalStatsBanner: React.FC<PortalStatsBannerProps> = ({
  onOpenSchedule,
  totalGenres
}) => {
  return (
    <section className="py-6">
      <div className="rounded-3xl bg-[#0d1015] border border-[#ffffff1a] p-6 sm:p-8 backdrop-blur-2xl relative overflow-hidden shadow-[0_9px_7px_#0000001a]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#7c3aed]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 relative z-10">
          {/* Stat 1 */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#7c3aed]/20 border border-[#a78bfa66] flex items-center justify-center text-[#a78bfa] shadow-[0_0_12px_#a78bfa4d] shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-base sm:text-lg font-bold text-white">Update Realtime</p>
              <p className="text-xs text-slate-400">Rilis setiap hari</p>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00a544]/20 border border-[#00a544]/30 flex items-center justify-center text-[#00a544] shadow-[0_0_12px_#00a5444d] shrink-0">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <p className="text-base sm:text-lg font-bold text-white">Multi-Server HD</p>
              <p className="text-xs text-slate-400">Anti lag & buffering</p>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#f05100]/20 border border-[#f05100]/30 flex items-center justify-center text-[#f05100] shadow-[0_0_12px_#f051004d] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-base sm:text-lg font-bold text-white">{totalGenres}+ Genre</p>
              <p className="text-xs text-slate-400">Kultivasi, Aksi & 3D</p>
            </div>
          </div>

          {/* Stat 4 */}
          <div
            onClick={onOpenSchedule}
            className="flex items-center gap-3 cursor-pointer group hover:opacity-90 transition-opacity"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#7c3aed]/20 border border-[#a78bfa66] group-hover:bg-[#7c3aed]/30 flex items-center justify-center text-[#a78bfa] shadow-[0_0_12px_#a78bfa4d] shrink-0 transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-base sm:text-lg font-bold text-white group-hover:text-[#a78bfa] transition-colors">
                Jadwal Mingguan
              </p>
              <p className="text-xs text-[#a78bfa] font-semibold flex items-center gap-1">
                Buka Jadwal →
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
