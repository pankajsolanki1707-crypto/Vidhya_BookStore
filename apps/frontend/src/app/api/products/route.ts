import { NextRequest, NextResponse } from 'next/server';
import { searchProducts, addProduct } from '@/lib/database';
import { verifyToken, sanitizeInput, validateImageUrl } from '@/lib/security';

// Verify if request has a valid Admin JWT token
function isAdminAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get('Authorization') || req.headers.get('x-admin-password');
  if (!authHeader) return false;

  const payload = verifyToken(authHeader);
  return payload !== null && payload.role === 'admin';
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || undefined;
    const category = searchParams.get('category') || undefined;
    const format = searchParams.get('format') || undefined;
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const sort = searchParams.get('sort') || undefined;
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 12;

    const result = searchProducts({
      query,
      category,
      format,
      minPrice,
      maxPrice,
      sort,
      page,
      limit
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching products via API:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isAdminAuthorized(req)) {
      return NextResponse.json({ error: 'Unauthorized admin credentials' }, { status: 401 });
    }

    const body = await req.json();
    const { title, author, price, category, format, image, description, stockCount } = body;

    // Validation
    if (!title || !author || price === undefined || !category || !format || !image || !description) {
      return NextResponse.json({ error: 'Missing required catalog fields' }, { status: 400 });
    }

    // Image URL Validation (blocks execution vectors)
    if (!validateImageUrl(image)) {
      return NextResponse.json({ error: 'Secure Image URL is required (must use HTTPS or local assets)' }, { status: 400 });
    }

    // Input sanitization
    const sanitizedTitle = sanitizeInput(title);
    const sanitizedAuthor = sanitizeInput(author);
    const sanitizedDesc = sanitizeInput(description);
    const sanitizedPub = sanitizeInput(body.publisher || '');
    const sanitizedSub = sanitizeInput(body.subcategory || '');
    const sanitizedIsbn = sanitizeInput(body.isbn || '');

    const productData = {
      id: sanitizedTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.floor(Math.random() * 1000),
      title: sanitizedTitle,
      author: sanitizedAuthor,
      publisher: sanitizedPub,
      price: Number(price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      category,
      subcategory: sanitizedSub,
      format,
      image,
      description: sanitizedDesc,
      stockCount: stockCount !== undefined ? Number(stockCount) : 10,
      inStock: stockCount !== undefined ? Number(stockCount) > 0 : true,
      isbn: sanitizedIsbn,
      pages: body.pages ? Number(body.pages) : 0,
      publishYear: body.publishYear ? Number(body.publishYear) : new Date().getFullYear(),
      featured: body.featured || false,
      isBestseller: body.isBestseller || false,
      isNewArrival: body.isNewArrival || false
    };

    const newProduct = addProduct(productData);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error adding product via API:', error);
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}
