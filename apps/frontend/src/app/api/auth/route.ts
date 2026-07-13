import { NextRequest, NextResponse } from 'next/server';
import { 
  checkRateLimit, signToken, encryptPassword, 
  checkCsrf, writeAuditLog 
} from '@/lib/security';

export async function POST(req: NextRequest) {
  // Get Client IP for Rate Limiting
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

  // 1. Rate Limiting Check (Defends against Brute Force Attacks)
  if (!checkRateLimit(ip)) {
    writeAuditLog('GUEST', 'BLOCKED - RATE LIMIT EXCEEDED', ip);
    return NextResponse.json(
      { error: 'Too many requests. Please try again in 1 minute.' }, 
      { status: 429 }
    );
  }

  // 2. CSRF Origin Verification
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  if (!checkCsrf(origin, referer)) {
    writeAuditLog('GUEST', 'BLOCKED - CSRF ORIGIN INVALID', ip);
    return NextResponse.json(
      { error: 'Cross-Site Request Blocked. Invalid Referer.' }, 
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { password } = body;
    const adminPassword = process.env.ADMIN_PASSWORD || 'VidhyaBookStoreIndore2026';

    // 3. Cryptographic Password Comparison
    const hashedInput = encryptPassword(password);
    const hashedAdmin = encryptPassword(adminPassword);

    if (hashedInput === hashedAdmin) {
      // 4. Secure JWT Token Signing (expiring in 2 hours)
      const token = signToken({
        role: 'admin',
        username: 'VBSManager',
        exp: Math.floor(Date.now() / 1000) + (2 * 60 * 60) // 2 hours
      });

      writeAuditLog('admin', 'LOGIN SUCCESSFUL', ip);

      // Create response
      const response = NextResponse.json({ success: true, token });

      // Set Secure HttpOnly Session Cookie
      response.cookies.set('vbs_admin_session', token, {
        httpOnly: true,
        secure: true, // HTTPS Only
        sameSite: 'strict',
        maxAge: 2 * 60 * 60 // 2 hours
      });

      return response;
    }

    writeAuditLog('GUEST', 'LOGIN FAILED - INVALID PASSWORD', ip);
    return NextResponse.json(
      { success: false, error: 'Incorrect administrator password' }, 
      { status: 401 }
    );
  } catch (error) {
    console.error('Error during authentication API:', error);
    return NextResponse.json(
      { error: 'Failed to process authentication request' }, 
      { status: 500 }
    );
  }
}
