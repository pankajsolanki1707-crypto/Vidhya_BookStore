import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS for frontend requests from port 3000
  app.enableCors({
    origin: ['http://localhost:3000', 'https://vidhyabookstore.com'],
    credentials: true,
  });
  
  await app.listen(3001);
  console.log(`[NestJS Server] Sourced active catalog APIs on: http://localhost:3001`);
}
bootstrap();
