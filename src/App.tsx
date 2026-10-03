import React from 'react';
import { StoreProvider } from './context/StoreContext';
import { Header } from './components/Header';
import { HeroGoldenStream } from './components/HeroGoldenStream';
import { CategoriesSection } from './components/Sections/CategoriesSection';
import { ProductsCatalogSection } from './components/Sections/ProductsCatalogSection';
import { FeaturedSection } from './components/Sections/FeaturedSection';
import { BestSellersSection } from './components/Sections/BestSellersSection';
import { NewArrivalsSection } from './components/Sections/NewArrivalsSection';
import { WhyChooseUsSection } from './components/Sections/WhyChooseUsSection';
import { ReviewsSection } from './components/Sections/ReviewsSection';
import { FAQSection } from './components/Sections/FAQSection';
import { WhatsAppBannerSection } from './components/Sections/WhatsAppBannerSection';
import { Footer } from './components/Footer';

// Modals & Drawers
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { SearchModal } from './components/SearchModal';
import { AdminModal } from './components/Admin/AdminModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

export default function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-900">
        {/* Top Header */}
        <Header />

        {/* Main Content Area */}
        <main className="flex-1">
          {/* 1. Clean Exact Hero Banner */}
          <HeroGoldenStream />

          {/* 2. Categories Navigation */}
          <CategoriesSection />

          {/* 3. Full Products Catalog */}
          <ProductsCatalogSection />

          {/* 4. Featured Gadgets */}
          <FeaturedSection />

          {/* 5. Best Sellers */}
          <BestSellersSection />

          {/* 6. New Arrivals */}
          <NewArrivalsSection />

          {/* 7. Why Choose Us */}
          <WhyChooseUsSection />

          {/* 8. Customer Reviews */}
          <ReviewsSection />

          {/* 9. Help & FAQ */}
          <FAQSection />

          {/* 10. Direct WhatsApp Ordering */}
          <WhatsAppBannerSection />
        </main>

        {/* 11. Footer */}
        <Footer />

        {/* Interactive Overlays & Modals */}
        <ProductDetailModal />
        <CartDrawer />
        <CheckoutModal />
        <OrderConfirmationModal />
        <SearchModal />
        <AdminModal />
        <FloatingWhatsApp />
      </div>
    </StoreProvider>
  );
}
