import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus } from '@/lib/database';
import { verifyToken, sanitizeInput } from '@/lib/security';

function isAdminAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get('Authorization') || req.headers.get('x-admin-password');
  if (!authHeader) return false;

  const payload = verifyToken(authHeader);
  return payload !== null && payload.role === 'admin';
}

async function handleStatusUpdate(
  req: NextRequest,
  id: string
) {
  try {
    if (!isAdminAuthorized(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const sanitizedStatus = sanitizeInput(status);
    const updatedOrder = updateOrderStatus(id, sanitizedStatus as any);
    if (!updatedOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return handleStatusUpdate(req, id);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return handleStatusUpdate(req, id);
}
