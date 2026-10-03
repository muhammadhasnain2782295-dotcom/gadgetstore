import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { formatPKR } from '../utils/format';
import { getWhatsAppProductUrl } from '../utils/whatsapp';
import { ShoppingBag, Check, MessageSquare } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    setIsCheckoutOpen,
    settings,
  } = useStore();

  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;

  const handleBuyNow = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
    setIsCheckoutOpen(true);
  };

  const primaryImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : '/src/assets/images/airpods_pro2_white_1791007889623.jpg';

  return (
    <div
      onClick={() => handleBuyNow()}
      className="group relative flex flex-col rounded-2xl bg-white border border-slate-200/90 hover:border-amber-400/80 hover:shadow-[0_12px_28px_rgba(245,158,11,0.14)] transition-all duration-300 overflow-hidden cursor-pointer shadow-xs"
    >
      {/* Visual Product Showcase Header */}
      <div className="relative aspect-[4/3] w-full bg-slate-50 overflow-hidden border-b border-slate-100">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Floating Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.oldPrice && product.oldPrice > product.price && (
            <span className="bg-emerald-600 text-white font-bold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded shadow-xs">
              SALE {product.discountPercent || Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
            </span>
          )}
          {product.bestSeller && (
            <span className="bg-slate-900/90 text-emerald-300 text-[10px] font-semibold uppercase px-2 py-0.5 rounded backdrop-blur-sm">
              Best Seller
            </span>
          )}
        </div>

        {/* Stock status indicator */}
        <div className="absolute top-2.5 right-2.5 z-10">
          {isOutOfStock ? (
            <span className="bg-rose-100 text-rose-700 border border-rose-300 text-[10px] font-semibold px-2 py-0.5 rounded">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded animate-pulse">
              Only {product.stockQuantity} Left
            </span>
          ) : (
            <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
              <Check className="w-2.5 h-2.5" /> In Stock
            </span>
          )}
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="flex flex-col flex-1 p-5">
        {/* Product Title */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1 mb-1.5 leading-snug">
          {product.name}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
          {product.shortDescription}
        </p>

        {/* Compact Premium Glowing Trust Badges */}
        <div className="flex flex-col gap-1.5 my-3">
          {/* Badge 1: 12 Months Official Warranty */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-amber-500/15 border border-amber-300/80 shadow-[0_2px_8px_rgba(245,158,11,0.15),0_0_10px_rgba(16,185,129,0.10)] hover:shadow-[0_2px_12px_rgba(245,158,11,0.25),0_0_14px_rgba(16,185,129,0.20)] hover:border-amber-400 transition-all duration-300">
            <span className="text-xs shrink-0 select-none drop-shadow-[0_0_5px_rgba(245,158,11,0.6)]">
              🛡️
            </span>
            <span className="text-[11px] font-bold text-slate-900 tracking-tight">
              12 Months Official Warranty
            </span>
          </div>

          {/* Badge 2: Allowed to Open Parcel Before Payment */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/15 via-amber-500/10 to-emerald-500/15 border border-emerald-300/80 shadow-[0_2px_8px_rgba(16,185,129,0.15),0_0_10px_rgba(245,158,11,0.10)] hover:shadow-[0_2px_12px_rgba(16,185,129,0.25),0_0_14px_rgba(245,158,11,0.20)] hover:border-emerald-400 transition-all duration-300">
            <span className="text-xs shrink-0 select-none drop-shadow-[0_0_5px_rgba(16,185,129,0.6)]">
              📦
            </span>
            <span className="text-[11px] font-bold text-slate-900 tracking-tight">
              Allow to Open Parcel Before Payment
            </span>
          </div>
        </div>

        {/* Price & Savings */}
        <div className="mt-auto flex items-baseline justify-between gap-2 mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold font-display text-slate-900 tabular-nums tracking-tight">
              {formatPKR(product.price)}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-xs text-slate-400 line-through tabular-nums">
                {formatPKR(product.oldPrice)}
              </span>
            )}
          </div>
          <span className="text-[11px] text-emerald-700 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            10% Advance Off
          </span>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {/* Buy Now Button -> Direct Checkout */}
          <button
            onClick={(e) => handleBuyNow(e)}
            disabled={isOutOfStock}
            className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            title="Buy Now - Direct Checkout"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Buy Now</span>
          </button>

          {/* Order on WhatsApp Button -> 03010980742 */}
          <a
            href={getWhatsAppProductUrl(product.name, product.price, 1, settings.whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            title={`Order on WhatsApp (${settings.rawWhatsappNumber})`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
