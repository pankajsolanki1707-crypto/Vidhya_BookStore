import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyRolePermission } from '@/lib/rbac';
import { getProducts, getOrders, saveProducts, saveOrders } from '@/lib/database';
import { writeAuditRecord } from '@/lib/audit_logs';

const BACKUPS_DIR = path.join(process.cwd(), 'src/data/backups');

function ensureBackupsDirExists() {
  if (!fs.existsSync(BACKUPS_DIR)) {
    fs.mkdirSync(BACKUPS_DIR, { recursive: true });
  }
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!verifyRolePermission(authHeader, 'tab_backup')) {
    return NextResponse.json({ error: 'Unauthorized backup access' }, { status: 403 });
  }

  try {
    ensureBackupsDirExists();
    const files = fs.readdirSync(BACKUPS_DIR);
    const backups = files
      .filter(f => f.startsWith('backup-') && f.endsWith('.json'))
      .map(filename => {
        const filePath = path.join(BACKUPS_DIR, filename);
        const stats = fs.statSync(filePath);
        return {
          filename,
          size: `${Math.round(stats.size / 1024)} KB`,
          createdAt: stats.birthtime.toISOString()
        };
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return NextResponse.json(backups);
  } catch (error) {
    console.error('Error listing backups:', error);
    return NextResponse.json({ error: 'Failed to list backups' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!verifyRolePermission(authHeader, 'tab_backup')) {
    return NextResponse.json({ error: 'Unauthorized backup access' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { action, filename } = body;

    ensureBackupsDirExists();

    if (action === 'create') {
      const snapshot = {
        products: getProducts(),
        orders: getOrders(),
        timestamp: new Date().toISOString()
      };

      const backupName = `backup-${Date.now()}.json`;
      const filePath = path.join(BACKUPS_DIR, backupName);
      fs.writeFileSync(filePath, JSON.stringify(snapshot, null, 2), 'utf-8');

      writeAuditRecord({
        adminName: 'Backup Manager',
        action: 'BACKUP CREATED',
        newValue: backupName
      });

      return NextResponse.json({ success: true, filename: backupName });
    } 
    
    if (action === 'restore') {
      if (!filename) {
        return NextResponse.json({ error: 'Filename is required for restore' }, { status: 400 });
      }

      const filePath = path.join(BACKUPS_DIR, filename);
      if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: 'Backup file not found' }, { status: 404 });
      }

      const data = fs.readFileSync(filePath, 'utf-8');
      const snapshot = JSON.parse(data);

      if (!snapshot.products || !snapshot.orders) {
        return NextResponse.json({ error: 'Invalid backup file structure' }, { status: 400 });
      }

      // Restore atomically
      const productsRestored = saveProducts(snapshot.products);
      const ordersRestored = saveOrders(snapshot.orders);

      if (productsRestored && ordersRestored) {
        writeAuditRecord({
          adminName: 'Backup Manager',
          action: 'BACKUP RESTORED',
          oldValue: filename,
          newValue: 'Database Restored Successfully'
        });
        return NextResponse.json({ success: true, message: 'Database restored successfully' });
      } else {
        return NextResponse.json({ error: 'Failed to write restored data' }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error during backup operations:', error);
    return NextResponse.json({ error: 'Backup operation failed' }, { status: 500 });
  }
}
