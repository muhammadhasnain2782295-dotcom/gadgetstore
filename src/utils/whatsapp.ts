/**
 * WhatsApp integration utilities for Hasnain Gadget Store
 * Official WhatsApp: 03010980742 (International: 923010980742)
 */

export const OFFICIAL_WHATSAPP_NUMBER = '923010980742';
export const DISPLAY_WHATSAPP_NUMBER = '03010980742';

export function getWhatsAppProductUrl(
  productName: string,
  price: number,
  quantity = 1,
  whatsappNumber = OFFICIAL_WHATSAPP_NUMBER
): string {
  const message = `Assalam-o-Alaikum Hasnain Gadget Store!
I want to order:
• Product: ${productName}
• Quantity: ${quantity}
• Price: Rs. ${price.toLocaleString()}
• Warranty: 12 Months Official Warranty
• Condition: Allowed to Open Parcel Before Payment

Please confirm my order and dispatch details.`;

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppOrderConfirmationUrl(
  orderId: string,
  total: number,
  customerName: string,
  city: string,
  whatsappNumber = OFFICIAL_WHATSAPP_NUMBER
): string {
  const message = `Assalam-o-Alaikum Hasnain Gadget Store!
I placed an order on your website:
• Order ID: ${orderId}
• Name: ${customerName}
• City: ${city}
• Total Amount: Rs. ${total.toLocaleString()}

Please verify and share tracking details. Thank you!`;

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppDirectSupportUrl(
  topic = 'General Inquiry',
  whatsappNumber = OFFICIAL_WHATSAPP_NUMBER
): string {
  const message = `Assalam-o-Alaikum Hasnain Gadget Store!
I have an inquiry regarding: ${topic}.
Please guide me about your 12 Months Warranty and Open Parcel policy.`;

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
