import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatPKR } from '../utils/format';
import { getWhatsAppProductUrl } from '../utils/whatsapp';
import {
  X,
  ShieldCheck,
  PackageCheck,
  Truck,
  Plus,
  Minus,
  ShoppingBag,
  MessageSquare,
  Sparkles,
  Check,
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    activeProductDetail,
    setActiveProductDetail,
    addToCart,
    setIsCheckoutOpen,
    settings,
  } = useStore();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!activeProductDetail) return null;

  const product = activeProductDetail;
  const isOutOfStock = product.stockQuantity <= 0;
  const images =
    product.images && product.images.length > 0
      ? product.images
      : ['/src/assets/images/prod_earbuds_1791006632121.jpg'];

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setActiveProductDetail(null);
    setIsCheckoutOpen(true);
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-900">
        {/* Header Close Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 font-medium">
            <span>SKU: {product.sku}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-bold uppercase">{product.category}</span>
          </div>

          <button
            onClick={() => setActiveProductDetail(null)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
              <img
                src={images[selectedImageIndex] || images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />

              {product.discountPercent && product.discountPercent > 0 && (
                <div className="absolute top-3 left-3 bg-emerald-600 text-white font-extrabold text-xs px-2.5 py-1 rounded shadow-xs">
                  SAVE {product.discountPercent}%
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex items-center gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-emerald-600 ring-2 ring-emerald-600/20 scale-105'
                        : 'border-slate-200 hover:border-slate-400 opacity-80'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Assurance Badges */}
            <div className="flex flex-col gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/90">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-amber-500/15 border border-amber-300/80 shadow-[0_2px_8px_rgba(245,158,11,0.15),0_0_10px_rgba(16,185,129,0.10)]">
                <span className="text-sm shrink-0 select-none drop-shadow-[0_0_5px_rgba(245,158,11,0.6)]">🛡️</span>
                <span className="text-xs font-bold text-slate-900 tracking-tight">12 Months Official Warranty</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/15 via-amber-500/10 to-emerald-500/15 border border-emerald-300/80 shadow-[0_2px_8px_rgba(16,185,129,0.15),0_0_10px_rgba(245,158,11,0.10)]">
                <span className="text-sm shrink-0 select-none drop-shadow-[0_0_5px_rgba(16,185,129,0.6)]">📦</span>
                <span className="text-xs font-bold text-slate-900 tracking-tight">Allow to Open Parcel Before Payment</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module & Details */}
          <div className="flex flex-col">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold mb-1">
              {product.brand}
            </span>

            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 mb-3">
              {product.name}
            </h2>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 pb-4 mb-4 border-b border-slate-200">
              <span className="text-3xl font-extrabold font-display text-slate-900 tabular-nums">
                {formatPKR(product.price)}
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-base text-slate-400 line-through tabular-nums">
                  {formatPKR(product.oldPrice)}
                </span>
              )}
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                10% Off on Advance
              </span>
            </div>

            {/* Short Description */}
            <p className="text-sm text-slate-600 mb-5 leading-relaxed">
              {product.fullDescription || product.shortDescription}
            </p>

            {/* Stock status */}
            <div className="flex items-center gap-2 mb-6 text-xs">
              <span className="text-slate-500 font-medium">Stock Availability:</span>
              {isOutOfStock ? (
                <span className="text-rose-600 font-bold">Currently Out of Stock</span>
              ) : (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  In Stock ({product.stockQuantity} units available)
                </span>
              )}
            </div>

            {/* Quantity Selector & Purchase Actions */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-600 font-medium">Quantity:</span>
                <div className="flex items-center rounded-lg bg-slate-100 border border-slate-200 overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="p-2 text-slate-700 hover:text-slate-950 disabled:opacity-40 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-sm font-bold text-slate-900 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stockQuantity, q + 1))
                    }
                    disabled={quantity >= product.stockQuantity || isOutOfStock}
                    className="p-2 text-slate-700 hover:text-slate-950 disabled:opacity-40 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm tracking-wide uppercase transition-all shadow-[0_4px_18px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Buy Now</span>
                </button>

                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm tracking-wide uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Add To Cart</span>
                </button>
              </div>

              {/* Direct WhatsApp Ordering */}
              <a
                href={getWhatsAppProductUrl(
                  product.name,
                  product.price,
                  quantity,
                  settings.whatsappNumber
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Order on WhatsApp ({settings.rawWhatsappNumber})</span>
              </a>
            </div>

            {/* Specifications Tabular Breakdown */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="mt-auto pt-4 border-t border-slate-200">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold mb-3">
                  Technical Specifications
                </h4>
                <div className="divide-y divide-slate-100 text-xs">
                  {product.specifications.map((spec, i) => (
                    <div key={i} className="py-2 flex items-center justify-between">
                      <span className="text-slate-500">{spec.label}</span>
                      <span className="text-slate-900 font-bold tabular-nums text-right">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
