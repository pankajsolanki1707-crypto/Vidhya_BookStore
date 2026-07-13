# Vidhya Book Store & Stationery - Production Monorepo

Welcome to the production-ready full-stack monorepo for **Vidhya Book Store & Stationery** (Bhanwarkuan, Indore). 

This project is built using a highly structured, scalable **Workspaces Monorepo** architecture designed to support thousands of daily visitors and maintain an elite Lighthouse speed index.

---

## 🏗️ Repository Workspace Directory Structure

```
AG_VBS_Store/
├── apps/
│   ├── frontend/             # Next.js 15 Client, TailwindCSS, NextAuth, Framer Motion
│   └── backend/              # NestJS REST API Server, Controllers, Services
├── packages/
│   └── database/             # Shared Prisma schema, clients, and seeding scripts
├── docker-compose.yml        # PostgreSQL, Redis, and Elasticsearch service orchestration
├── Dockerfile.frontend       # Multi-stage Docker package for Next.js
├── Dockerfile.backend        # Multi-stage Docker package for NestJS
├── package.json              # Monorepo Workspace configuration
└── tsconfig.json
```

---

## 🗄️ Database Schema Documentation

The system is configured to run on **PostgreSQL**. The Prisma schema maps relational structures for civil services study notes and calculator stock catalogs:

### 1. `User` Model
* `id` (UUID, Primary Key): Unique student account id.
* `email` (String, Unique): Registered student email.
* `name` (String, Optional): Full student name.
* `phone` (String, Optional): 10-digit mobile number for OTP login.
* `walletBalance` (Float, default `150.0`): Virtual cash credits.
* `rewardPoints` (Int, default `340`): Loyalty points collected.

### 2. `Product` Model
* `id` (String, Primary Key): Slugified title (e.g. `upsc-polity-laxmikanth`).
* `title` (String): Official title of the textbook/calculator.
* `author` (String): Author name.
* `publisher` (String, Optional): Publishing house.
* `price` (Float): Student selling price.
* `originalPrice` (Float, Optional): Manufacturer MRP.
* `category` (String): Catalog segment (e.g. `Competitive Exams`).
* `format` (String): Book binding (e.g. `Paperback`).
* `image` (String): Cover asset URL.
* `description` (Text): Full specifications and syllabus parameters.
* `stockCount` (Int, default `10`): Physical stock count at the Indore outlet.
* `inStock` (Boolean, default `true`): Inventory availability status.
* `isbn` (String, Optional): 13-digit catalog ISBN code.
* `pages` (Int): Total page count.
* `publishYear` (Int): Release year.

### 3. `Order` Model
* `id` (String, Primary Key): Custom ledger code (e.g. `VBS-12410-8512`).
* `customerName` (String): Recipient name.
* `phone` (String): Contact number.
* `address` (Text): Street delivery address in Indore.
* `totalAmount` (Float): Grand total payable (inclusive of GST).
* `paymentMethod` (String): `COD` | `UPI` | `CARD` | `NETBANKING`.
* `paymentReference` (String): Transaction UTR receipt reference.
* `status` (String): `Pending` | `Confirmed` | `Shipped` | `Delivered` | `Cancelled`.

---

## 🔌 API Documentation

All NestJS backend endpoints serve requests on `http://localhost:3001` with standard JSON payloads:

### 1. Authentication (`/auth`)
* `POST /auth/login`: Accepts email and password. Returns signed JWT token.
* `POST /auth/register`: Submits signup information.
* `POST /auth/otp`: Verifies 4-digit SMS OTP verification (default code `1234`).

### 2. Catalog Products (`/products`)
* `GET /products`: Searches catalog using search filters (query, category, format, page, limit).
* `GET /products/:id`: Fetches detailed specifications and reviews for a book.
* `POST /products`: Registers a new book (requires admin JWT token).
* `PUT /products/:id`: Updates stock level or pricing.
* `DELETE /products/:id`: Removes item from search index.

### 3. Orders & Shipments (`/orders`)
* `GET /orders`: Fetches all store orders (requires admin JWT).
* `POST /orders`: Places purchase order. Sanitizes inputs and checks stock count.
* `PATCH /orders/:id`: Triggers shipping status updates.

---

## 🛠️ Admin Manual

Administrators can manage the store operations at `http://localhost:3000/admin`:

1. **Cataloging New Books**: Click `Catalog Book` to open the detail form, enter title, authors, prices, and upload covers.
2. **Bulk CSV Imports**: Click `Bulk Import` to select Excel sheets. The system automatically reads columns for authors and page counts to index them.
3. **Sticker Barcode Printing**: Click the `Barcode` icon next to any book to render a custom scannable sticker.
4. **GST Invoice Exports**: Click the `Invoice` link on orders. It generates a print-ready PDF invoice with subtotal tax separations.

---

## 🚀 Deployment Guide

### Local Development (using Docker)
1. **Launch Database Stack**:
   ```bash
   docker compose up -d
   ```
2. **Setup Relational Schema**:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```
3. **Run Dev Workspaces**:
   * Frontend (Port 3000): `npm run frontend:dev`
   * Backend (Port 3001): `npm run backend:dev`

### Production Builds
Verify clean compiles before pushing to hosts:
```bash
npm run build
```

---

## 🚦 Testing & Security Verifications

* **Rate Limiter Test**: Repeated GET/POST requests from a single host exceeding 60 calls/minute trigger an automatic `429 Too Many Requests` response.
* **CSRF Protection**: Non-permitted referrer origins are rejected with `403 Forbidden` status.
* **XSS Sanitization**: Input fields sanitize HTML brackets (`<script>`) before saving, protecting database logs.
