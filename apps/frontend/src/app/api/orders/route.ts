import { NextRequest, NextResponse } from 'next/server';
import { getOrders, addOrder, getProductById, updateProduct } from '@/lib/database';
import { 
  checkRateLimit, verifyToken, checkCsrf, 
  sanitizeInput, checkFraudAlert, writeAuditLog 
} from '@/lib/security';

import { verifyRolePermission } from '@/lib/rbac';

// Verify if request has a valid Admin JWT token
function isAdminAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get('Authorization');
  return verifyRolePermission(authHeader, 'tab_orders');
}

export async function GET(req: NextRequest) {
  try {
    if (!isAdminAuthorized(req)) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
    }
    const orders = getOrders();
    // Sort orders by newest first
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

  // 1. Rate Limiting Check
  if (!checkRateLimit(ip)) {
    writeAuditLog('GUEST', 'BLOCKED - ORDER SPAM RATE LIMIT EXCEEDED', ip);
    return NextResponse.json({ error: 'Too many requests. Try placing order again in a minute.' }, { status: 429 });
  }

  // 2. CSRF Origin Check
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  if (!checkCsrf(origin, referer)) {
    writeAuditLog('GUEST', 'BLOCKED - ORDER CSRF FAILURE', ip);
    return NextResponse.json({ error: 'Cross-site request blocked.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      customerName,
      phone,
      telegram,
      address,
      city,
      state,
      pincode,
      items,
      totalAmount,
      paymentMethod,
      paymentReference
    } = body;

    // Validation
    if (!customerName || !phone || !address || !city || !state || !pincode || !items || !items.length || !totalAmount || !paymentMethod) {
      return NextResponse.json({ error: 'Missing required shipping or order details' }, { status: 400 });
    }

    if (paymentMethod === 'UPI' && !paymentReference) {
      return NextResponse.json({ error: 'UPI Transaction Reference is required' }, { status: 400 });
    }

    // 3. Input Sanitization (XSS & Injection Protection)
    const sanitizedName = sanitizeInput(customerName);
    const sanitizedPhone = sanitizeInput(phone);
    const sanitizedTelegram = sanitizeInput(telegram || '');
    const sanitizedAddress = sanitizeInput(address);

    // 4. Fraud Detection checks (Flags large transactions above ₹10,000)
    const totalQty = items.reduce((acc: number, item: any) => acc + item.quantity, 0);
    const isFraudulent = checkFraudAlert(Number(totalAmount), totalQty);
    
    if (isFraudulent) {
      writeAuditLog('GUEST', `FRAUD ALERT - Transaction value ₹${totalAmount} flagged for manual review`, ip);
    }

    // Verify stock and update quantities
    for (const item of items) {
      const dbProduct = getProductById(item.id);
      if (!dbProduct) {
        return NextResponse.json({ error: `Product not found: ${item.title}` }, { status: 400 });
      }
      if (dbProduct.stockCount < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for: ${item.title}. Available: ${dbProduct.stockCount}` }, { status: 400 });
      }
    }

    // Deduct stock
    for (const item of items) {
      const dbProduct = getProductById(item.id);
      if (dbProduct) {
        const newStock = dbProduct.stockCount - item.quantity;
        updateProduct(item.id, {
          stockCount: newStock,
          inStock: newStock > 0
        });
      }
    }

    // Place Order
    const newOrder = addOrder({
      customerName: sanitizedName,
      phone: sanitizedPhone,
      telegram: sanitizedTelegram,
      address: sanitizedAddress,
      city: sanitizeInput(city),
      state: sanitizeInput(state),
      pincode: sanitizeInput(pincode),
      items,
      totalAmount: Number(totalAmount),
      paymentMethod,
      paymentReference: sanitizeInput(paymentReference || '')
    });

    writeAuditLog('GUEST', `ORDER PLACED - Order ID: ${newOrder.id} | Amount: ₹${totalAmount}`, ip);

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error) {
    console.error('Error placing order:', error);
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  }
}
