import React from 'react';
import { useStore } from '../context/StoreContext';
import { BrandLogo } from './BrandLogo';
import { CategoryId } from '../types';
import { getWhatsAppDirectSupportUrl } from '../utils/whatsapp';
import {
  ShieldCheck,
  PackageCheck,
  PhoneCall,
  Lock,
  ExternalLink,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, categories, setSelectedCategory, setIsAdminOpen } = useStore();

  const handleCategoryClick = (catId: CategoryId) => {
    setSelectedCategory(catId);
    const el = document.getElementById('products-catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-200">
          {/* Col 1 & 2: Store Identity & Description */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="md" showSubtitle />
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              Hasnain Gadget Store is Pakistan's premier destination for high-performance audio, AMOLED smartwatches, creator ring lights, and mobile accessories. Every item is covered by our 12-month official warranty with full open parcel inspection privileges.
            </p>

            <div className="pt-2 flex items-center gap-3">
              {/* WhatsApp Link */}
              <a
                href={getWhatsAppDirectSupportUrl('Footer Inquiry', settings.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 flex items-center justify-center transition-all shadow-xs"
                title="WhatsApp Contact"
              >
                <PhoneCall className="w-4 h-4 text-emerald-600" />
              </a>

              {/* TikTok Link */}
              <a
                href={settings.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 flex items-center justify-center transition-all shadow-xs"
                title="Follow on TikTok"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.11V9.42a6.34 6.34 0 0 0-6.6 6.32 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.08a8.3 8.3 0 0 0 4.17 1.15V6.78a4.82 4.82 0 0 1-1-.09z"/>
                </svg>
              </a>

              {/* Facebook Link */}
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 text-slate-700 flex items-center justify-center transition-all shadow-xs"
                title="Follow on Facebook"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-900 font-bold">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollTo('products-catalog')}
                  className="hover:text-emerald-600 transition-colors"
                >
                  Shop Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('bestsellers-section')}
                  className="hover:text-emerald-600 transition-colors"
                >
                  Best Sellers
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('newarrivals-section')}
                  className="hover:text-emerald-600 transition-colors"
                >
                  New Arrivals
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('reviews-section')}
                  className="hover:text-emerald-600 transition-colors"
                >
                  Customer Reviews
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('contact-faq-section')}
                  className="hover:text-emerald-600 transition-colors"
                >
                  Help & FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-900 font-bold">
              Categories
            </h4>
            <ul className="space-y-2">
              {categories.slice(0, 5).map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => handleCategoryClick(c.id)}
                    className="hover:text-emerald-600 transition-colors text-left"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Customer Assurance */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-900 font-bold">
              Customer Guarantees
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900 block">12 Months Warranty</strong>
                  Official replacement guarantee on all electronics.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <PackageCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900 block">Open Parcel Allowed</strong>
                  Inspect box contents prior to paying the rider.
                </span>
              </div>
              <div className="pt-1">
                <span className="text-[11px] text-slate-500 font-mono">
                  Official WhatsApp: {settings.rawWhatsappNumber}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Copyright & Discreet Admin Access */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
          <div>
            © {new Date().getFullYear()} Hasnain Gadget Store. All Rights Reserved.
          </div>

          <div className="flex items-center gap-6">
            <span>Powered by Official Hasnain Tech Store</span>

            {/* Discrete store owner admin access */}
            <button
              onClick={() => setIsAdminOpen(true)}
              className="text-slate-400 hover:text-emerald-700 transition-colors flex items-center gap-1 focus:outline-none"
              title="Store Admin Console"
            >
              <Lock className="w-3 h-3" />
              <span>Owner Panel</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
