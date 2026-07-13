import { NextRequest, NextResponse } from 'next/server';
import { getProductById, updateProduct, deleteProduct } from '@/lib/database';
import { verifyToken, sanitizeInput, validateImageUrl } from '@/lib/security';

function isAdminAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get('Authorization') || req.headers.get('x-admin-password');
  if (!authHeader) return false;

  const payload = verifyToken(authHeader);
  return payload !== null && payload.role === 'admin';
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = getProductById(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product detail:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAdminAuthorized(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    
    // Normalize & Sanitize fields
    if (body.price !== undefined) body.price = Number(body.price);
    if (body.originalPrice !== undefined) body.originalPrice = Number(body.originalPrice);
    if (body.stockCount !== undefined) {
      body.stockCount = Number(body.stockCount);
      body.inStock = body.stockCount > 0;
    }
    if (body.pages !== undefined) body.pages = Number(body.pages);
    if (body.publishYear !== undefined) body.publishYear = Number(body.publishYear);

    // Sanitize string attributes
    if (body.title) body.title = sanitizeInput(body.title);
    if (body.author) body.author = sanitizeInput(body.author);
    if (body.description) body.description = sanitizeInput(body.description);
    if (body.publisher) body.publisher = sanitizeInput(body.publisher);
    if (body.subcategory) body.subcategory = sanitizeInput(body.subcategory);
    if (body.isbn) body.isbn = sanitizeInput(body.isbn);

    if (body.image && !validateImageUrl(body.image)) {
      return NextResponse.json({ error: 'Secure Image URL is required' }, { status: 400 });
    }

    const updated = updateProduct(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAdminAuthorized(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const success = deleteProduct(id);
    if (!success) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
