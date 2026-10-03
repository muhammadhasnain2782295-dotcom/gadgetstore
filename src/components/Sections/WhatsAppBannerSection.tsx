import React from 'react';
import { useStore } from '../../context/StoreContext';
import { getWhatsAppDirectSupportUrl } from '../../utils/whatsapp';
import { MessageSquare, PhoneCall, ShieldCheck, Sparkles } from 'lucide-react';

export const WhatsAppBannerSection: React.FC = () => {
  const { settings } = useStore();

  return (
    <section className="py-14 sm:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-800 border border-emerald-600 p-8 sm:p-12 relative overflow-hidden shadow-xl text-white">
          {/* Subtle Ambient Emerald bloom */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-green-300/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-mono font-bold uppercase tracking-wider mb-3 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                <span>Instant 24/7 WhatsApp Desk</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white leading-tight">
                Prefer Ordering Directly on WhatsApp?
              </h2>

              <p className="text-xs sm:text-sm text-emerald-100 mt-2 leading-relaxed font-medium">
                Connect with Muhammad Hasnain at <strong className="text-white underline">{settings.rawWhatsappNumber}</strong>. Send a screenshot of any gadget, ask audio recommendations, request live packing videos, or track your delivery in real-time.
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-mono text-emerald-100">
                <span className="flex items-center gap-1.5 text-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" /> 12 Months Warranty
                </span>
                <span className="flex items-center gap-1.5 text-emerald-200">
                  <Sparkles className="w-4 h-4 text-emerald-300" /> 10% Off on Advance
                </span>
                <span className="flex items-center gap-1.5 text-emerald-200">
                  <PhoneCall className="w-4 h-4 text-emerald-300" /> Instant Response
                </span>
              </div>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
              <a
                href={getWhatsAppDirectSupportUrl('Direct WhatsApp Order Banner', settings.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-xl bg-white hover:bg-emerald-50 text-emerald-950 font-bold text-xs uppercase tracking-wider transition-all shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex items-center justify-center gap-2 group cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span>Order on WhatsApp ({settings.rawWhatsappNumber})</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
