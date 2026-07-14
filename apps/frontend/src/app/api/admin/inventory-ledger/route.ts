import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyRolePermission } from '@/lib/rbac';
import { getProductById, updateProduct } from '@/lib/database';
import { writeAuditRecord } from '@/lib/audit_logs';

const LEDGER_FILE = path.join(process.cwd(), 'src/data/inventory_ledger.json');

export interface LedgerLog {
  id: string;
  productId: string;
  productTitle: string;
  action: 'Increase' | 'Decrease' | 'Purchase' | 'Adjustment' | 'Damage' | 'Lost' | 'Returned';
  quantity: number;
  prevStock: number;
  newStock: number;
  timestamp: string;
  adminName: string;
  reason: string;
}

function ensureLedgerFileExists(): LedgerLog[] {
  const dir = path.dirname(LEDGER_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(LEDGER_FILE)) {
    fs.writeFileSync(LEDGER_FILE, JSON.stringify([], null, 2), 'utf-8');
    return [];
  }
  try {
    const data = fs.readFileSync(LEDGER_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeLedger(logs: LedgerLog[]) {
  try {
    fs.writeFileSync(LEDGER_FILE, JSON.stringify(logs, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing inventory ledger:', err);
  }
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!verifyRolePermission(authHeader, 'tab_inventory')) {
    return NextResponse.json({ error: 'Unauthorized ledger access' }, { status: 403 });
  }

  try {
    const logs = ensureLedgerFileExists();
    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error listing inventory ledger:', error);
    return NextResponse.json({ error: 'Failed to retrieve ledger' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!verifyRolePermission(authHeader, 'action_inventory_write')) {
    return NextResponse.json({ error: 'Unauthorized inventory write access' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { productId, action, quantity, reason = '', adminName = 'Staff' } = body;

    if (!productId || !action || quantity === undefined) {
      return NextResponse.json({ error: 'Missing required ledger fields' }, { status: 400 });
    }

    const product = getProductById(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const prevStock = product.stockCount || 0;
    let newStock = prevStock;

    if (['Increase', 'Purchase', 'Returned'].includes(action)) {
      newStock += Number(quantity);
    } else {
      newStock -= Number(quantity);
    }

    if (newStock < 0) {
      return NextResponse.json({ error: 'Stock levels cannot drop below 0' }, { status: 400 });
    }

    // Update product stock Count
    const updated = updateProduct(productId, {
      stockCount: newStock,
      inStock: newStock > 0
    });

    if (!updated) {
      return NextResponse.json({ error: 'Failed to update catalog stock' }, { status: 500 });
    }

    const logs = ensureLedgerFileExists();
    const newLog: LedgerLog = {
      id: 'LED-' + Date.now().toString() + '-' + Math.floor(Math.random() * 1000),
      productId,
      productTitle: product.title,
      action,
      quantity: Number(quantity),
      prevStock,
      newStock,
      timestamp: new Date().toISOString(),
      adminName,
      reason
    };

    logs.unshift(newLog);
    writeLedger(logs);

    writeAuditRecord({
      adminName,
      action: `STOCK ADJUSTMENT (${action})`,
      oldValue: `Stock: ${prevStock}`,
      newValue: `Stock: ${newStock} for "${product.title}"`
    });

    return NextResponse.json({ success: true, log: newLog, product: updated });
  } catch (error) {
    console.error('Error posting to ledger:', error);
    return NextResponse.json({ error: 'Failed to submit ledger adjustment' }, { status: 500 });
  }
}
