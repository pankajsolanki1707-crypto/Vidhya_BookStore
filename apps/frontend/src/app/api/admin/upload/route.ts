import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { verifyRolePermission } from '@/lib/rbac';
import { writeAuditRecord } from '@/lib/audit_logs';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!verifyRolePermission(authHeader, 'action_inventory_write')) {
    return NextResponse.json({ error: 'Unauthorized upload access' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { image } = body;

    if (!image || !image.startsWith('data:image/')) {
      return NextResponse.json({ error: 'Invalid image format. Expected data URI' }, { status: 400 });
    }

    // Extract base64 content
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');

    // Validate size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (buffer.length > MAX_SIZE) {
      return NextResponse.json({ error: 'File size exceeds maximum 5MB limit' }, { status: 400 });
    }

    // Prepare uploads directory
    const uploadsDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Content-addressable file naming to prevent duplicate uploads
    const fileHash = crypto.createHash('sha256').update(buffer).digest('hex').slice(0, 32);
    const uniqueName = `img-${fileHash}.webp`;
    const filePath = path.join(uploadsDir, uniqueName);
    const relativeUrl = `/uploads/${uniqueName}`;

    // Only write to disk if file doesn't already exist
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, buffer);
    }

    writeAuditRecord({
      adminName: 'Inventory Uploader',
      action: 'IMAGE UPLOADED',
      newValue: relativeUrl
    });

    return NextResponse.json({ success: true, url: relativeUrl });
  } catch (error) {
    console.error('Error in upload API:', error);
    return NextResponse.json({ error: 'Image processing failed' }, { status: 500 });
  }
}
