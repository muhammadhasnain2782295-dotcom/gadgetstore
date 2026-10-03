import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { BrandLogo } from './BrandLogo';
import { Search, ShoppingBag, ShieldCheck, Menu, X, PhoneCall } from 'lucide-react';
import { getWhatsAppDirectSupportUrl } from '../utils/whatsapp';

export const Header: React.FC = () => {
  const {
    cartCount,
    setIsCartOpen,
    setIsSearchOpen,
    setSelectedCategory,
    settings,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'Shop', action: () => scrollToSection('products-catalog') },
    { label: 'Categories', action: () => scrollToSection('categories-section') },
    { label: 'Best Sellers', action: () => scrollToSection('bestsellers-section') },
    { label: 'New Arrivals', action: () => scrollToSection('newarrivals-section') },
    { label: 'Warranty', action: () => scrollToSection('warranty-section') },
    { label: 'Open Parcel', action: () => scrollToSection('open-parcel-section') },
    { label: 'Contact', action: () => scrollToSection('contact-faq-section') },
  ];

  return (
    <>
      {/* Top Trust Notice Bar */}
      <div className="bg-emerald-50 border-b border-emerald-200/80 text-[11px] md:text-xs text-emerald-900 py-1.5 px-4 font-mono tracking-wider">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
            <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              Allowed to Open Parcel Before Payment
            </span>
            <span className="hidden sm:inline text-emerald-300">|</span>
            <span className="hidden sm:inline text-slate-700 font-medium">12 Months Official Replacement Warranty</span>
            <span className="hidden md:inline text-emerald-300">|</span>
            <span className="hidden md:inline text-emerald-700 font-bold">
              10% Off on Advance Payment
            </span>
          </div>

          <a
            href={getWhatsAppDirectSupportUrl('Website Header Help', settings.whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-emerald-800 hover:text-emerald-950 transition-colors shrink-0 ml-4 font-semibold"
          >
            <PhoneCall className="w-3 h-3 text-emerald-600" />
            <span className="tabular-nums font-mono">{settings.rawWhatsappNumber}</span>
          </a>
        </div>
      </div>

      {/* Main Top Header conforming to 3-zone contract */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between gap-4">
          {/* Zone 1: Brand Wordmark / Logo */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => {
                setSelectedCategory('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg"
              aria-label="Hasnain Gadget Store Home"
            >
              <BrandLogo size="md" />
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-700">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                className="whitespace-nowrap transition-colors hover:text-emerald-600 relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-emerald-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Actions (Search, Cart, Mobile Toggle) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              title="Search Gadgets"
              aria-label="Search Gadgets"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 hover:border-emerald-400 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 shadow-xs"
              title="View Shopping Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">
                Cart
              </span>
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center tabular-nums shadow-xs">
                {cartCount}
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-xl px-5 py-6 space-y-4 shadow-lg">
            <div className="grid grid-cols-2 gap-2 text-sm">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={link.action}
                  className="text-left px-3 py-2.5 rounded-lg text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 font-semibold transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span className="font-mono">WhatsApp: {settings.rawWhatsappNumber}</span>
              <a
                href={getWhatsAppDirectSupportUrl('Mobile Menu Order', settings.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:underline font-bold"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
