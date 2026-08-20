# Store Rating Platform

A full-stack, production-quality web application built for managing stores and customer ratings with role-based access control (RBAC), robust form validation, and dynamic rating calculations.

---

## 📌 Project Overview

The **Store Rating Platform** enables users to register, log in, browse business stores, submit ratings (1 to 5 stars), update their existing ratings, and view overall store rating statistics. The platform strictly enforces access control across three user roles:

1. **`SYSTEM_ADMIN`**: Full platform management including overview dashboard statistics (`totalUsers`, `totalStores`, `totalRatings`), user account creation (all roles), user management with multi-field filtering and sorting, individual user detail inspection (including associated store & rating calculations for Store Owners), store creation with owner assignment, and store management with dynamic sorting and filtering.
2. **`NORMAL_USER`**: Self-registration, searchable store browsing (by name and physical address), star rating submission/modification (1 to 5 stars, enforced as strictly 1 rating per store per user at both backend and database constraint levels), and password management.
3. **`STORE_OWNER`**: Dedicated store performance dashboard displaying overall average rating, total ratings count, and a comprehensive table of customers who submitted reviews for their specific store. Enforces strict data isolation (store owners can only view their own store data).

---

## ✨ Features

- 🔐 **Common JWT Authentication & Role-Based Access Control**: Centralized authentication using bcrypt password hashing and JWT tokens in headers.
- 🛡️ **Strict Form Validation**: Backend and frontend validation for Name (20–60 chars), Email format, Password (8–16 chars, at least 1 uppercase letter and 1 special symbol), and Address (max 400 chars).
- 📊 **Dynamic Rating Calculation**: Average ratings are computed dynamically using database aggregations (`_avg`, `_count`), updating automatically whenever new ratings are added or modified.
- 🔒 **Database-Level Unique Constraints**: `@@unique([userId, storeId])` prevents duplicate ratings even at the database level.
- 🔍 **Filtering & Table Column Sorting**: Admin and user listings support filtering by text fields and sorting by Name, Email, Address, Role, or Rating ascending/descending.
- 🎨 **Modern Responsive UI**: Clean visual layout built with custom CSS design tokens, star rating components, glassmorphism cards, modal dialogs, loading spinners, and alert notifications.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js (Vite), React Router DOM v6, Axios, Lucide Icons, Plain CSS |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL 17 |
| **ORM** | Prisma ORM v5 |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), Password Hashing (`bcryptjs`) |
| **Validation** | Zod Schema Validation |

---

## 📂 Project Architecture

```
c:\Users\rites\Desktop\Internship Assignment\
├── backend/
│   ├── src/
│   │   ├── config/          # Database client configuration
│   │   ├── controllers/     # Express HTTP request & response handlers
│   │   ├── middlewares/     # JWT authentication, RBAC, Zod validation, Error handling
│   │   ├── routes/          # Express route definitions (/api/auth, /api/admin, etc.)
│   │   ├── services/        # Core business logic & database queries
│   │   ├── validators/      # Zod validation schemas
│   │   ├── utils/           # JWT helper functions & response formatters
│   │   ├── app.js           # Express application setup
│   │   └── server.js        # Server listener entry point
│   ├── prisma/
│   │   ├── schema.prisma    # PostgreSQL database models & enums
│   │   └── seed.js          # Database seed script for test accounts
│   ├── .env                 # Backend environment variables
│   ├── .env.example         # Template for environment configuration
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios instance with JWT interceptors
│   │   ├── components/      # Navbar, Sidebar, SortableTable, StarDisplay, RatingInput, Modal, Loader, AlertMessage
│   │   ├── context/         # AuthContext for session management & role routing
│   │   ├── layouts/         # Main Dashboard Layout
│   │   ├── pages/           # Login, Register, Admin, User, & Store Owner pages
│   │   ├── App.jsx          # React Router setup with role guards
│   │   ├── index.css        # Global CSS design tokens
│   │   └── main.jsx
│   ├── .env
│   └── package.json
└── README.md
```

---

## 🗄️ Database Schema Explanation

The PostgreSQL database contains 3 core models defined in `backend/prisma/schema.prisma`:

1. **`User`**:
   - `id` (UUID, Primary Key)
   - `name` (String, 20–60 characters)
   - `email` (String, Unique)
   - `passwordHash` (String, Bcrypt hash)
   - `address` (String, Max 400 characters)
   - `role` (Enum: `SYSTEM_ADMIN`, `NORMAL_USER`, `STORE_OWNER`)
   - `createdAt`, `updatedAt`

2. **`Store`**:
   - `id` (UUID, Primary Key)
   - `name` (String, 20–60 characters)
   - `email` (String)
   - `address` (String, Max 400 characters)
   - `ownerId` (UUID, Unique Foreign Key to `User`, 1-to-1 relation)
   - `createdAt`, `updatedAt`

3. **`Rating`**:
   - `id` (UUID, Primary Key)
   - `rating` (Integer between 1 and 5)
   - `userId` (UUID, Foreign Key to `User`)
   - `storeId` (UUID, Foreign Key to `Store`)
   - `createdAt`, `updatedAt`
   - `@@unique([userId, storeId])`: Enforces single rating per store per normal user at DB level.

---

## 🔑 Test Credentials

Use the following seeded credentials to log in and test each role:

### 1. System Administrator
- **Email**: `admin@storerating.com`
- **Password**: `AdminPassword123!`
- **Access**: Full platform management (`/admin/dashboard`)

### 2. Store Owners
- **Owner 1**: `owner.david@storerating.com` / `OwnerPassword123!` (Store: *Tech Gadgets Central Store*)
- **Owner 2**: `owner.emma@storerating.com` / `OwnerPassword123!` (Store: *Gourmet Bakery Delight Store*)
- **Owner 3**: `owner.frank@storerating.com` / `OwnerPassword123!` (Store: *Urban Fashion Apparel Hub*)
- **Access**: Dedicated store dashboard & review management (`/owner/dashboard`)

### 3. Normal Users
- **User 1**: `alice@example.com` / `UserPassword123!`
- **User 2**: `bob@example.com` / `UserPassword123!`
- **User 3**: `charlie@example.com` / `UserPassword123!`
- **Access**: Store browsing, search & rating submission (`/user/dashboard`)

---

## 🚀 Setup & Execution Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher) running on `localhost:5432`

---

### Step 1: Database & Backend Setup

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `backend/.env`:
   ```env
   DATABASE_URL="postgresql://postgres@127.0.0.1:5432/storeratingdb"
   PORT=5000
   JWT_SECRET="supersecret_store_rating_jwt_key_2026_internship"
   JWT_EXPIRES_IN="24h"
   ```

4. Push the schema to PostgreSQL:
   ```bash
   npx prisma db push
   ```

5. Seed the database with initial test accounts and stores:
   ```bash
   npm run seed
   ```

6. Start the Express backend server:
   ```bash
   npm run dev
   ```
   *The backend server will run on `http://localhost:5000`.*

---

### Step 2: Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The application frontend will be accessible at `http://localhost:5173`.*

---

## 🌐 API Endpoint Overview

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a Normal User
- `POST /api/auth/login` — Login user (returns JWT token & profile)
- `POST /api/auth/logout` — Logout user session
- `PUT /api/auth/change-password` — Change password (authenticated)
- `GET /api/auth/me` — Fetch current user profile

### System Admin (`/api/admin`) - Requires `SYSTEM_ADMIN` role
- `GET /api/admin/dashboard` — Platform overview statistics (`totalUsers`, `totalStores`, `totalRatings`)
- `POST /api/admin/users` — Create user of any role
- `GET /api/admin/users` — List users with filters (`name`, `email`, `address`, `role`) & sorting (`sortBy`, `order`)
- `GET /api/admin/users/:id` — Get detailed user info (includes store info & average rating for Store Owners)
- `POST /api/admin/stores` — Create store and assign an unassigned Store Owner
- `GET /api/admin/stores` — List stores with filters & sorting

### Stores (`/api/stores`) - Requires Authentication
- `GET /api/stores` — Search & list stores (with computed average rating and user's submitted rating)
- `GET /api/stores/:id` — Single store details

### Ratings (`/api/stores/:storeId/ratings`) - Requires `NORMAL_USER` role
- `POST /api/stores/:storeId/ratings` — Submit rating (1 to 5)
- `PUT /api/stores/:storeId/ratings` — Update existing rating (1 to 5)
- `GET /api/stores/:storeId/ratings` — Get current user rating for the store

### Store Owner (`/api/store-owner`) - Requires `STORE_OWNER` role
- `GET /api/store-owner/dashboard` — Store performance dashboard & average rating
- `GET /api/store-owner/ratings` — Breakdown of customers who rated their store

---

## 📸 Application Screenshots

*(Placeholders for application UI screenshots)*
- **Admin Dashboard**: System metrics cards and quick management actions
- **User Management Table**: Filterable and sortable user listings
- **Store Rating Interface**: Interactive star rating submission dialog
- **Store Owner Dashboard**: Customer ratings breakdown table

---

## 📝 Assumptions Made

1. **Self-Registration Scope**: Normal users can self-register via `/register`. Store Owners and System Administrators are created directly by the System Administrator.
2. **Single Store per Owner**: Each Store Owner is associated with exactly one business store, enforced by a unique foreign key constraint (`ownerId` on Store model).
3. **Rating Scale**: Ratings are integers from 1 to 5 stars.
4. **Dynamic Aggregation**: Average ratings are computed dynamically on query execution to prevent stale data.
