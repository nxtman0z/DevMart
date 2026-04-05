<p align="center">
  <img src="https://img.shields.io/badge/DevMart-Developer%20Marketplace-7C3AED?style=for-the-badge&logo=shopify&logoColor=white" alt="DevMart" />
</p>

<h1 align="center">🛒 DevMart — Developer Marketplace</h1>

<p align="center">
  A full-stack MERN marketplace where developers can <strong>buy and sell</strong> digital products like UI kits, templates, boilerplates, and code snippets.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Razorpay-Payments-0C2451?style=flat-square&logo=razorpay" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite" />
</p>

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based auth with **access token** (15 min) + **refresh token** (7 days)
- Refresh token stored in httpOnly cookie for security
- Automatic token refresh via Axios interceptor
- Role-based access control — **Buyer** & **Seller** roles
- Protected routes with redirect logic

### 🛍️ Marketplace
- Browse & search products with **real-time debounced search**
- Filter by **category**, **price range**, and **sort** (newest, popular, price, rating)
- URL-based filters — shareable filter URLs
- Pagination support
- Skeleton loading states for smooth UX

### 📦 Product Management (Sellers)
- Upload products with **drag & drop** images (max 4 preview images)
- Upload downloadable ZIP file
- **Live preview card** while creating products
- Edit / Delete / Activate / Deactivate products
- Category tagging: UI Kit, Template, Boilerplate, Snippet, Tool

### 💳 Payments (Razorpay)
- Integrated **Razorpay checkout** for seamless payments
- Server-side payment verification with signature validation
- Order tracking with status (pending, completed, failed)
- Download unlocked after successful payment

### 📊 Seller Dashboard
- **Revenue stats** — Total Revenue, Total Sales, Active Listings
- **Revenue chart** — Last 30 days revenue trend (Recharts AreaChart)
- **Recent sales table** with buyer info and status badges
- **Products table** with toggle active/inactive, edit, delete actions

### ⭐ Reviews & Ratings
- Only verified buyers can post reviews
- 1-5 star rating with comments
- Auto-calculated average rating on products
- One review per user per product

### 👤 User Profile
- Editable profile — name, bio, avatar, website, GitHub, Twitter
- Change password functionality
- Seller payout info (UPI ID)

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite, Tailwind CSS v4, Zustand, Axios, React Router v6, React Hook Form, Recharts, React Dropzone |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs |
| **Payments** | Razorpay |
| **File Storage** | Cloudinary (images + product files) |
| **Security** | Helmet, CORS, httpOnly cookies, express-validator |

---

## 📁 Project Structure

```
DevMart/
├── client/                          # React Frontend (Vite)
│   ├── src/
│   │   ├── api/                     # Axios instance + API functions
│   │   ├── components/
│   │   │   ├── common/              # Navbar, Footer, Loader
│   │   │   ├── product/             # ProductCard, ProductGrid, FilterSidebar
│   │   │   └── dashboard/           # StatCard, RevenueChart, ProductsTable
│   │   ├── hooks/                   # useAuth, useProducts, useDebounce
│   │   ├── pages/                   # 10 pages (Home, Explore, Login, etc.)
│   │   ├── store/                   # Zustand stores (auth, cart)
│   │   ├── utils/                   # Helper functions
│   │   ├── App.jsx                  # Routing & layout
│   │   └── main.jsx                 # Entry point
│   └── package.json
│
└── server/                          # Express Backend
    ├── config/                      # DB & Cloudinary config
    ├── controllers/                 # Auth, Product, Order, Review, User
    ├── middleware/                   # Auth, Error handler, Upload
    ├── models/                      # User, Product, Order, Review
    ├── routes/                      # API route definitions
    ├── utils/                       # JWT tokens, Razorpay helper
    ├── server.js                    # Express app entry
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** (local or Atlas)
- **Cloudinary** account (for file uploads)
- **Razorpay** account (for payments)

### 1. Clone the repository

```bash
git clone https://github.com/nxtman0z/DevMart.git
cd DevMart
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/devmart
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLIENT_URL=http://localhost:5173
```

Start the server:

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

Start the client:

```bash
npm run dev
```

### 4. Open the app

Visit **http://localhost:5173** in your browser 🎉

---

## 📡 API Endpoints

### Auth (`/api/auth`)
| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login user | Public |
| POST | `/logout` | Logout (clear cookie) | Public |
| POST | `/refresh` | Refresh access token | Public |
| GET | `/me` | Get current user | Protected |

### Users (`/api/users`)
| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| GET | `/profile/:id` | Get public profile | Public |
| PUT | `/profile` | Update own profile | Protected |
| PUT | `/change-password` | Change password | Protected |
| PUT | `/payout` | Update payout info | Seller |

### Products (`/api/products`)
| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| GET | `/` | List products (filters, pagination) | Public |
| GET | `/:id` | Get product details | Public |
| POST | `/` | Create product | Seller |
| PUT | `/:id` | Update product | Seller (owner) |
| DELETE | `/:id` | Delete product | Seller (owner) |
| GET | `/seller/my-products` | Get own products | Seller |

### Orders (`/api/orders`)
| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| POST | `/create` | Create Razorpay order | Protected |
| POST | `/verify` | Verify payment | Protected |
| GET | `/my-purchases` | Get purchase history | Protected |
| GET | `/seller/sales` | Get sales + analytics | Seller |

### Reviews (`/api/reviews`)
| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| POST | `/:productId` | Post review | Buyer (purchased) |
| GET | `/:productId` | Get product reviews | Public |

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#0F0F0F` |
| Surface | `#1A1A1A` |
| Border | `#2A2A2A` |
| Primary (Purple) | `#7C3AED` |
| Success (Green) | `#10B981` |
| Error (Red) | `#EF4444` |
| Text | `#FFFFFF` |
| Muted Text | `#9CA3AF` |
| Font | Inter (Google Fonts) |
| Border Radius | 8px (cards), full (badges) |

### UI Features
- 🌑 Dark theme throughout
- 🪟 Glassmorphism cards with backdrop blur
- 🌈 Gradient accents and borders
- 💀 Skeleton loaders during data fetch
- ✨ Smooth fade-in / slide-up animations
- 📱 Fully responsive (mobile + desktop)

---

## 🗄️ Database Schemas

### User
```
name, email, password (hashed), role (buyer/seller),
avatar, bio, website, github, twitter, upiId
```

### Product
```
title, description, price (INR), category, tags,
previewImages[], productFile (ZIP), seller (ref),
isActive, totalSales, averageRating, reviewCount
```

### Order
```
buyer (ref), product (ref), seller (ref), amount,
razorpayOrderId, razorpayPaymentId, status
```

### Review
```
product (ref), buyer (ref), rating (1-5), comment
```

---

## 🔒 Security

- Passwords hashed with **bcryptjs** (salt rounds: 10)
- JWT access token (short-lived) + refresh token (httpOnly cookie)
- **Helmet** for HTTP security headers
- **CORS** configured with credentials
- **express-validator** for input validation
- Owner-only product operations
- Purchase-verified reviews only

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Made with ❤️ for developers
</p>
