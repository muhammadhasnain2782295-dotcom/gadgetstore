import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, Order, OrderStatus, CategoryId } from '../../types';
import { formatPKR, formatDate } from '../../utils/format';
import {
  X,
  Lock,
  Package,
  ShoppingBag,
  Settings,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertTriangle,
  LogOut,
  Sliders,
  Sparkles,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';

export const AdminModal: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    isAdminLoggedIn,
    adminLogin,
    changeAdminPassword,
    adminLogout,
    products,
    categories,
    orders,
    settings,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    updateOrderStatus,
    updateSettings,
    resetToDefaults,
  } = useStore();

  const [passcode, setPasscode] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'inventory' | 'settings' | 'password'>('products');

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwordChangeStatus, setPasswordChangeStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [passwordChanging, setPasswordChanging] = useState(false);

  // Product Form State (for Add / Edit)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('Hasnain Pro Series');
  const [formCategory, setFormCategory] = useState<CategoryId>('airpods-pro-2');
  const [formSku, setFormSku] = useState('');
  const [formPrice, setFormPrice] = useState<number>(3499);
  const [formOldPrice, setFormOldPrice] = useState<number>(4999);
  const [formStock, setFormStock] = useState<number>(25);
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formFullDesc, setFormFullDesc] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formFeatured, setFormFeatured] = useState(false);
  const [formBestSeller, setFormBestSeller] = useState(false);
  const [formNewArrival, setFormNewArrival] = useState(false);
  const [formWarranty, setFormWarranty] = useState('12 Months Official Warranty');

  // Order Detail Viewer State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (!isAdminOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;
    setLoginLoading(true);
    setLoginError('');

    try {
      const success = await adminLogin(passcode.trim());
      if (success) {
        setPasscode('');
        setLoginError('');
      } else {
        setLoginError('Incorrect Admin Password. Please try again.');
      }
    } catch {
      setLoginError('Authentication failed. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeStatus({ type: null, message: '' });

    if (!currentPassword) {
      setPasswordChangeStatus({ type: 'error', message: 'Current password is required.' });
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      setPasswordChangeStatus({ type: 'error', message: 'New password must be at least 4 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordChangeStatus({ type: 'error', message: 'New password and confirmation do not match.' });
      return;
    }

    setPasswordChanging(true);
    try {
      const result = await changeAdminPassword(currentPassword, newPassword);
      if (result.success) {
        setPasswordChangeStatus({
          type: 'success',
          message: 'Admin Password successfully updated! You can change it anytime.',
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordChangeStatus({
          type: 'error',
          message: result.message || 'Incorrect current password.',
        });
      }
    } catch {
      setPasswordChangeStatus({
        type: 'error',
        message: 'An error occurred while updating the password.',
      });
    } finally {
      setPasswordChanging(false);
    }
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setFormName('');
    setFormBrand('Hasnain Audio');
    setFormCategory('airpods-pro-2');
    setFormSku(`HGS-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormPrice(3499);
    setFormOldPrice(4999);
    setFormStock(25);
    setFormShortDesc('');
    setFormFullDesc('');
    setFormImageUrl('/src/assets/images/airpods_pro2_white_1791007889623.jpg');
    setFormFeatured(false);
    setFormBestSeller(false);
    setFormNewArrival(true);
    setFormWarranty('12 Months Official Warranty');
    setIsFormOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormBrand(prod.brand);
    setFormCategory(prod.category);
    setFormSku(prod.sku);
    setFormPrice(prod.price);
    setFormOldPrice(prod.oldPrice || 0);
    setFormStock(prod.stockQuantity);
    setFormShortDesc(prod.shortDescription);
    setFormFullDesc(prod.fullDescription);
    setFormImageUrl(prod.images[0] || '');
    setFormFeatured(Boolean(prod.featured));
    setFormBestSeller(Boolean(prod.bestSeller));
    setFormNewArrival(Boolean(prod.newArrival));
    setFormWarranty(prod.warranty);
    setIsFormOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || formPrice <= 0) return;

    const discountPercent =
      formOldPrice && formOldPrice > formPrice
        ? Math.round(((formOldPrice - formPrice) / formOldPrice) * 100)
        : undefined;

    const payload = {
      name: formName.trim(),
      brand: formBrand.trim() || 'Hasnain Gadget Store',
      category: formCategory,
      sku: formSku.trim() || `HGS-${Date.now().toString().slice(-4)}`,
      price: formPrice,
      oldPrice: formOldPrice > formPrice ? formOldPrice : undefined,
      discountPercent,
      shortDescription: formShortDesc.trim() || `${formName} with 12 Months Official Warranty.`,
      fullDescription: formFullDesc.trim() || formShortDesc.trim(),
      specifications: [
        { label: 'Category', value: formCategory },
        { label: 'Warranty', value: formWarranty },
        { label: 'Inspection', value: 'Allowed to Open Parcel Before Payment' },
      ],
      images: [formImageUrl || '/src/assets/images/airpods_pro2_white_1791007889623.jpg'],
      stockQuantity: formStock,
      stockStatus:
        formStock === 0
          ? ('out_of_stock' as const)
          : formStock <= 5
          ? ('low_stock' as const)
          : ('in_stock' as const),
      featured: formFeatured,
      bestSeller: formBestSeller,
      newArrival: formNewArrival,
      onSale: Boolean(formOldPrice && formOldPrice > formPrice),
      warranty: formWarranty,
      openParcelAllowed: true,
      rating: 5.0,
      reviewsCount: 1,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
    } else {
      addProduct(payload);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col text-slate-900">
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display uppercase tracking-wide text-slate-900">
                Hasnain Gadget Store — Admin Panel
              </h2>
              <span className="text-[11px] font-mono text-emerald-700 font-bold">
                {isAdminLoggedIn ? 'Secure Owner Session Active' : 'Password Protected'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminLoggedIn && (
              <>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    activeTab === 'password'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                  }`}
                  title="Change Admin Password"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Change Password</span>
                </button>

                <button
                  onClick={adminLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-xs font-bold transition-colors"
                  title="Logout from Admin Panel"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </>
            )}

            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-colors"
              aria-label="Close admin dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {!isAdminLoggedIn ? (
          /* Login Screen */
          <div className="p-8 max-w-md mx-auto my-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 mx-auto shadow-sm">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-display text-slate-900">
                Store Owner Access
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter your administrative password to manage the 11 products, orders, stock, and settings.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter Admin Password"
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-center text-base focus:border-emerald-500 focus:outline-none tracking-wider"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  title={showLoginPassword ? 'Hide password' : 'Show password'}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {loginError && (
                <p className="text-xs text-rose-600 mt-2 font-medium">{loginError}</p>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
              >
                {loginLoading ? 'Authenticating...' : 'Authenticate & Enter Dashboard'}
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 overflow-hidden flex flex-col bg-white">
            {/* Tabs Bar */}
            <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 bg-slate-50 overflow-x-auto text-xs">
              <button
                onClick={() => setActiveTab('products')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-bold transition-colors border-b-2 ${
                  activeTab === 'products'
                    ? 'border-emerald-600 text-emerald-800 bg-white shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Product Catalog ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-bold transition-colors border-b-2 ${
                  activeTab === 'orders'
                    ? 'border-emerald-600 text-emerald-800 bg-white shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Customer Orders ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('inventory')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-bold transition-colors border-b-2 ${
                  activeTab === 'inventory'
                    ? 'border-emerald-600 text-emerald-800 bg-white shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>Inventory & Stock</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-bold transition-colors border-b-2 ${
                  activeTab === 'settings'
                    ? 'border-emerald-600 text-emerald-800 bg-white shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Store Settings</span>
              </button>

              <button
                onClick={() => setActiveTab('password')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-bold transition-colors border-b-2 ${
                  activeTab === 'password'
                    ? 'border-emerald-600 text-emerald-800 bg-white shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <KeyRound className="w-4 h-4 text-emerald-600" />
                <span>Change Password</span>
              </button>
            </div>

            {/* Tab 1: Products */}
            {activeTab === 'products' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Product Catalog ({products.length} Products)
                    </h3>
                    <p className="text-xs text-slate-500">
                      You can add, edit, change prices, update images, and delete products anytime.
                    </p>
                  </div>
                  <button
                    onClick={handleOpenAddProduct}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Product</span>
                  </button>
                </div>

                {/* Products Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-mono uppercase text-[11px] border-b border-slate-200 font-bold">
                      <tr>
                        <th className="py-3 px-4">Product</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Sale Price</th>
                        <th className="py-3 px-4">Stock</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/70">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.images[0] || '/src/assets/images/airpods_pro2_white_1791007889623.jpg'}
                                alt={p.name}
                                className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                              />
                              <div>
                                <span className="font-bold text-slate-900 block">{p.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  SKU: {p.sku}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] uppercase font-bold">
                              {p.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900 font-display">
                            {formatPKR(p.price)}
                          </td>
                          <td className="py-3 px-4 text-slate-400 font-display">
                            {p.oldPrice ? formatPKR(p.oldPrice) : '—'}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                                p.stockQuantity === 0
                                  ? 'bg-rose-100 text-rose-800'
                                  : p.stockQuantity <= 5
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {p.stockQuantity} Units
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                                title="Edit Product"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
                                    deleteProduct(p.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 2: Orders */}
            {activeTab === 'orders' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Customer Orders ({orders.length})</h3>
                  <p className="text-xs text-slate-500">
                    Live record of orders placed via Cash on Delivery or Advance Payment.
                  </p>
                </div>

                {orders.length === 0 ? (
                  <div className="py-12 text-center border border-slate-200 rounded-xl bg-slate-50">
                    <ShoppingBag className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-700">No orders received yet</p>
                    <p className="text-xs text-slate-400">
                      When customers place orders, they will instantly appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                          <div>
                            <span className="font-mono font-bold text-sm text-slate-900">
                              Order ID: {ord.id}
                            </span>
                            <span className="text-xs text-slate-400 ml-2 font-mono">
                              {formatDate(ord.createdAt)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                ord.paymentMethod === 'advance'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-slate-100 text-slate-800 border border-slate-300'
                              }`}
                            >
                              {ord.paymentMethod === 'advance' ? '10% Advance Paid' : 'Cash on Delivery'}
                            </span>

                            <select
                              value={ord.status}
                              onChange={(e) =>
                                updateOrderStatus(ord.id, e.target.value as OrderStatus)
                              }
                              className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none"
                            >
                              <option value="New Order">New Order</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Packed">Packed</option>
                              <option value="Dispatched">Dispatched</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-slate-500 font-mono text-[11px] uppercase block mb-1">
                              Customer Information:
                            </span>
                            <div className="font-bold text-slate-900">{ord.customer.fullName}</div>
                            <div className="text-slate-700 font-mono">{ord.customer.phone}</div>
                            <div className="text-slate-600 mt-1">
                              {ord.customer.address}, {ord.customer.city}{' '}
                              {ord.customer.postalCode && `(${ord.customer.postalCode})`}
                            </div>
                            {ord.customer.orderNotes && (
                              <div className="text-emerald-700 mt-1 italic">
                                Note: "{ord.customer.orderNotes}"
                              </div>
                            )}
                          </div>

                          <div>
                            <span className="text-slate-500 font-mono text-[11px] uppercase block mb-1">
                              Ordered Items:
                            </span>
                            <div className="space-y-1">
                              {ord.items.map((it, i) => (
                                <div key={i} className="flex justify-between text-slate-800">
                                  <span>
                                    {it.product.name} × <strong>{it.quantity}</strong>
                                  </span>
                                  <span className="font-mono font-bold">
                                    {formatPKR(it.product.price * it.quantity)}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <div className="pt-2 mt-2 border-t border-slate-100 flex justify-between font-bold text-slate-900">
                              <span>Total Amount:</span>
                              <span className="text-emerald-700 font-display">
                                {formatPKR(ord.total)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {ord.paymentProofUrl && (
                          <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
                            <span className="text-xs text-slate-500 font-mono">Payment Proof:</span>
                            <img
                              src={ord.paymentProofUrl}
                              alt="Payment Proof"
                              className="w-12 h-12 object-cover rounded border border-slate-300 cursor-pointer"
                              onClick={() => window.open(ord.paymentProofUrl, '_blank')}
                            />
                            <span className="text-[11px] text-slate-500">
                              Click image to open full resolution
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Inventory */}
            {activeTab === 'inventory' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Inventory & Stock Quantities</h3>
                  <p className="text-xs text-slate-500">
                    Quickly adjust available stock numbers. Products reaching 0 units will automatically show as Sold Out.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={p.images[0] || '/src/assets/images/airpods_pro2_white_1791007889623.jpg'}
                          alt={p.name}
                          className="w-12 h-12 rounded-lg object-cover bg-white border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{p.name}</h4>
                          <span className="text-[11px] text-emerald-700 font-mono font-bold">
                            {formatPKR(p.price)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <input
                          type="number"
                          min="0"
                          value={p.stockQuantity}
                          onChange={(e) => updateStock(p.id, Number(e.target.value))}
                          className="w-16 px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs font-mono text-center focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Settings */}
            {activeTab === 'settings' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-3xl">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Store Settings</h3>
                  <p className="text-xs text-slate-500">
                    Manage store contact numbers, bank payment accounts, and social links.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">
                        WhatsApp Contact Number
                      </label>
                      <input
                        type="text"
                        value={settings.rawWhatsappNumber}
                        onChange={(e) =>
                          updateSettings({
                            rawWhatsappNumber: e.target.value,
                            whatsappNumber: e.target.value.replace(/^0/, '92'),
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">
                        Advance Payment Discount (%)
                      </label>
                      <input
                        type="number"
                        value={settings.advanceDiscountPercent}
                        onChange={(e) =>
                          updateSettings({ advanceDiscountPercent: Number(e.target.value) })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">
                        Free Delivery Threshold (Rs.)
                      </label>
                      <input
                        type="number"
                        value={settings.freeShippingThreshold}
                        onChange={(e) =>
                          updateSettings({ freeShippingThreshold: Number(e.target.value) })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">
                        Standard Shipping Fee (Rs.)
                      </label>
                      <input
                        type="number"
                        value={settings.standardShippingFee}
                        onChange={(e) =>
                          updateSettings({ standardShippingFee: Number(e.target.value) })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      TikTok Profile URL
                    </label>
                    <input
                      type="text"
                      value={settings.tiktokUrl}
                      onChange={(e) => updateSettings({ tiktokUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Facebook Page URL
                    </label>
                    <input
                      type="text"
                      value={settings.facebookUrl}
                      onChange={(e) => updateSettings({ facebookUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">
                        JazzCash Account Details
                      </label>
                      <input
                        type="text"
                        value={settings.jazzCashAccount}
                        onChange={(e) => updateSettings({ jazzCashAccount: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">
                        EasyPaisa Account Details
                      </label>
                      <input
                        type="text"
                        value={settings.easyPaisaAccount}
                        onChange={(e) => updateSettings({ easyPaisaAccount: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Bank Transfer Details
                    </label>
                    <textarea
                      rows={2}
                      value={settings.bankAccountDetails}
                      onChange={(e) => updateSettings({ bankAccountDetails: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                    <button
                      onClick={() => {
                        if (confirm('Reset to the 11 original products and clean settings?')) {
                          resetToDefaults();
                        }
                      }}
                      className="text-slate-400 hover:text-rose-600 text-xs font-mono underline"
                    >
                      Reset Catalog to Exact 11 Default Products
                    </button>
                    <div className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Changes auto-saved instantly</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Change Password (CLEARLY VISIBLE DEDICATED TAB) */}
            {activeTab === 'password' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-xl mx-auto w-full">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2 border border-emerald-300">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    Change Admin Password
                  </h3>
                  <p className="text-xs text-slate-500">
                    You can change your Admin Password whenever you want, unlimited times.
                  </p>
                </div>

                {passwordChangeStatus.type === 'success' && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2 shadow-xs">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold">{passwordChangeStatus.message}</span>
                  </div>
                )}

                {passwordChangeStatus.type === 'error' && (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-center gap-2 shadow-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span className="font-semibold">{passwordChangeStatus.message}</span>
                  </div>
                )}

                <form onSubmit={handleChangePasswordSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Current Admin Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswordFields ? 'text' : 'password'}
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter your current password"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      New Admin Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswordFields ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new strong password"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Minimum 4 characters
                    </span>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Confirm New Admin Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswordFields ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                      <input
                        type="checkbox"
                        checked={showPasswordFields}
                        onChange={(e) => setShowPasswordFields(e.target.checked)}
                        className="accent-emerald-600"
                      />
                      <span>Show passwords</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={passwordChanging}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
                  >
                    {passwordChanging ? 'Verifying & Updating...' : 'Update Admin Password'}
                  </button>
                </form>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Security Highlights</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    • Your password is never stored or revealed in frontend code.
                    <br />• You can change it unlimited times whenever needed.
                    <br />• Ensure you remember your new password after updating.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Product Add / Edit Sub-Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70">
            <div className="w-full max-w-xl bg-white border border-slate-300 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-slate-900">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h4 className="text-base font-bold text-slate-900 font-display">
                  {editingProduct ? 'Edit Gadget' : 'Add New Gadget'}
                </h4>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. AirPods Pro 2 — Black"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Category *</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="airpods-pro-2">AirPods Pro 2</option>
                      <option value="airpods-4-pro">AirPods 4 Pro</option>
                      <option value="accessories">Accessories</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Brand</label>
                    <input
                      type="text"
                      value={formBrand}
                      onChange={(e) => setFormBrand(e.target.value)}
                      placeholder="e.g. Hasnain Audio"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Price (Rs.) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Sale / Old Price</label>
                    <input
                      type="number"
                      min="0"
                      value={formOldPrice}
                      onChange={(e) => setFormOldPrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Stock Units *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formStock}
                      onChange={(e) => setFormStock(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Image URL / Path</label>
                  <input
                    type="text"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="e.g. /src/assets/images/airpods_pro2_black_1791007878597.jpg"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:border-emerald-500 focus:outline-none"
                  />
                  {formImageUrl && (
                    <div className="mt-2 flex items-center gap-2">
                      <img
                        src={formImageUrl}
                        alt="Preview"
                        className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                      />
                      <span className="text-[11px] text-slate-500">Image preview</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Short Description *</label>
                  <textarea
                    rows={2}
                    required
                    value={formShortDesc}
                    onChange={(e) => setFormShortDesc(e.target.value)}
                    placeholder="Brief highlight displayed on the product card..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Full Description</label>
                  <textarea
                    rows={3}
                    value={formFullDesc}
                    onChange={(e) => setFormFullDesc(e.target.value)}
                    placeholder="Detailed specifications and features..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={formFeatured}
                      onChange={(e) => setFormFeatured(e.target.checked)}
                      className="accent-emerald-600"
                    />
                    <span>Featured Flagship</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={formBestSeller}
                      onChange={(e) => setFormBestSeller(e.target.checked)}
                      className="accent-emerald-600"
                    />
                    <span>Best Seller Badge</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={formNewArrival}
                      onChange={(e) => setFormNewArrival(e.target.checked)}
                      className="accent-emerald-600"
                    />
                    <span>New Arrival Badge</span>
                  </label>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider shadow-xs cursor-pointer"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
