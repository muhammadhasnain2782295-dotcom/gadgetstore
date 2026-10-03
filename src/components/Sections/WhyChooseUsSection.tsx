import React from 'react';
import { ShieldCheck, PackageCheck, Zap, Lock, Headset } from 'lucide-react';

export const WhyChooseUsSection: React.FC = () => {
  const trustPoints = [
    {
      icon: ShieldCheck,
      title: '12 Months Official Warranty',
      desc: 'All gadgets come with our genuine 1-year replacement warranty against technical defects.',
    },
    {
      icon: PackageCheck,
      title: 'Allowed to Open Parcel',
      desc: 'Inspect your order before paying the courier rider. Zero risk, 100% peace of mind.',
    },
    {
      icon: Zap,
      title: 'Fast Nationwide Delivery',
      desc: 'Express dispatch via top couriers across Karachi, Lahore, Islamabad, and every city in Pakistan.',
    },
    {
      icon: Lock,
      title: 'Secure Ordering & 10% Off',
      desc: 'Choose Cash on Delivery or get 10% instant discount when you pay in advance via JazzCash or EasyPaisa.',
    },
    {
      icon: Headset,
      title: 'Direct WhatsApp Support',
      desc: 'Chat directly with Muhammad Hasnain for order assistance, recommendations, and prompt warranty claims.',
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300 text-xs font-mono uppercase text-emerald-800 tracking-wider font-bold shadow-xs">
            Trust & Reliability
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-900 mt-2">
            Why Choose Hasnain Gadget Store?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Built on customer satisfaction, transparent policies, and premium authentic hardware.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {trustPoints.map((point, idx) => {
            const IconComponent = point.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500/50 hover:shadow-[0_10px_25px_rgba(16,185,129,0.1)] transition-all flex flex-col items-center text-center group shadow-xs"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 group-hover:bg-emerald-100 transition-all">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug">
                  {point.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {point.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
