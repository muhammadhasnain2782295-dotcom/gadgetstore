import React from 'react';
import { useStore } from '../context/StoreContext';
import { formatPKR, formatDate } from '../utils/format';
import { getWhatsAppOrderConfirmationUrl } from '../utils/whatsapp';
import {
  CheckCircle2,
  X,
  PackageCheck,
  MessageSquare,
  Truck,
  ShieldCheck,
} from 'lucide-react';

export const OrderConfirmationModal: React.FC = () => {
  const { placedOrder, setPlacedOrder, settings } = useStore();

  if (!placedOrder) return null;

  const order = placedOrder;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-900">
        {/* Header with Green Celebration Badge */}
        <div className="p-6 bg-emerald-50 border-b border-emerald-200 text-center relative">
          <button
            onClick={() => setPlacedOrder(null)}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto mb-3 shadow-[0_2px_12px_rgba(16,185,129,0.2)]">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 uppercase tracking-tight">
            ORDER SUCCESSFULLY PLACED
          </h2>
          <p className="text-xs text-emerald-800 font-mono mt-1 font-semibold">
            Order Reference: <strong className="text-emerald-950">{order.id}</strong>
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          {/* Status Tracker */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-slate-500 uppercase font-medium">Live Status:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold">
                {order.status}
              </span>
            </div>

            {/* Stepper Dots */}
            <div className="grid grid-cols-4 gap-1 text-center pt-2">
              <div className="flex flex-col items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-emerald-600 ring-2 ring-emerald-600/30" />
                <span className="text-[10px] text-slate-900 font-bold">Received</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-emerald-300" />
                <span className="text-[10px] text-slate-500">Packed</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-slate-300" />
                <span className="text-[10px] text-slate-400">Dispatched</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-slate-300" />
                <span className="text-[10px] text-slate-400">Delivered</span>
              </div>
            </div>
          </div>

          {/* Open Parcel Reminder */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-emerald-900">
            <PackageCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-950 block mb-0.5">
                Allowed to Open Parcel Before Payment
              </strong>
              <span>
                When the courier arrives, open the package and inspect your items before handing over cash!
              </span>
            </div>
          </div>

          {/* Itemized summary */}
          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
            <div className="bg-slate-50 px-4 py-2 font-mono uppercase text-slate-500 text-[11px] font-bold">
              Purchased Gadgets
            </div>
            {order.items.map((item, idx) => (
              <div key={idx} className="p-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">{item.product.name}</p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Qty: {item.quantity} × {formatPKR(item.product.price)}
                  </p>
                </div>
                <span className="font-bold text-slate-900 tabular-nums">
                  {formatPKR(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
            <div className="p-3 bg-slate-50 space-y-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="tabular-nums font-medium">{formatPKR(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>10% Advance Discount</span>
                  <span className="tabular-nums">- {formatPKR(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="tabular-nums font-medium">
                  {order.shipping === 0 ? 'FREE' : formatPKR(order.shipping)}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 text-sm font-extrabold text-emerald-700">
                <span>Grand Total</span>
                <span className="tabular-nums">{formatPKR(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Customer & Address Details */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-slate-600">
            <p>
              <strong className="text-slate-900">Customer:</strong> {order.customer.fullName} ({order.customer.phone})
            </p>
            <p>
              <strong className="text-slate-900">Address:</strong> {order.customer.address}, {order.customer.city}
            </p>
            <p>
              <strong className="text-slate-900">Payment Method:</strong>{' '}
              {order.paymentMethod === 'advance' ? 'Advance Payment (Proof Uploaded)' : 'Cash on Delivery (COD)'}
            </p>
          </div>

          {/* Action to track / confirm via WhatsApp */}
          <a
            href={getWhatsAppOrderConfirmationUrl(
              order.id,
              order.total,
              order.customer.fullName,
              order.customer.city,
              settings.whatsappNumber
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_4px_18px_rgba(16,185,129,0.35)] cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Confirm & Track Order on WhatsApp ({settings.rawWhatsappNumber})</span>
          </a>
        </div>
      </div>
    </div>
  );
};
