import { Controller, Post, Body, HttpException, HttpStatus, Headers } from '@nestjs/common';
import { prisma } from 'database';

@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body() body: any) {
    const { email, password } = body;
    if (!email || !password) {
      throw new HttpException('Email and password required', HttpStatus.BAD_REQUEST);
    }
    
    // Simulate lookup
    const adminPassword = process.env.ADMIN_PASSWORD || 'VidhyaBookStoreIndore2026';
    if (email === 'admin@vidhya.com' && password === adminPassword) {
      return { success: true, role: 'admin', token: 'jwt-signed-admin-token-2026' };
    }
    
    return { success: true, role: 'student', token: `jwt-student-${email}` };
  }

  @Post('register')
  async register(@Body() body: any) {
    const { email, name, phone } = body;
    if (!email || !name) {
      throw new HttpException('Email and name are required', HttpStatus.BAD_REQUEST);
    }
    return { success: true, message: `Account pending email verification for: ${email}` };
  }

  @Post('otp')
  async verifyOtp(@Body() body: any) {
    const { phone, code } = body;
    if (!phone || !code) {
      throw new HttpException('Phone number and code required', HttpStatus.BAD_REQUEST);
    }
    if (code === '1234') {
      return { success: true, token: `jwt-signed-phone-${phone}` };
    }
    throw new HttpException('Invalid verification OTP code', HttpStatus.UNAUTHORIZED);
  }
}
