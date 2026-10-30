import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cart.controller.js';
import { optionalAuth } from '../middleware/auth.middleware.js';

const cartRouter = Router();

// Cart routes support both authenticated and guest users seamlessly
cartRouter.use(optionalAuth);

cartRouter.get('/', getCart);
cartRouter.post('/', addToCart);
cartRouter.post('/add', addToCart);
cartRouter.put('/update', updateCartItem);
cartRouter.put('/:productId', updateCartItem);
cartRouter.delete('/clear', clearCart);
cartRouter.delete('/remove/:productId', removeFromCart);
cartRouter.delete('/:productId', removeFromCart);

export default cartRouter;

