import { Module, Controller, Get } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { ProductsController } from './products/products.controller';
import { OrdersController } from './orders/orders.controller';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Vidhya Book Store Backend API is running! Please visit the Frontend client at http://localhost:3000';
  }
}

@Module({
  imports: [],
  controllers: [AppController, AuthController, ProductsController, OrdersController],
  providers: [],
})
export class AppModule {}
