import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../ProductCard';
import { Sparkles, ArrowRight } from 'lucide-react';

export const FeaturedSection: React.FC = () => {
  const { products, setSelectedCategory } = useStore();

  const featured = products.filter((p) => p.featured).slice(0, 6);

  const scrollToAll = () => {
    setSelectedCategory('all');
    const el = document.getElementById('products-catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300/80 text-xs uppercase text-amber-900 tracking-wider mb-2 font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Featured Selection</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Featured Products
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Curated gadgets covered by 12 Months Official Warranty and Allow to Open Parcel Before Payment.
            </p>
          </div>

          <button
            onClick={scrollToAll}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 hover:text-amber-900 transition-colors shrink-0 group"
          >
            <span>View All ({products.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
