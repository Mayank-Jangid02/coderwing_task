import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  seedProducts,
} from '../controllers/product.controller.js';

const productRouter = Router();

productRouter.get('/', getAllProducts);
productRouter.get('/:id', getProductById);
productRouter.post('/seed', seedProducts);

export default productRouter;

