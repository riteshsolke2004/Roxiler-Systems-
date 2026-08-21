# 🏪 StoreRatingHub — Multi-Role Store Rating & Analytics Platform

A full-stack, enterprise-grade web application built for managing stores and customer ratings with **Role-Based Access Control (RBAC)**, real-time dynamic rating calculations, customer feedback reviews, and a **modern light/dark theme system**.

---

## 🚀 Live Deployment Links

| Service | Live URL | Platform |
|---|---|---|
| 🌐 **Frontend Web App** | [https://roxiler-systems-khaki.vercel.app/](https://roxiler-systems-khaki.vercel.app/) | **Vercel** |
| ⚡ **Backend REST API** | [https://storerating-backend.onrender.com/api](https://storerating-backend.onrender.com/api) | **Render** |
| 🗄️ **1-Click DB Seeder** | [https://storerating-backend.onrender.com/api/seed](https://storerating-backend.onrender.com/api/seed) | **Render (Live API)** |

---

## 📌 Project Overview

**StoreRatingHub** provides a complete end-to-end ecosystem connecting Customers, Store Owners, and System Administrators:

1. **`SYSTEM_ADMIN` (Platform Administrator)**:
   - Real-time overview metrics: Total Users, Total Stores, and Total Submitted Ratings.
   - Create users for any system role (`SYSTEM_ADMIN`, `STORE_OWNER`, `NORMAL_USER`).
   - Create business stores and assign dedicated Store Owners.
   - Filterable, searchable, and sortable data tables for all platform users and stores.

2. **`NORMAL_USER` (Customer & Reviewer)**:
   - Self-registration with real-time validation checks.
   - Browse and search all registered stores by name and address.
   - Submit and modify 1-to-5 star ratings with **half-star precision** (e.g. 4.5, 3.5).
   - Write custom **review feedback messages** (up to 500 characters) delivered directly to store owners.
   - Manage personal account credentials and password.

3. **`STORE_OWNER` (Business Representative)**:
   - Dedicated business analytics dashboard with live calculated average rating scores.
   - Total rating metrics and rating breakdown.
   - Real-time stream of **Recent Customer Reviews & Feedback Quotes**.
   - Sortable table of all customer ratings and written reviews for their store.
   - Strict tenant data isolation.

---

## ✨ Key Features & Highlights

- 🔐 **JWT Authentication & RBAC** — Secure token-based auth with bcrypt password hashing and dual-layer guards (frontend route protection & backend API middleware).
- 🌓 **Dynamic Light & Dark Theme** — Seamless theme toggle with CSS variable tokens and persisted preferences in `localStorage`.
- 🔄 **Dynamic Resizing Sticky Navbar** — Header smoothly shrinks and elevates on scroll down, expanding back when returning to the top.
- ⭐ **Accurate Half-Star Rating Display** — Decimal ratings (such as 4.5 or 3.5) accurately render full, half, and empty stars.
- 💬 **Customer Review & Feedback System** — Customers can submit written feedback alongside star ratings, viewable in real-time by the respective store owner.
- 📊 **Zero-Stale Dynamic Aggregations** — Average ratings and counts are computed on query via Prisma aggregations (`_avg`, `_count`).
- 🔒 **Database-Level Integrity Constraints** — `@@unique([userId, storeId])` strictly prevents duplicate ratings at the PostgreSQL layer.
- 🛡️ **Comprehensive Zod Validation** — Name (20–60 chars), Standard Email, Password (8–16 chars with uppercase & special character), Address (max 400 chars).
- 🌱 **1-Click Cloud Database Seeder** — Built-in `/api/seed` endpoint allows populating the database on Render without requiring SSH shell access.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18 (Vite), React Router DOM v6, Axios, Lucide React Icons, Pure Vanilla CSS |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL |
| **ORM** | Prisma ORM v5 |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), Password Hashing (`bcryptjs`) |
| **Validation** | Zod Schema Validation |
| **Deployment** | Vercel (Frontend), Render (Backend & PostgreSQL) |

---

## 📂 Project Structure

```
Internship Assignment/
├── backend/
│   ├── src/
│   │   ├── config/          # Database client configuration (Prisma)
│   │   ├── controllers/     # Express HTTP request & response handlers
│   │   ├── middlewares/     # JWT auth, RBAC, Zod validation, error handling
│   │   ├── routes/          # API route definitions (/auth, /admin, /stores, etc.)
│   │   ├── services/        # Business logic & database queries
│   │   ├── validators/      # Zod validation schemas
│   │   ├── utils/           # Response helpers & token signers
│   │   ├── app.js           # Express application setup
│   │   └── server.js        # Server listener entry point
│   ├── prisma/
│   │   ├── schema.prisma    # PostgreSQL database schema & models
│   │   └── seed.js          # Database seed script for test accounts
│   ├── .env.example         # Template for environment configuration
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios instance configured with live Render baseUrl
│   │   ├── components/      # Navbar, Sidebar, SortableTable, StarDisplay, RatingInput, Modal, Loader, AlertMessage
│   │   ├── context/         # AuthContext (session & RBAC) & ThemeContext (Light/Dark)
│   │   ├── layouts/         # Dashboard Shell Layout with responsive sidebar
│   │   ├── pages/           # LandingPage, Login, Register, Admin, User & Store Owner views
│   │   ├── App.jsx          # React Router setup with role guards & ThemeProvider
│   │   ├── index.css        # Global CSS design system (Dark & Light tokens)
│   │   └── main.jsx
│   ├── .env.production      # Production environment configuration
│   └── package.json
├── render.yaml              # Render blueprint deployment configuration
├── screenshots/             # Application UI screenshots
└── README.md
```

---

## 🗄️ Database Schema

The PostgreSQL database contains 3 core models managed via Prisma ORM:

```prisma
model User {
  id           String   @id @default(uuid())
  name         String   // 20–60 characters
  email        String   @unique
  passwordHash String
  address      String   // Max 400 characters
  role         Role     @default(NORMAL_USER)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  ownedStore   Store?   @relation("StoreOwner")
  ratings      Rating[]
}

model Store {
  id        String   @id @default(uuid())
  name      String   // 20–60 characters
  email     String
  address   String   // Max 400 characters
  ownerId   String   @unique
  owner     User     @relation("StoreOwner", fields: [ownerId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  ratings   Rating[]
}

model Rating {
  id        String   @id @default(uuid())
  rating    Int      // 1 to 5 integer
  feedback  String?  // Optional customer review comment
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  storeId   String
  store     Store    @relation(fields: [storeId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, storeId]) // Enforces single rating per store per customer
}
```

---

## 🔑 Test Credentials

You can use these pre-seeded demo accounts to test each user role:

### 1. System Administrator
| Role | Email | Password | Dashboard URL |
|---|---|---|---|
| **Administrator (⚡)** | `admin@storerating.com` | `AdminPass123!` | `/admin/dashboard` |

### 2. Store Owners
| Role | Email | Password | Assigned Store |
|---|---|---|---|
| **Store Owner (🏪)** | `owner.david@storerating.com` | `OwnerPass123!` | Tech Gadgets Central Store |
| **Store Owner (🏪)** | `owner.emma@storerating.com` | `OwnerPass123!` | Gourmet Bakery Delight Store |
| **Store Owner (🏪)** | `owner.frank@storerating.com` | `OwnerPass123!` | Urban Fashion Apparel Hub |

### 3. Normal Users (Customers)
| Role | Email | Password |
|---|---|---|
| **Normal User (👤)** | `alice@example.com` | `UserPass123!` |
| **Normal User (👤)** | `bob@example.com` | `UserPass123!` |
| **Normal User (👤)** | `charlie@example.com` | `UserPass123!` |

> *Tip: You can also click **"Register Free"** to create a new customer account anytime.*

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+) running locally

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Configure `backend/.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/storeratingdb"
PORT=5000
JWT_SECRET="super_secret_jwt_key_store_rating_2026"
JWT_EXPIRES_IN="24h"
```

```bash
# Push schema to database
npx prisma db push

# Seed test accounts & stores
node prisma/seed.js

# Start backend development server
npm run dev
```
Backend runs at `http://localhost:5000`.

---

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Frontend runs at `http://localhost:5173`.

---

## 🌐 API Endpoint Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new Normal User account |
| `POST` | `/api/auth/login` | Public | Sign in with email & password (returns JWT) |
| `PUT` | `/api/auth/change-password` | Authenticated | Update user password |
| `GET` | `/api/auth/me` | Authenticated | Get current authenticated user profile |

### System Administration (`/api/admin`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/dashboard` | `SYSTEM_ADMIN` | Summary counts (`totalUsers`, `totalStores`, `totalRatings`) |
| `POST` | `/api/admin/users` | `SYSTEM_ADMIN` | Create user with any role (`ADMIN`, `OWNER`, `USER`) |
| `GET` | `/api/admin/users` | `SYSTEM_ADMIN` | Filterable & sortable list of all registered users |
| `GET` | `/api/admin/users/:id` | `SYSTEM_ADMIN` | Detailed profile of a specific user |
| `POST` | `/api/admin/stores` | `SYSTEM_ADMIN` | Create store and assign dedicated Store Owner |
| `GET` | `/api/admin/stores` | `SYSTEM_ADMIN` | Filterable & sortable list of all stores |

### Stores & Ratings (`/api/stores`, `/api/store-owner`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/stores` | Authenticated | List all stores with search, sort & user ratings |
| `GET` | `/api/stores/:id` | Authenticated | Get single store details and average rating |
| `POST` | `/api/stores/:id/ratings` | `NORMAL_USER` | Submit 1–5 star rating with optional feedback |
| `PUT` | `/api/stores/:id/ratings` | `NORMAL_USER` | Modify existing rating and feedback comment |
| `GET` | `/api/store-owner/dashboard` | `STORE_OWNER` | Store metrics, average score & recent review quotes |
| `GET` | `/api/store-owner/ratings` | `STORE_OWNER` | Full sortable table of all store customer ratings & reviews |
| `GET` | `/api/seed` | Public | 1-Click database seeder endpoint |

---

## 📄 License & Attribution

© 2026 StoreRatingHub. Built with React, Node.js, Express, Prisma ORM, and PostgreSQL.
