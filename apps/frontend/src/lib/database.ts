import fs from 'fs';
import path from 'path';

export interface Product {
  id: string;
  title: string;
  author: string;
  publisher?: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  format: 'Paperback' | 'Hardcover' | 'E-book' | 'Stationery' | 'Bundle';
  image: string;
  description: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  isbn?: string;
  pages?: number;
  publishYear?: number;
  featured?: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  // Soft-delete & visibility fields (admin-only)
  deletedAt?: string;           // ISO timestamp — present means soft-deleted
  visibility?: 'Visible' | 'Hidden' | 'Draft';
  status?: string;
}

export interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  telegram?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: 'COD' | 'UPI';
  paymentReference?: string;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

const PRODUCTS_PATH = path.join(process.cwd(), 'src/data/products.json');
const ORDERS_PATH = path.join(process.cwd(), 'src/data/orders.json');

// Helper to ensure data files exist
function ensureFilesExist() {
  const dataDir = path.join(process.cwd(), 'src/data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(PRODUCTS_PATH)) {
    fs.writeFileSync(PRODUCTS_PATH, JSON.stringify([], null, 2), 'utf-8');
  }
  if (!fs.existsSync(ORDERS_PATH)) {
    fs.writeFileSync(ORDERS_PATH, JSON.stringify([], null, 2), 'utf-8');
  }
}

// Read products
export function getProducts(): Product[] {
  ensureFilesExist();
  try {
    const data = fs.readFileSync(PRODUCTS_PATH, 'utf-8');
    return JSON.parse(data) as Product[];
  } catch (error) {
    console.error('Error reading products database:', error);
    return [];
  }
}

// Write products
export function saveProducts(products: Product[]): boolean {
  ensureFilesExist();
  const tempPath = PRODUCTS_PATH + '.tmp';
  try {
    fs.writeFileSync(tempPath, JSON.stringify(products, null, 2), 'utf-8');
    fs.renameSync(tempPath, PRODUCTS_PATH);
    return true;
  } catch (error) {
    console.error('Error writing products database:', error);
    if (fs.existsSync(tempPath)) {
      try { fs.unlinkSync(tempPath); } catch {}
    }
    return false;
  }
}

// Read orders
export function getOrders(): Order[] {
  ensureFilesExist();
  try {
    const data = fs.readFileSync(ORDERS_PATH, 'utf-8');
    return JSON.parse(data) as Order[];
  } catch (error) {
    console.error('Error reading orders database:', error);
    return [];
  }
}

// Write orders
export function saveOrders(orders: Order[]): boolean {
  ensureFilesExist();
  const tempPath = ORDERS_PATH + '.tmp';
  try {
    fs.writeFileSync(tempPath, JSON.stringify(orders, null, 2), 'utf-8');
    fs.renameSync(tempPath, ORDERS_PATH);
    return true;
  } catch (error) {
    console.error('Error writing orders database:', error);
    if (fs.existsSync(tempPath)) {
      try { fs.unlinkSync(tempPath); } catch {}
    }
    return false;
  }
}

// Get single product by ID
export function getProductById(id: string, includeDeleted = false): Product | undefined {
  const products = getProducts();
  const prod = products.find(p => p.id === id);
  if (!prod) return undefined;
  // If not including deleted/hidden, filter out
  if (!includeDeleted && (prod.deletedAt || prod.visibility === 'Hidden' || prod.visibility === 'Draft')) {
    return undefined;
  }
  return prod;
}

// Search and filter products
export function searchProducts(filters: {
  query?: string;
  category?: string;
  format?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string; // 'price-low', 'price-high', 'rating', 'newest'
  page?: number;
  limit?: number;
  showDeleted?: boolean;
  showDrafts?: boolean;
}) {
  const products = getProducts();
  let filtered = [...products];

  // Apply visibility and soft-deletion filters
  if (!filters.showDeleted) {
    filtered = filtered.filter(p => !p.deletedAt && p.visibility !== 'Hidden');
  }
  if (!filters.showDrafts) {
    filtered = filtered.filter(p => p.visibility !== 'Draft');
  }

  const query = filters.query?.trim().toLowerCase();
  const category = filters.category?.trim();
  const format = filters.format?.trim();
  const minPrice = filters.minPrice;
  const maxPrice = filters.maxPrice;
  const sort = filters.sort;
  const page = filters.page || 1;
  const limit = filters.limit || 12;

  // Filter by query (title, author, publisher, description, isbn)
  if (query) {
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(query) ||
      p.author.toLowerCase().includes(query) ||
      p.publisher?.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.isbn?.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
  }

  // Filter by category
  if (category && category.toLowerCase() !== 'all') {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  // Filter by format
  if (format && format.toLowerCase() !== 'all') {
    filtered = filtered.filter(p => p.format.toLowerCase() === format.toLowerCase());
  }

  // Filter by price range
  if (minPrice !== undefined) {
    filtered = filtered.filter(p => p.price >= minPrice);
  }
  if (maxPrice !== undefined) {
    filtered = filtered.filter(p => p.price <= maxPrice);
  }

  // Sorting
  if (sort) {
    if (sort === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'newest') {
      filtered.sort((a, b) => (b.publishYear || 0) - (a.publishYear || 0));
    }
  }

  // Pagination
  const total = filtered.length;
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  return {
    products: paginated,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
}

// Add a new order
export function addOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Order {
  const orders = getOrders();
  const newOrder: Order = {
    ...orderData,
    id: 'VBS-' + Date.now().toString().slice(-6) + '-' + Math.floor(1000 + Math.random() * 9000).toString(),
    createdAt: new Date().toISOString(),
    status: 'Pending'
  };
  orders.push(newOrder);
  saveOrders(orders);
  return newOrder;
}

// Update an existing order status (admin)
export function updateOrderStatus(orderId: string, status: Order['status']): Order | undefined {
  const orders = getOrders();
  const index = orders.findIndex(o => o.id === orderId);
  if (index !== -1) {
    orders[index].status = status;
    saveOrders(orders);
    return orders[index];
  }
  return undefined;
}

// Add a new product (admin)
export function addProduct(product: Omit<Product, 'rating' | 'reviewCount'>): Product {
  const products = getProducts();
  const newProduct: Product = {
    ...product,
    rating: 5.0,
    reviewCount: 0
  };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
}

// Helper to remove unused image uploads from disk
function cleanUnusedImages(oldProduct: Product | undefined, newProduct: Product | null) {
  if (!oldProduct) return;
  try {
    const products = getProducts();
    const oldImages = [oldProduct.image, (oldProduct as any).backCoverImage, (oldProduct as any).insidePageImage].filter(Boolean) as string[];
    const newImages = newProduct ? [newProduct.image, (newProduct as any).backCoverImage, (newProduct as any).insidePageImage].filter(Boolean) as string[] : [];

    for (const img of oldImages) {
      if (newImages.includes(img)) continue;
      // Check if any other product in database references the same image path
      const isStillUsed = products.some(p => p.image === img || (p as any).backCoverImage === img || (p as any).insidePageImage === img);
      if (!isStillUsed && img.startsWith('/uploads/')) {
        const filePath = path.join(process.cwd(), 'public', img);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`[CLEANUP] Deleted unused image file: ${filePath}`);
        }
      }
    }
  } catch (err) {
    console.error('Error during image cleanup:', err);
  }
}

// Edit a product (admin)
export function updateProduct(id: string, updatedFields: Partial<Product>): Product | undefined {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    const oldProduct = { ...products[index] };
    products[index] = { ...products[index], ...updatedFields };
    saveProducts(products);
    cleanUnusedImages(oldProduct, products[index]);
    return products[index];
  }
  return undefined;
}

// Delete a product (admin)
export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    const oldProduct = { ...products[index] };
    const filtered = products.filter(p => p.id !== id);
    saveProducts(filtered);
    cleanUnusedImages(oldProduct, null);
    return true;
  }
  return false;
}
