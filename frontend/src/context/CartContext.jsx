import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../api/apiClient';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    totalItems: 0,
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const fetchCart = useCallback(async () => {
    try {
      const res = await apiClient.get('/cart');
      if (res.data?.cart) {
        setCart(res.data.cart);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1, productName = 'Item') => {
    setActionLoading(true);
    try {
      const res = await apiClient.post('/cart/add', { productId, quantity });
      if (res.data?.cart) {
        setCart(res.data.cart);
        showToast(`Added ${quantity > 1 ? `${quantity}x ` : ''}${productName} to your cart!`, 'success');
        return true;
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      showToast(err.response?.data?.message || 'Failed to add item to cart', 'error');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    setActionLoading(true);
    try {
      const res = await apiClient.put(`/cart/${productId}`, { quantity });
      if (res.data?.cart) {
        setCart(res.data.cart);
        showToast('Cart updated', 'info');
      }
    } catch (err) {
      console.error('Error updating cart quantity:', err);
      showToast('Failed to update quantity', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const removeFromCart = async (productId, productName = 'Item') => {
    setActionLoading(true);
    try {
      const res = await apiClient.delete(`/cart/${productId}`);
      if (res.data?.cart) {
        setCart(res.data.cart);
        showToast(`Removed ${productName} from cart`, 'info');
      }
    } catch (err) {
      console.error('Error removing item from cart:', err);
      showToast('Failed to remove item', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const clearCart = async () => {
    setActionLoading(true);
    try {
      const res = await apiClient.delete('/cart/clear');
      if (res.data?.cart) {
        setCart(res.data.cart);
        showToast('Cart cleared', 'info');
      }
    } catch (err) {
      console.error('Error clearing cart:', err);
      showToast('Failed to clear cart', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        actionLoading,
        toast,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

