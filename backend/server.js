import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/dbConfig.js';
import userRouter from './routes/userRouter.js';
import productRouter from './routes/product.routes.js';
import cartRouter from './routes/cart.routes.js';
import { loginUser, registerUser } from './controllers/user_controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend directory
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);
app.use(express.json());

// Database connection
connectDB();

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'CoderShop E-Commerce API is running',
    version: '1.0.0',
    endpoints: {
      auth: ['/api/auth/register', '/api/auth/login', '/api/auth/me'],
      directAuth: ['/api/register', '/api/login'],
      products: ['/api/products', '/api/products/:id', '/api/products/seed'],
      cart: ['/api/cart', '/api/cart/add', '/api/cart/:productId', '/api/cart/clear'],
    },
  });
});

// Direct auth routes for convenience
app.post('/api/login', loginUser);
app.post('/api/register', registerUser);

// Main Route Handlers
app.use('/api/auth', userRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
