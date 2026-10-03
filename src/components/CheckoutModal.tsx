import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { PaymentMethod, CustomerDetails } from '../types';
import { formatPKR } from '../utils/format';
import { trackMetaEvent } from '../utils/pixel';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Upload,
  AlertCircle,
  Sparkles,
  CreditCard,
  Banknote,
  Copy,
  Check,
  Plus,
  Minus,
  Trash2,
  PackageCheck,
} from 'lucide-react';

const PAKISTAN_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Abbottabad',
  'Bahawalpur',
  'Sargodha',
  'Sukkur',
  'Other City',
];

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    updateQuantity,
    removeFromCart,
    placeOrder,
    settings,
  } = useStore();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Lahore');
  const [postalCode, setPostalCode] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [paymentProofBase64, setPaymentProofBase64] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  useEffect(() => {
    if (isCheckoutOpen && cart.length > 0) {
      trackMetaEvent('InitiateCheckout', {
        value: cartSubtotal,
        currency: 'PKR',
        num_items: cart.length,
      });
    }
  }, [isCheckoutOpen, cart, cartSubtotal]);

  if (!isCheckoutOpen) return null;

  const isFreeShipping = cartSubtotal >= settings.freeShippingThreshold;
  const shippingFee = isFreeShipping || cartSubtotal === 0 ? 0 : settings.standardShippingFee;
  const advanceDiscount =
    paymentMethod === 'advance'
      ? Math.round(cartSubtotal * (settings.advanceDiscountPercent / 100))
      : 0;
  const finalTotal = cartSubtotal - advanceDiscount + shippingFee;

  const handleCopyAccount = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(label);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          proof: 'Image must be smaller than 5MB',
        }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProofBase64(reader.result as string);
        setErrors((prev) => {
          const next = { ...prev };
          delete next.proof;
          return next;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (cart.length === 0) {
      newErrors.cart = 'Please add at least one product to checkout';
    }

    if (!fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!phone.trim() || phone.trim().length < 10) {
      newErrors.phone = 'Valid 11-digit WhatsApp/Mobile number is required (e.g. 03010980742)';
    }
    if (!address.trim()) newErrors.address = 'Complete delivery address is required';
    if (!city.trim()) newErrors.city = 'City is required';

    if (paymentMethod === 'advance' && !paymentProofBase64) {
      newErrors.proof =
        'Please upload your payment screenshot/receipt after transferring the advance payment.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const customerDetails: CustomerDetails = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      postalCode: postalCode.trim() || undefined,
      orderNotes: orderNotes.trim() || undefined,
    };

    placeOrder(customerDetails, paymentMethod, paymentProofBase64 || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-lg font-bold font-display uppercase tracking-wide text-slate-900">
              Fast Checkout
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
              <span className="inline-flex items-center gap-1 text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                12 Months Official Warranty
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
                Allowed to Open Parcel Before Payment
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 10% Off Banner */}
        <div className="bg-emerald-600 text-white px-6 py-2.5 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>GET 10% OFF ON ADVANCE PAYMENT (JazzCash, EasyPaisa or Bank)</span>
          </div>
          <span className="font-mono text-[11px] bg-white text-emerald-800 px-2 py-0.5 rounded font-extrabold uppercase">
            Save 10%
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* 1. Selected Products & Product Quantity Adjuster */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-700 font-bold">
                1. Order Items & Product Quantity
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {cart.length} item(s) selected
              </span>
            </div>

            {cart.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                Your cart is empty. Please select products to checkout.
              </div>
            ) : (
              <div className="space-y-2.5">
                {cart.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover bg-white border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 truncate">
                          {product.name}
                        </h4>
                        <div className="text-slate-500 text-[11px] font-mono">
                          {formatPKR(product.price)} each
                        </div>
                      </div>
                    </div>

                    {/* Quantity Selector directly in checkout */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-xs">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-100 transition-colors"
                          title="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 py-1 text-xs font-bold text-slate-900 font-mono">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          disabled={quantity >= product.stockQuantity}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors"
                          title="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-bold text-slate-900 font-display tabular-nums w-20 text-right">
                        {formatPKR(product.price * quantity)}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Remove product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {errors.cart && (
              <p className="text-[11px] text-rose-600 font-semibold">{errors.cart}</p>
            )}
          </div>

          {/* 2. Customer Delivery Details */}
          <div className="space-y-4 pt-2 border-t border-slate-200">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-700 font-bold">
              2. Delivery Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Muhammad Ali"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
                {errors.fullName && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number (WhatsApp) *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 03010980742"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
                {errors.phone && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.phone}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Address & Landmark *
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House / Flat No, Street, Nearest Landmark, Area"
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
              {errors.address && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.address}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  City *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                >
                  {PAKISTAN_CITIES.map((c) => (
                    <option key={c} value={c} className="bg-white text-slate-900">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Postal Code (Optional)
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="e.g. 54000"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Order Notes / Special Delivery Instructions (Optional)
              </label>
              <input
                type="text"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="e.g. Call before delivery or deliver after 2 PM"
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 3. Payment Method Selector with 10% Discount and Open Parcel Guarantee */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-700 font-bold">
                3. Payment Method
              </h3>
              <span className="text-[11px] text-emerald-700 font-bold">
                10% Off on Advance
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option A: Cash on Delivery */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'bg-emerald-50/70 border-emerald-600 ring-1 ring-emerald-600/30'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-5 h-5 text-emerald-700" />
                    <span className="font-bold text-sm text-slate-900">Cash on Delivery</span>
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-emerald-600"
                  />
                </div>
                <p className="text-xs text-slate-600 leading-snug">
                  Pay cash to rider upon delivery. <strong>Allowed to Open Parcel</strong> before paying.
                </p>
              </div>

              {/* Option B: Advance Payment (10% OFF) */}
              <div
                onClick={() => setPaymentMethod('advance')}
                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all overflow-hidden ${
                  paymentMethod === 'advance'
                    ? 'bg-emerald-50 border-emerald-600 ring-1 ring-emerald-600/30'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-bl">
                  SAVE 10%
                </div>

                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-sm text-slate-900">Advance Payment</span>
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'advance'}
                    onChange={() => setPaymentMethod('advance')}
                    className="accent-emerald-600"
                  />
                </div>
                <p className="text-xs text-emerald-800 leading-snug">
                  JazzCash / EasyPaisa / Bank. <strong>Get 10% OFF</strong> instantly on entire total!
                </p>
              </div>
            </div>

            {/* Advance Payment Details & Screenshot Upload */}
            {paymentMethod === 'advance' && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Transfer your discounted total to our official accounts:</span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  {/* JazzCash */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-emerald-200">
                    <div>
                      <span className="text-slate-500">JazzCash: </span>
                      <strong className="text-slate-900">{settings.jazzCashAccount}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyAccount(settings.jazzCashAccount, 'jazz')}
                      className="px-2 py-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-[11px] font-bold flex items-center gap-1"
                    >
                      {copiedAccount === 'jazz' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedAccount === 'jazz' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* EasyPaisa */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-emerald-200">
                    <div>
                      <span className="text-slate-500">EasyPaisa: </span>
                      <strong className="text-slate-900">{settings.easyPaisaAccount}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyAccount(settings.easyPaisaAccount, 'easy')}
                      className="px-2 py-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-[11px] font-bold flex items-center gap-1"
                    >
                      {copiedAccount === 'easy' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedAccount === 'easy' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Meezan Bank */}
                  <div className="p-2.5 rounded-lg bg-white border border-emerald-200">
                    <div className="text-slate-500 mb-1">Bank Transfer:</div>
                    <div className="text-slate-900 text-[11px] font-bold break-all">
                      {settings.bankAccountDetails}
                    </div>
                  </div>
                </div>

                {/* Screenshot Upload Form */}
                <div>
                  <label className="block text-xs font-bold text-emerald-900 mb-1.5">
                    Upload Payment Screenshot / Receipt Proof *
                  </label>
                  <label className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-emerald-400 bg-white hover:bg-emerald-50/50 cursor-pointer transition-colors">
                    {paymentProofBase64 ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={paymentProofBase64}
                          alt="Payment Receipt Preview"
                          className="w-14 h-14 object-cover rounded-lg border border-emerald-600"
                        />
                        <div className="text-left text-xs">
                          <p className="text-emerald-900 font-bold">Screenshot attached successfully</p>
                          <p className="text-slate-500 text-[11px]">Click to change image</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-emerald-600 mb-1" />
                        <span className="text-xs text-emerald-900 font-bold">
                          Click to select payment screenshot
                        </span>
                        <span className="text-[10px] text-slate-500">PNG, JPG or JPEG up to 5MB</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {errors.proof && (
                    <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.proof}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Pricing Breakdown Summary */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Items Subtotal</span>
              <span className="text-slate-900 font-bold tabular-nums">{formatPKR(cartSubtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Fee</span>
              <span className="text-slate-900 font-bold tabular-nums">
                {shippingFee === 0 ? <span className="text-emerald-700 font-bold">FREE Delivery</span> : formatPKR(shippingFee)}
              </span>
            </div>
            {paymentMethod === 'advance' && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>10% Advance Payment Discount</span>
                <span className="tabular-nums">- {formatPKR(advanceDiscount)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-extrabold text-slate-900">
              <span>Total Payable</span>
              <span className="text-emerald-700 font-display tabular-nums">
                {formatPKR(finalTotal)}
              </span>
            </div>
          </div>

          {/* Prominent Trust Guarantees */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold">
              <PackageCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Allowed to Open Parcel / Check Before Payment — Verify your items with the courier rider before paying!</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Backed by 12 Months Official Hasnain Gadget Store Warranty.</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={cart.length === 0}
            className="w-full py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-sm tracking-wide uppercase active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(16,185,129,0.35)] cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Confirm & Place Order ({formatPKR(finalTotal)})</span>
          </button>
        </form>
      </div>
    </div>
  );
};
