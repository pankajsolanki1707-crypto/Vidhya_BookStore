# Vidhya Book Store & Stationery — Admin ERP Console Operational Manual

This manual details security guidelines, authentication steps, and operational procedures for administering the Vidhya Book Store platform.

---

## 🔐 1. Secure Admin Authentication Flow

To protect student accounts and financial transaction records, the ERP console enforces a two-step multi-factor authentication (MFA) workflow.

### Sequence of Operations
1. **Password Authentication**:
   - Access the login console at `http://localhost:3000/admin`.
   - Enter your registered email address and security password.
   - Click **Login**.
   
2. **Two-Factor Authentication (2FA) Popup**:
   - Upon successful credentials verification, the system opens a secure popup modal requesting the Verification Code.
   - A random, cryptographically secure **6-digit OTP** is generated on the server, hashed before database/session storage, and has a strict expiry limit of **5 minutes**.
   - Type the code into the verification modal. Once validated, the system starts a secure session.

### Core Security Rules
- **No LocalStorage Tokens**: Sessions are persisted via `HttpOnly`, `Secure` cookies with `SameSite=Strict`. JWT signatures are automatically rotated.
- **Account Lockout**: Exceeding 5 failed login attempts locks the admin account automatically for **15 minutes** to prevent brute-force attacks.

---

## 📚 2. Product Catalog Management (CRUD)

### Adding a Book Individually
1. Go to the **Catalog** tab.
2. Click **Add New Book**.
3. Complete the product specification form:
   - **ISBN**: 13-digit standard identifier (validated for length and duplicates).
   - **Title / Subtitle / Author / Publisher**: Standard indexing parameters.
   - **Selling Price / MRP / Discount**: Price settings (negative amounts are blocked by validation).
   - **Stock Quantity / SKU**: Used for inventory logs.
   - **SEO Fields**: Meta Title, Meta Description, and Search Keywords for Google ranking.
4. Upload the Cover Image (see section below).
5. Choose Status: **Save Draft** or **Publish**.

### Uploading & Editing Book Cover Images
- **How to Upload**: Use the drag-and-drop region or click the file explorer button to select files.
- **Supported Formats**: JPEG, PNG, WEBP.
- **File Validation**: Files exceeding **2MB** are rejected automatically.
- **Auto-Processing**: Uploaded images are compressed, converted to `.webp` format, and resized to fit standard thumbnail ratios.

### Editing & Deleting Books
- **Editing**: Modifying any field immediately updates the database. The storefront cache invalidates dynamically, so changes reflect on search grids instantly.
- **Deleting**: Books can be soft-deleted (hidden from the public grid) or deleted permanently from the catalogue.

---

## 📦 3. Store Inventory & Logistics

### Stock Management
- The console tracks warehouse and shelf stock counts.
- Negative stock inputs are blocked.
- Threshold alerts notify admins when stock falls below **5 units**.

### Orders & Invoicing
- All incoming orders are processed in the **Orders** tab.
- Click on any order to download a GST-separated print-ready invoice.
- Change order state to `Confirmed`, `Shipped`, or `Delivered` to notify the student.

### Coupons & Discounts
- Manage store coupon codes.
- Validate expiry dates and discount amounts (percentage or flat rate) to prevent double-discounting.

---

## ⚙️ 4. System Governance & Settings

### Staff Roles & Permissions
- ERP Console access is strictly role-based:
  - **Administrator**: Full access to logs, backups, and staff directories.
  - **Manager**: Inventory edits, orders management.
  - **Operator**: Order confirmation and barcode printing.

### SEO Configuration
- Global metadata adjustments (Index titles, home page keywords) are managed in **SEO Settings**.

### Backups & Logs
- **System Backups**: Automatically generated every 24 hours. Admins can manually click "Create Backup" to generate a database dump.
- **Audit Logs**: Records all critical administrative changes. Each entry logs:
  - Timestamp
  - Admin identity
  - Action taken
  - Client IP and User-Agent parameters.
