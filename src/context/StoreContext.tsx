import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Product,
  CartItem,
  Order,
  Review,
  StoreSettings,
  Category,
  CategoryId,
  CustomerDetails,
  PaymentMethod,
  OrderStatus,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_REVIEWS,
  INITIAL_STORE_SETTINGS,
} from '../data/initialProducts';
import { trackMetaEvent, initMetaPixel } from '../utils/pixel';
import { verifyFallbackPassword, updateFallbackPassword } from '../utils/cryptoAuth';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  orders: Order[];
  reviews: Review[];
  settings: StoreSettings;

  // Cart Actions
  cartCount: number;
  cartSubtotal: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // UI & Navigation States
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  activeProductDetail: Product | null;
  setActiveProductDetail: (product: Product | null) => void;
  placedOrder: Order | null;
  setPlacedOrder: (order: Order | null) => void;
  selectedCategory: CategoryId | 'all';
  setSelectedCategory: (cat: CategoryId | 'all') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Checkout & Order Actions
  placeOrder: (
    customer: CustomerDetails,
    paymentMethod: PaymentMethod,
    paymentProofUrl?: string
  ) => Order;
  updateOrderStatus: (
    orderId: string,
    status: OrderStatus,
    trackingInfo?: { courierName?: string; trackingNumber?: string; trackingUrl?: string }
  ) => void;

  // Reviews
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;

  // Admin Actions
  isAdminLoggedIn: boolean;
  adminLogin: (passcode: string) => Promise<boolean>;
  changeAdminPassword: (
    currentPass: string,
    newPass: string
  ) => Promise<{ success: boolean; message: string }>;
  adminLogout: () => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (id: string, stock: number) => void;
  updateSettings: (updates: Partial<StoreSettings>) => void;
  resetToDefaults: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Products — initialized with EXACTLY 11 products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('hgs_products_exact11');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_PRODUCTS;
  });

  // Categories
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('hgs_categories_exact11');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_CATEGORIES;
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('hgs_cart');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('hgs_orders');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('hgs_reviews');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_REVIEWS;
  });

  // Store Settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('hgs_settings');
      if (saved) return { ...INITIAL_STORE_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // fallback
    }
    return INITIAL_STORE_SETTINGS;
  });

  // Admin Auth State (session-backed, no hardcoded password)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return Boolean(sessionStorage.getItem('hgs_admin_token'));
  });

  // Modals & Navigation
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeProductDetail, setActiveProductDetail] = useState<Product | null>(null);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Synchronize state with LocalStorage
  useEffect(() => {
    localStorage.setItem('hgs_products_exact11', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('hgs_categories_exact11', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('hgs_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('hgs_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('hgs_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('hgs_settings', JSON.stringify(settings));
    if (settings.metaPixelId) {
      initMetaPixel(settings.metaPixelId);
    }
  }, [settings]);

  // Verify admin session token on mount & check URL for admin access
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === 'true' || params.get('admin') === '1' || window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    }

    const token = sessionStorage.getItem('hgs_admin_token');
    if (token) {
      fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'x-admin-token': token },
      })
        .then((res) => {
          if (!res.ok) {
            sessionStorage.removeItem('hgs_admin_token');
            setIsAdminLoggedIn(false);
          }
        })
        .catch(() => {
          // If offline or server restarting, keep session valid
        });
    }
  }, []);

  // Cart Calculations
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stockQuantity);
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      const initialQty = Math.min(quantity, Math.max(1, product.stockQuantity));
      return [...prev, { product, quantity: initialQty }];
    });

    trackMetaEvent('AddToCart', {
      content_name: product.name,
      content_category: product.category,
      value: product.price * quantity,
      currency: 'PKR',
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const clamped = Math.min(quantity, item.product.stockQuantity);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Place Order
  const placeOrder = (
    customer: CustomerDetails,
    paymentMethod: PaymentMethod,
    paymentProofUrl?: string
  ): Order => {
    const isFreeShipping = cartSubtotal >= settings.freeShippingThreshold;
    const shipping = isFreeShipping || cartSubtotal === 0 ? 0 : settings.standardShippingFee;
    const discount =
      paymentMethod === 'advance'
        ? Math.round(cartSubtotal * (settings.advanceDiscountPercent / 100))
        : 0;
    const total = cartSubtotal - discount + shipping;

    const orderId = `HGS-${Date.now().toString().slice(-6)}`;

    const newOrder: Order = {
      id: orderId,
      customer,
      items: [...cart],
      subtotal: cartSubtotal,
      shipping,
      discount,
      total,
      paymentMethod,
      paymentProofUrl,
      status: 'New Order',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Update stock levels
    setProducts((prev) =>
      prev.map((prod) => {
        const cartItem = cart.find((item) => item.product.id === prod.id);
        if (cartItem) {
          const newStock = Math.max(0, prod.stockQuantity - cartItem.quantity);
          return {
            ...prod,
            stockQuantity: newStock,
            stockStatus: newStock === 0 ? 'out_of_stock' : newStock <= 5 ? 'low_stock' : 'in_stock',
          };
        }
        return prod;
      })
    );

    clearCart();
    setIsCheckoutOpen(false);
    setPlacedOrder(newOrder);

    trackMetaEvent('Purchase', {
      value: total,
      currency: 'PKR',
      num_items: cart.length,
      order_id: orderId,
    });

    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    trackingInfo?: { courierName?: string; trackingNumber?: string; trackingUrl?: string }
  ) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status,
              ...(trackingInfo || {}),
              updatedAt: new Date().toISOString(),
            }
          : order
      )
    );
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'date'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setReviews((prev) => [newRev, ...prev]);
  };

  // Secure Admin Authentication
  const adminLogin = async (passcode: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passcode }),
      });
      const data = await response.json();
      if (response.ok && data.success && data.token) {
        sessionStorage.setItem('hgs_admin_token', data.token);
        setIsAdminLoggedIn(true);
        return true;
      }
    } catch {
      // Server offline/fallback
    }

    // Fallback client-side salted PBKDF2 verification
    const isValid = await verifyFallbackPassword(passcode);
    if (isValid) {
      sessionStorage.setItem('hgs_admin_token', 'local_session_' + Date.now());
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const changeAdminPassword = async (
    currentPass: string,
    newPass: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPass, newPassword: newPass }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        if (data.token) sessionStorage.setItem('hgs_admin_token', data.token);
        return { success: true, message: data.message || 'Password changed successfully!' };
      } else {
        return { success: false, message: data.message || 'Failed to change password' };
      }
    } catch {
      // Fallback
      return await updateFallbackPassword(currentPass, newPass);
    }
  };

  const adminLogout = () => {
    const token = sessionStorage.getItem('hgs_admin_token');
    if (token && !token.startsWith('local_session_')) {
      fetch('/api/admin/logout', {
        method: 'POST',
        headers: { 'x-admin-token': token },
      }).catch(() => {});
    }
    sessionStorage.removeItem('hgs_admin_token');
    setIsAdminLoggedIn(false);
  };

  // Admin Catalog CRUD
  const addProduct = (prodData: Omit<Product, 'id' | 'createdAt'>): Product => {
    const newProduct: Product = {
      ...prodData,
      id: `hgs-prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updates };
          if (updates.stockQuantity !== undefined) {
            updated.stockStatus =
              updates.stockQuantity === 0
                ? 'out_of_stock'
                : updates.stockQuantity <= 5
                ? 'low_stock'
                : 'in_stock';
          }
          return updated;
        }
        return p;
      })
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateStock = (id: string, stock: number) => {
    const safeStock = Math.max(0, stock);
    updateProduct(id, {
      stockQuantity: safeStock,
      stockStatus:
        safeStock === 0 ? 'out_of_stock' : safeStock <= 5 ? 'low_stock' : 'in_stock',
    });
  };

  const updateSettings = (updates: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const resetToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setReviews(INITIAL_REVIEWS);
    setSettings(INITIAL_STORE_SETTINGS);
    localStorage.removeItem('hgs_products_exact11');
    localStorage.removeItem('hgs_categories_exact11');
    localStorage.removeItem('hgs_reviews');
    localStorage.removeItem('hgs_settings');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        cart,
        orders,
        reviews,
        settings,
        cartCount,
        cartSubtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isSearchOpen,
        setIsSearchOpen,
        isAdminOpen,
        setIsAdminOpen,
        activeProductDetail,
        setActiveProductDetail,
        placedOrder,
        setPlacedOrder,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        placeOrder,
        updateOrderStatus,
        addReview,
        isAdminLoggedIn,
        adminLogin,
        changeAdminPassword,
        adminLogout,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        updateSettings,
        resetToDefaults,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
