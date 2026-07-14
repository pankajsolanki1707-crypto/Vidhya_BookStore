import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { prisma } from 'database';

@Controller('products')
export class ProductsController {
  @Get()
  async getProducts(
    @Query('query') query?: string,
    @Query('category') category?: string,
    @Query('format') format?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '12'
  ) {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Dynamic Prisma SQL queries
    const where: any = {};
    if (category) where.category = category;
    if (format) where.format = format;
    if (query) {
      const isSqlite = (prisma as any)._activeProvider === 'sqlite';
      where.OR = [
        { title: { contains: query, ...(isSqlite ? {} : { mode: 'insensitive' }) } },
        { author: { contains: query, ...(isSqlite ? {} : { mode: 'insensitive' }) } },
        { isbn: { contains: query, ...(isSqlite ? {} : { mode: 'insensitive' }) } }
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.product.count({ where })
    ]);

    return {
      products,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / take)
    };
  }

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new HttpException('Product not found in catalog', HttpStatus.NOT_FOUND);
    }
    return product;
  }

  @Post()
  async addProduct(@Body() body: any) {
    const { id, title, author, price, category, format, image, description } = body;
    if (!title || !author || price === undefined || !category || !format || !image) {
      throw new HttpException('Missing required product parameters', HttpStatus.BAD_REQUEST);
    }

    const productId = id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.floor(Math.random() * 1000);

    return prisma.product.create({
      data: {
        id: productId,
        title,
        author,
        publisher: body.publisher || '',
        price: parseFloat(price),
        originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : null,
        category,
        subcategory: body.subcategory || '',
        format,
        image,
        description: description || '',
        stockCount: body.stockCount ? parseInt(body.stockCount) : 10,
        inStock: body.stockCount ? parseInt(body.stockCount) > 0 : true,
        isbn: body.isbn || '',
        pages: body.pages ? parseInt(body.pages) : 0,
        publishYear: body.publishYear ? parseInt(body.publishYear) : new Date().getFullYear(),
        featured: !!body.featured,
        isBestseller: !!body.isBestseller,
        isNewArrival: !!body.isNewArrival
      }
    });
  }

  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() body: any) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new HttpException('Product not found in database', HttpStatus.NOT_FOUND);
    }

    const data: any = {};
    if (body.title !== undefined) data.title = body.title;
    if (body.author !== undefined) data.author = body.author;
    if (body.publisher !== undefined) data.publisher = body.publisher;
    if (body.price !== undefined) data.price = parseFloat(body.price);
    if (body.originalPrice !== undefined) data.originalPrice = parseFloat(body.originalPrice);
    if (body.category !== undefined) data.category = body.category;
    if (body.subcategory !== undefined) data.subcategory = body.subcategory;
    if (body.format !== undefined) data.format = body.format;
    if (body.image !== undefined) data.image = body.image;
    if (body.description !== undefined) data.description = body.description;
    if (body.stockCount !== undefined) {
      data.stockCount = parseInt(body.stockCount);
      data.inStock = data.stockCount > 0;
    }
    if (body.isbn !== undefined) data.isbn = body.isbn;
    if (body.pages !== undefined) data.pages = parseInt(body.pages);
    if (body.publishYear !== undefined) data.publishYear = parseInt(body.publishYear);
    if (body.featured !== undefined) data.featured = !!body.featured;
    if (body.isBestseller !== undefined) data.isBestseller = !!body.isBestseller;
    if (body.isNewArrival !== undefined) data.isNewArrival = !!body.isNewArrival;

    return prisma.product.update({ where: { id }, data });
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    await prisma.product.delete({ where: { id } });
    return { success: true, message: 'Product deleted from database successfully' };
  }
}
