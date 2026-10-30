import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  ShoppingCart,
  Trash2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Truck,
  Tag,
  CheckCircle,
  PackageOpen,
  Sparkles,
} from 'lucide-react';

export default function Cart() {
  const { cart, removeFromCart, clearCart, loading, actionLoading } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    if (promoCode.toUpperCase() === 'SAVE10' || promoCode.toUpperCase() === 'CODERWING') {
      setAppliedDiscount(0.1); // 10% discount
      setPromoMessage({ text: '10% discount applied!', success: true });
    } else {
      setAppliedDiscount(0);
      setPromoMessage({ text: 'Invalid promo code. Try "SAVE10"', success: false });
    }
  };

  const discountAmount = Number((cart.subtotal * appliedDiscount).toFixed(2));
  const finalTotal = Math.max(0, Number((cart.total - discountAmount).toFixed(2)));

  const freeShippingThreshold = 100;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cart.subtotal);
  const freeShippingProgress = Math.min(100, (cart.subtotal / freeShippingThreshold) * 100);

  const handleCheckout = () => {
    setIsCheckoutModalOpen(true);
  };

  const handleFinishCheckout = () => {
    clearCart();
    setIsCheckoutModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500 font-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full text-center bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-xl shadow-slate-200/40">
          <div className="w-20 h-20 rounded-3xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-inner">
            <PackageOpen className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Your Cart is Empty</h2>
          <p className="text-sm text-slate-500 mt-2 mb-8 leading-relaxed">
            Looks like you haven't added anything to your cart yet. Explore our collection of premium gear and tech essentials.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
          <button
            onClick={clearCart}
            disabled={actionLoading}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
          >
            Clear Entire Cart
          </button>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">
          Shopping Cart ({cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free Shipping Progress Alert */}
            <div className="p-4 rounded-2xl bg-white border border-indigo-100 shadow-sm">
              <div className="flex items-center justify-between text-xs font-medium mb-2">
                <span className="flex items-center gap-1.5 text-indigo-900">
                  <Truck className="w-4 h-4 text-indigo-600" />
                  {amountToFreeShipping > 0
                    ? `Add $${amountToFreeShipping.toFixed(2)} more to get FREE Delivery!`
                    : '🎉 You have unlocked FREE Delivery!'}
                </span>
                <span className="text-indigo-600 font-bold">{Math.round(freeShippingProgress)}%</span>
              </div>
              <div className="w-full h-2 bg-indigo-50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500 rounded-full"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* List of items */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden divide-y divide-slate-100">
              {cart.items.map((item) => {
                const product = item.product;
                if (!product) return null;

                const itemSubtotal = product.price * item.quantity;

                return (
                  <div
                    key={item._id || product._id}
                    className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 transition-colors hover:bg-slate-50/50"
                  >
                    {/* Image & Title */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200/60">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                          {product.category}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          Unit Price: ${product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity & Line Total */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      {/* Quantity Display */}
                      <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700">
                        Qty: {item.quantity}
                      </span>

                      {/* Total for item */}
                      <div className="text-right min-w-[80px]">
                        <p className="text-sm sm:text-base font-extrabold text-slate-900">
                          ${itemSubtotal.toFixed(2)}
                        </p>
                      </div>

                      {/* Delete button */}
                      <button
                        onClick={() => removeFromCart(product._id, product.name)}
                        disabled={actionLoading}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Remove product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-lg shadow-slate-200/30 p-6 sm:p-7 space-y-6">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight pb-3 border-b border-slate-100">
                Order Summary
              </h2>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Promo / Coupon Code
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="e.g. SAVE10"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 uppercase tracking-wider focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p
                    className={`text-xs font-medium ${
                      promoMessage.success ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {promoMessage.text}
                  </p>
                )}
              </form>

              {/* Breakdown */}
              <div className="space-y-3 pt-3 border-t border-slate-100 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">${cart.subtotal.toFixed(2)}</span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount (10%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-slate-900">
                    {cart.shipping === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `$${cart.shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-semibold text-slate-900">${cart.tax.toFixed(2)}</span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="text-base font-bold text-slate-900">Total</span>
                  <span className="text-2xl font-extrabold text-indigo-600">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Safe & Secure Guarantees */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>256-Bit SSL End-to-End Encrypted Checkout</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Fast tracked 2-3 business day delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Success Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-slate-900">Order Confirmed!</h3>
              <p className="text-sm text-slate-500 mt-2">
                Thank you for your purchase. We have received your order and are preparing it for shipment.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Order Number:</span>
                <span className="font-bold text-slate-800">
                  #CW-{Math.floor(100000 + Math.random() * 900000)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-bold text-indigo-600">${finalTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estimated Delivery:</span>
                <span className="font-bold text-slate-800">2-4 Business Days</span>
              </div>
            </div>

            <button
              onClick={handleFinishCheckout}
              className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/30 transition-all"
            >
              Back to Store
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

