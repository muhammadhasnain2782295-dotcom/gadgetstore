import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CategoryId } from '../../types';
import { Layers, ArrowRight } from 'lucide-react';

export const CategoriesSection: React.FC = () => {
  const { categories, products, setSelectedCategory } = useStore();

  const handleSelectCategory = (catId: CategoryId) => {
    setSelectedCategory(catId);
    const el = document.getElementById('products-catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="categories-section" className="py-14 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300 text-xs font-mono uppercase text-emerald-800 tracking-wider mb-2 font-bold shadow-xs">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>Store Taxonomy</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-900">
            Explore Gadget Categories
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Every category is fully covered with official warranty, open parcel checks, and fast nationwide delivery.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => {
            const count = products.filter((p) => p.category === cat.id).length;
            return (
              <div
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className="group relative rounded-xl bg-white border border-slate-200 hover:border-emerald-500/60 hover:shadow-[0_12px_28px_rgba(16,185,129,0.12)] p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 cursor-pointer overflow-hidden shadow-xs"
              >
                {/* Background subtle green glow on hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/15 transition-all pointer-events-none" />

                <div className="relative mb-4 aspect-video w-full rounded-lg overflow-hidden bg-slate-100 border border-slate-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                <div className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {cat.name}
                    </h3>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mb-2 leading-relaxed">
                    {cat.description}
                  </p>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-bold">
                    {count} {count === 1 ? 'Product' : 'Products'} Available
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
