import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ShieldCheck, MessageSquare } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { getWhatsAppDirectSupportUrl } from '../../utils/whatsapp';

export const FAQSection: React.FC = () => {
  const { settings } = useStore();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the "Allowed to Open Parcel Before Payment" policy work?',
      a: 'When our delivery partner arrives at your address, you have the full right to open the flyer and inspect the product box and contents before handing over cash. If the item is incorrect or not as described, you can return it right then without paying anything.',
    },
    {
      q: 'What is covered under the 12 Months Official Warranty?',
      a: 'Our 1-year replacement warranty covers internal electronic faults, charging anomalies, bluetooth connectivity dropouts, speaker distortion, and hardware failures occurring under normal everyday use. Accidental water submersion beyond ratings or physical shattering is not covered.',
    },
    {
      q: 'How do I get the 10% discount on Advance Payment?',
      a: 'During checkout, simply select "Advance Payment" instead of "Cash on Delivery". The system will immediately deduce 10% from your order total. Send that discounted amount to our official JazzCash, EasyPaisa, or Meezan Bank account and upload a screenshot or send it to us on WhatsApp.',
    },
    {
      q: 'How can I place an order directly on WhatsApp?',
      a: `Every gadget card and product page features a direct "ORDER ON WHATSAPP" button. Clicking it opens a pre-composed chat with Muhammad Hasnain at ${settings.rawWhatsappNumber} including the product title, price, and specs. You can simply hit send!`,
    },
    {
      q: 'What are the delivery charges and shipping times?',
      a: `Delivery is FREE on orders above Rs. ${settings.freeShippingThreshold.toLocaleString()}. For smaller orders, a standard fee of Rs. ${settings.standardShippingFee} applies. Orders are dispatched within 24 hours and delivered within 2-4 working days across Pakistan.`,
    },
    {
      q: 'What courier companies do you use?',
      a: 'We partner with Leopards Courier, Trax, PostEx, and TCS to guarantee tracked delivery with explicit open-parcel instructions printed on every shipping label.',
    },
  ];

  return (
    <section id="contact-faq-section" className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300 text-xs font-mono uppercase text-emerald-800 tracking-wider mb-2 font-bold shadow-xs">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Clear, transparent answers about our gadgets, open parcel inspections, and warranty claims.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-xl bg-white border border-slate-200 shadow-xs overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span className="text-sm font-semibold text-slate-900">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-emerald-600 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions? */}
        <div className="mt-10 p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 shadow-xs">
          <p className="text-xs text-slate-600 font-medium">
            Have a custom requirement or question not listed here?
          </p>
          <a
            href={getWhatsAppDirectSupportUrl('FAQ Question', settings.whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat Directly on WhatsApp ({settings.rawWhatsappNumber})</span>
          </a>
        </div>
      </div>
    </section>
  );
};
