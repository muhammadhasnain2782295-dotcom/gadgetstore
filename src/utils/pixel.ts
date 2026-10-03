/**
 * Meta Pixel & Ads Tracking Manager
 * Ready for paid traffic and standard e-commerce events:
 * - PageView
 * - ViewContent
 * - AddToCart
 * - InitiateCheckout
 * - Purchase
 * - Contact / Lead
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}

export function initMetaPixel(pixelId?: string) {
  if (!pixelId || typeof window === 'undefined') return;

  // Check if already injected
  if (window.fbq) return;

  /* eslint-disable */
  (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(
    window,
    document,
    'script',
    'https://connect.facebook.net/en_US/fbevents.js'
  );

  window.fbq?.('init', pixelId);
  window.fbq?.('track', 'PageView');
}

export function trackMetaEvent(
  eventName:
    | 'PageView'
    | 'ViewContent'
    | 'AddToCart'
    | 'InitiateCheckout'
    | 'Purchase'
    | 'Lead'
    | 'Contact',
  data?: Record<string, unknown>
) {
  if (typeof window !== 'undefined' && window.fbq) {
    try {
      window.fbq('track', eventName, data);
    } catch {
      // Quiet fail if ad-blocker is present
    }
  }

  // Also log in debug mode to facilitate verification
  if (process.env.NODE_ENV !== 'production') {
    // Quiet console log for developers
    console.debug(`[Meta Ads Tracker] ${eventName}:`, data);
  }
}
