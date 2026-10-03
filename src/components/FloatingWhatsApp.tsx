import React from 'react';
import { useStore } from '../context/StoreContext';
import { getWhatsAppDirectSupportUrl } from '../utils/whatsapp';
import { MessageSquare } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const { settings } = useStore();

  return (
    <aside
      aria-label="Contact via WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex items-center group"
    >
      <span className="hidden sm:inline-block mr-2 px-3 py-1.5 rounded-lg bg-white/95 border border-emerald-300 text-emerald-800 text-xs font-semibold shadow-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Order on WhatsApp ({settings.rawWhatsappNumber})
      </span>

      <a
        href={getWhatsAppDirectSupportUrl('Floating Button', settings.whatsappNumber)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Order on WhatsApp at ${settings.rawWhatsappNumber}`}
        className="w-13 h-13 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-[0_4px_25px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
      >
        <MessageSquare className="w-6 h-6 fill-white text-white" />
      </a>
    </aside>
  );
};
