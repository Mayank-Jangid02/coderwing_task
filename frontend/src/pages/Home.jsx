import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { useCart } from '../context/CartContext';
import {
  ShoppingCart,
  Star,
  Sparkles,
  ArrowRight,
  Check,
  Package,
  Zap,
} from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);

  const { addToCart } = useCart();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory && selectedCategory !== 'All') {
        params.category = selectedCategory;
      }

      const res = await apiClient.get('/products', { params });
      if (res.data?.products) {
        setProducts(res.data.products);
        if (res.data.categories && res.data.categories.length > 0) {
          setCategories(res.data.categories);
        }
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const handleAddToCart = async (product) => {
    setAddingId(product._id);
    await addToCart(product._id, 1, product.name);
    setTimeout(() => {
      setAddingId(null);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-900 text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.25),rgba(255,255,255,0))] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Next-Gen Collection 2026</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Gear Up With <br />
                <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-pink-400 bg-clip-text text-transparent">
                  Smart Tech & Essentials
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Discover exceptional electronics, modern accessories, audio gear, and lifestyle products curated with speed and precision.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#products"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
                >
                  <span>Explore Products</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-slate-300 text-xs">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Free shipping on all orders over $100</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
                <div className="aspect-video w-full rounded-2xl overflow-hidden relative mb-5 shadow-inner">
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
                    alt="Featured Headphone"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-indigo-600/90 text-white text-xs font-bold shadow-md">
                    Featured Pick
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-indigo-300">
                    <span>Premium Audio</span>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-semibold text-white">4.8</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-white text-base">Sony WH-1000XM5 Headphones</h3>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    Industry-leading noise cancellation, exceptional sound quality with 30-hour battery life.
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xl font-extrabold text-white">$349.99</span>
                    <a
                      href="#products"
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      Shop Now <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content / Product Catalog Section */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Category Tabs Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md shadow-slate-200/40 p-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide whitespace-nowrap transition-all ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {selectedCategory === 'All' ? 'All Products' : `${selectedCategory} Collection`}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Showing {products.length} {products.length === 1 ? 'item' : 'items'}
            </p>
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="bg-white rounded-3xl border border-slate-200/80 p-4 animate-pulse space-y-4"
              >
                <div className="aspect-square bg-slate-200 rounded-2xl w-full" />
                <div className="h-4 bg-slate-200 rounded w-2/3" />
                <div className="h-3 bg-slate-200 rounded w-full" />
                <div className="h-5 bg-slate-200 rounded w-1/3" />
                <div className="h-10 bg-slate-200 rounded-xl w-full" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8">
            <Package className="w-14 h-14 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800">No products found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              We couldn't find any products in this category.
            </p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="mt-5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow hover:bg-indigo-700 transition-colors"
            >
              Reset Category
            </button>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const discountPercent =
                product.originalPrice && product.originalPrice > product.price
                  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                  : null;

              return (
                <div
                  key={product._id}
                  className="group bg-white rounded-3xl border border-slate-200/70 hover:border-indigo-200 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col overflow-hidden"
                >
                  {/* Product Image Area */}
                  <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-semibold text-slate-800 shadow-sm border border-slate-200/60">
                        {product.category}
                      </span>
                      {discountPercent && (
                        <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white text-[10px] font-bold shadow-sm">
                          {discountPercent}% OFF
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-5 flex-1 flex flex-col">
                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="flex items-center text-amber-400">
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">
                        {product.rating?.rate || 4.5}
                      </span>
                      <span className="text-xs text-slate-400">
                        ({product.rating?.count || 100})
                      </span>
                    </div>

                    {/* Name */}
                    <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {product.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed flex-1">
                      {product.description}
                    </p>

                    {/* Price and Add to Cart Section */}
                    <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-extrabold text-slate-900">
                            ${product.price.toFixed(2)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-slate-400 line-through">
                              ${product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-emerald-600 font-medium">In Stock</span>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={addingId === product._id}
                        className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          addingId === product._id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/30 hover:scale-105'
                        }`}
                        title="Add to Cart"
                      >
                        {addingId === product._id ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
