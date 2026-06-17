# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Esco** is an e-commerce platform MVP built with React (frontend) and Express (backend) with MongoDB for persistence. The project enables customers to browse products, manage shopping carts, and place orders, with an admin dashboard for product/order management.

**Key Stack:**
- Frontend: React 19 + Vite + React Router
- Backend: Node.js + Express.js + Mongoose
- Database: MongoDB (local: `mongodb://127.0.0.1:27017/esco`)
- Auth: JWT-based (stored in localStorage, sent as Bearer tokens)

## Development Quickstart

### Backend
```bash
cd backend
npm install
npm run dev           # Run with nodemon (watches for changes)
npm start             # Run production server
```
Backend runs on `http://localhost:5000` by default. See `.env` for configuration (PORT, MONGO_URI, JWT_SECRET).

### Frontend
```bash
cd frontend
npm install
npm run dev           # Start Vite dev server (usually http://localhost:5173)
npm run build         # Build for production
npm run lint          # Run ESLint
```
The frontend connects to the backend via the API client configured in `src/services/api.js`. Default backend URL is `http://localhost:5000/api`, overridable via `VITE_API_URL` environment variable (create a `.env.local` file in the frontend directory if needed).

### Database
MongoDB must be running locally. Start with:
```bash
mongod
```

## Architecture

### Frontend Structure
- **`src/pages/`** – Route-level components (Register, Products, etc.)
- **`src/components/`** – Reusable UI components (Navbar, ProductCard, etc.)
- **`src/services/`** – API calls and business logic
  - `api.js` – Axios client with JWT interceptors
  - `authService.js`, `productService.js`, `orderService.js` – API wrappers
- **`src/context/`** – React Context for global state
  - `AuthContext.jsx` – User auth state, login/register/logout
  - `CartContext.jsx` – Shopping cart state
- **`public/`** – Static assets

### Backend Structure
- **`routes/`** – API endpoints (`authRoutes`, `productRoutes`, `cartRoutes`)
- **`controllers/`** – Request handlers for each route
- **`models/`** – Mongoose schemas (User, Product, Order, Cart)
- **`middleware/`** – Auth guards, error handlers
- **`config/`** – Database connection setup
- **`utils/`** – Helper functions (password hashing, JWT generation)

## API Integration

### Request Flow
1. Frontend component calls a service method (e.g., `authService.login()`)
2. Service makes an axios request via the `api` client
3. `api.js` automatically appends JWT from localStorage as `Authorization: Bearer <token>`
4. Backend validates the token in protected routes via middleware
5. Controller processes the request and returns data
6. Response interceptor in `api.js` redirects to login on 401 (token expired)

### Key Endpoints
- `POST /api/auth/register` – Create user account
- `POST /api/auth/login` – Authenticate and receive JWT
- `GET /api/products` – List all products
- `POST /api/products` – Create product (admin only)
- `GET /api/cart` – Fetch user's cart
- `POST /api/cart` – Add item to cart

### Backend Environment (.env)
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/esco
JWT_SECRET=mysecretkey
```

## Authentication & Authorization

- **JWT Flow:** Login returns `{ token, user }`. Frontend stores token in localStorage and user in state.
- **Auth Context:** `useAuth()` hook provides `user`, `isAuthenticated`, `isAdmin`, and auth methods.
- **Protected Routes:** `<ProtectedRoute>` wraps pages that require login.
- **Admin Check:** `user.role === "admin"` determines admin access.
- **Token Auto-Refresh:** Not yet implemented; tokens are static (consider adding refresh logic for production).

## File Changes to Track

Files with recent changes (as of commit `6d755c6`):
- `frontend/src/admin/AddProduct.jsx` – Admin product form
- `frontend/src/components/Footer.jsx`
- `frontend/src/pages/Products.jsx` – Product listing
- `frontend/src/pages/Register.jsx` – Registration form

## Common Development Tasks

### Adding an API Endpoint
1. Create controller function in `backend/controllers/`
2. Add route to `backend/routes/`
3. Create service wrapper in `frontend/src/services/`
4. Call service from a React component or context

### Testing Backend Locally
Use a tool like Postman or curl. Example:
```bash
curl -X GET http://localhost:5000/api/products
```

### Running Both Servers Concurrently
Open two terminal tabs/windows and run `npm run dev` in each (one for backend, one for frontend).

## Important Notes

- **Credentials in localStorage:** The JWT is stored client-side and vulnerable to XSS. For production, use httpOnly cookies.
- **CORS:** Backend has CORS enabled. Frontend requests will succeed if servers are running on different ports.
- **MongoDB Connection:** Ensure `mongod` is running; the backend will fail to start if the database is unavailable.
- **Nodemon vs Node:** Use `npm run dev` for local development (auto-reload), `npm start` for production.
