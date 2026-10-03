import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../ProductCard';
import { Flame } from 'lucide-react';

export const BestSellersSection: React.FC = () => {
  const { products } = useStore();

  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 4);

  return (
    <section id="bestsellers-section" className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300 text-xs font-mono uppercase text-emerald-800 tracking-wider mb-2 font-bold shadow-xs">
              <Flame className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-900">
              Best Sellers of the Month
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Top verified gadget orders across Lahore, Karachi, Islamabad, and nationwide.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
