import React from 'react';
import { useStore } from '../context/StoreContext';
import { getWhatsAppDirectSupportUrl } from '../utils/whatsapp';

export const HeroGoldenStream: React.FC = () => {
  const { settings } = useStore();

  const whatsappUrl = getWhatsAppDirectSupportUrl(
    'Hi Hasnain Gadget Store! I saw your official website banner and would like to order.',
    settings.whatsappNumber
  );

  return (
    <section className="w-full bg-black border-b border-emerald-500/30 shadow-[0_10px_35px_rgba(0,0,0,0.8)] relative z-10 overflow-hidden">
      <div className="w-full max-w-[2000px] mx-auto">
        {/* Full-width, uncompromised exact approved hero banner */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full focus:outline-none group cursor-pointer"
          title={`Hasnain Gadget Store — Official WhatsApp: ${settings.rawWhatsappNumber || '0301 0980742'}`}
        >
          <img
            src={settings.bannerImageUrl || "/src/assets/images/hasnain_exact_front_banner_1791009855841.jpg"}
            alt="Hasnain Gadget Store - Smart Tech Better Life - Original Products, Best Prices - 0301 0980742"
            className="w-full h-auto object-contain block mx-auto select-none transition-opacity duration-300 group-hover:opacity-[0.98]"
            loading="eager"
            fetchPriority="high"
            referrerPolicy="no-referrer"
          />
        </a>
      </div>
    </section>
  );
};
