# CoderShop - Full-Stack E-Commerce Application

A modern full-stack e-commerce web application with React 19 + Tailwind CSS frontend and Express.js + MongoDB backend.

---

## 🚀 Key Features

### 1. Frontend (UI & UX)
- **Login & Register Pages:**
  - Modern card designs with gradient accents and smooth shadows.
  - Interactive form fields with Lucide icons (User, Mail, Lock).
  - Password visibility toggle (show / hide password).
  - Client-side validation (matching passwords, email format, minimum length).
  - One-click demo credentials auto-fill button for quick evaluation.
  - Seamless authentication state management via `AuthContext`.
- **Home Page (Product Showcase):**
  - Hero banner highlighting featured collections and key store perks (free delivery, 24/7 support, money-back guarantee).
  - Live search bar filtering products by title, description, or category.
  - Dynamic category pills (`All`, `Electronics`, `Wearables`, `Audio`, `Fashion`, `Lifestyle`).
  - Sorting options (`Newest Arrivals`, `Price: Low to High`, `Price: High to Low`, `Highest Rated`).
  - Responsive product cards with high-res imagery, rating badges, discounts, price tags, and instant "Add to Cart" feedback.
- **Cart Page:**
  - Live synchronized shopping cart via `CartContext` and REST API.
  - Free shipping progress bar (orders over $100 get free delivery).
  - Interactive item quantity increment/decrement controls and item removal.
  - Order summary breakdown: Subtotal, Shipping, Tax, and Total.
  - Interactive Promo Code engine (enter `SAVE10` or `CODERWING` for 10% off).
  - Checkout modal with simulated order placement confirmation and order number.
  - Empty cart state with quick navigation back to the shop.

---

## 🛠️ Backend API Endpoints

### 1. Authentication APIs
- `POST /api/auth/register` (or `/api/register`)
  - **Body:** `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }`
  - **Response:** Returns created user object and signed JWT token.
- `POST /api/auth/login` (or `/api/login`)
  - **Body:** `{ "email": "john@example.com", "password": "password123" }`
  - **Response:** Validates password hash with bcrypt and returns JWT token + user details.
- `GET /api/auth/me`
  - **Headers:** `Authorization: Bearer <token>`
  - **Response:** Returns current authenticated user info.

### 2. Product APIs
- `GET /api/products`
  - **Query Params (optional):** `category`, `search`, `sortBy` (`price-asc`, `price-desc`, `rating`, `newest`)
  - **Response:** Returns product list and available categories. Automatically seeds products on initial call if database is empty.
- `GET /api/products/:id`
  - **Response:** Returns single product detail.
- `POST /api/products/seed`
  - **Response:** Seeds or re-seeds sample products.

### 3. Cart APIs
- `GET /api/cart`
  - **Headers:** `Authorization: Bearer <token>` (or automatic `x-guest-id`)
  - **Response:** Returns cart items with populated product details, item count, and calculated totals.
- `POST /api/cart/add` (or `POST /api/cart`)
  - **Body:** `{ "productId": "<productId>", "quantity": 1 }`
  - **Response:** Adds or increments product in cart.
- `PUT /api/cart/:productId` (or `PUT /api/cart/update`)
  - **Body:** `{ "quantity": 2 }`
  - **Response:** Updates item quantity.
- `DELETE /api/cart/:productId` (or `DELETE /api/cart/remove/:productId`)
  - **Response:** Removes item from cart.
- `DELETE /api/cart/clear`
  - **Response:** Empties the cart.

---

## 🏃 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on port 27017 (or configured in `backend/.env`)

### 1. Start the Backend Server
```bash
cd backend
npm install
npm run dev
```
Backend will start on `http://localhost:5000`.

### 2. Start the Frontend Application
```bash
cd frontend
npm install
npm run dev
```
Frontend will be accessible at `http://localhost:5173`.
