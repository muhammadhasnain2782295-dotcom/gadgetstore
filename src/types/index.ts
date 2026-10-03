export type CategoryId =
  | 'airpods-pro-2'
  | 'airpods-4-pro'
  | 'accessories'
  | string;

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  image: string;
  itemCount?: number;
}

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: CategoryId;
  sku: string;
  price: number; // PKR
  oldPrice?: number;
  discountPercent?: number;
  shortDescription: string;
  fullDescription: string;
  specifications: ProductSpecification[];
  images: string[];
  stockQuantity: number;
  stockStatus: StockStatus;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  onSale?: boolean;
  warranty: string; // e.g. "12 Months Official Warranty"
  openParcelAllowed: boolean;
  rating: number;
  reviewsCount: number;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PaymentMethod = 'cod' | 'advance';

export type OrderStatus =
  | 'New Order'
  | 'Confirmed'
  | 'Packed'
  | 'Dispatched'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

export interface CustomerDetails {
  fullName: string;
  phone: string; // WhatsApp number
  address: string;
  city: string;
  postalCode?: string;
  orderNotes?: string;
}

export interface Order {
  id: string;
  customer: CustomerDetails;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number; // 10% on advance payment
  total: number;
  paymentMethod: PaymentMethod;
  paymentProofUrl?: string; // Base64 or image url
  status: OrderStatus;
  courierName?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  city: string;
  rating: number;
  comment: string;
  verifiedBuyer: boolean;
  date: string;
}

export interface StoreSettings {
  storeName: string;
  whatsappNumber: string;
  rawWhatsappNumber: string; // e.g. 03010980742
  tiktokUrl: string;
  facebookUrl: string;
  shopAddress: string;
  warrantyText: string;
  openParcelText: string;
  advanceDiscountPercent: number;
  freeShippingThreshold: number;
  standardShippingFee: number;
  jazzCashAccount: string;
  jazzCashTitle: string;
  easyPaisaAccount: string;
  easyPaisaTitle: string;
  ublAccount: string;
  ublTitle: string;
  bankAccountDetails: string;
  metaPixelId?: string;
  logoUrl?: string;
  bannerImageUrl?: string;
}
