import { Controller, Get, Post, Patch, Body, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { prisma } from 'database';

@Controller('orders')
export class OrdersController {
  @Get()
  async getOrders() {
    return prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  @Post()
  async placeOrder(@Body() body: any) {
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

    if (!customerName || !phone || !address || !city || !state || !pincode || !items || !items.length || !totalAmount) {
      throw new HttpException('Missing required checkout shipping details', HttpStatus.BAD_REQUEST);
    }

    const orderId = `VBS-${Math.floor(10000 + Math.random() * 90000)}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create Order in relational transaction
    return prisma.order.create({
      data: {
        id: orderId,
        customerName,
        phone,
        telegram: telegram || '',
        address,
        city,
        state,
        pincode,
        totalAmount: parseFloat(totalAmount),
        paymentMethod,
        paymentReference: paymentReference || '',
        status: 'Pending',
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: parseInt(item.quantity),
            price: parseFloat(item.price)
          }))
        }
      },
      include: { items: true }
    });
  }

  @Patch(':id')
  async updateStatus(@Param('id') id: string, @Body() body: any) {
    const { status } = body;
    if (!status) {
      throw new HttpException('Status is required', HttpStatus.BAD_REQUEST);
    }

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    return prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true }
    });
  }
}
