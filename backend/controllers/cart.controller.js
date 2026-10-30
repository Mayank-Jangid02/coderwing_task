import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

const getCartOwnerQuery = (req) => {
  if (req.user && req.user._id) {
    return { userId: req.user._id };
  }
  const guestId =
    req.headers['x-guest-id'] ||
    req.query.guestId ||
    (req.body && req.body.guestId) ||
    'default-guest';
  return { guestId };
};

const formatCartResponse = (cart) => {
  if (!cart || !cart.items) {
    return {
      _id: null,
      items: [],
      totalItems: 0,
      subtotal: 0,
      shipping: 0,
      tax: 0,
      total: 0,
    };
  }

  // Filter out any items where product reference became null
  const validItems = cart.items.filter((item) => item.product != null);

  const subtotal = validItems.reduce((acc, item) => {
    const price = item.product.price || 0;
    return acc + price * item.quantity;
  }, 0);

  const totalItems = validItems.reduce((acc, item) => acc + item.quantity, 0);
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 9.99;
  const tax = Number((subtotal * 0.08).toFixed(2));
  const total = Number((subtotal + shipping + tax).toFixed(2));

  return {
    _id: cart._id,
    userId: cart.userId,
    guestId: cart.guestId,
    items: validItems,
    totalItems,
    subtotal: Number(subtotal.toFixed(2)),
    shipping: Number(shipping.toFixed(2)),
    tax,
    total,
  };
};

export const getCart = async (req, res) => {
  try {
    const query = getCartOwnerQuery(req);
    let cart = await Cart.findOne(query).populate('items.product');

    if (!cart) {
      cart = await Cart.create({ ...query, items: [] });
    }

    return res.status(200).json({
      success: true,
      cart: formatCartResponse(cart),
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return res.status(500).json({ message: 'Failed to retrieve cart', error: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const query = getCartOwnerQuery(req);
    let cart = await Cart.findOne(query);

    if (!cart) {
      cart = new Cart({ ...query, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    const parsedQty = Math.max(1, parseInt(quantity, 10) || 1);

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += parsedQty;
    } else {
      cart.items.push({
        product: productId,
        quantity: parsedQty,
      });
    }

    await cart.save();
    cart = await Cart.findById(cart._id).populate('items.product');

    return res.status(200).json({
      success: true,
      message: 'Product added to cart',
      cart: formatCartResponse(cart),
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return res.status(500).json({ message: 'Failed to add item to cart', error: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const targetProductId = productId || req.params.productId;

    if (!targetProductId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const query = getCartOwnerQuery(req);
    let cart = await Cart.findOne(query);

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === targetProductId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not in cart' });
    }

    const newQty = parseInt(quantity, 10);

    if (newQty <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = newQty;
    }

    await cart.save();
    cart = await Cart.findById(cart._id).populate('items.product');

    return res.status(200).json({
      success: true,
      message: 'Cart updated',
      cart: formatCartResponse(cart),
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    return res.status(500).json({ message: 'Failed to update cart', error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const targetProductId = req.params.productId || req.body.productId;

    if (!targetProductId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const query = getCartOwnerQuery(req);
    let cart = await Cart.findOne(query);

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== targetProductId
    );

    await cart.save();
    cart = await Cart.findById(cart._id).populate('items.product');

    return res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart: formatCartResponse(cart),
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return res.status(500).json({ message: 'Failed to remove item', error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const query = getCartOwnerQuery(req);
    let cart = await Cart.findOne(query);

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      cart: formatCartResponse(cart),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to clear cart', error: error.message });
  }
};

