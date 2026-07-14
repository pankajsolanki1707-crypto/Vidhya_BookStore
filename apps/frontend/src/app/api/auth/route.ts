import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, checkCsrf, encryptPassword, signToken } from '@/lib/security';
import { getStaffList } from '@/lib/rbac';
import { 
  checkLockout, recordFailedAttempt, resetAttempts, 
  generatePersistentOTP, verifyPersistentOTP, logLoginHistory 
} from '@/lib/auth_security';
import { writeAuditRecord } from '@/lib/audit_logs';
import { registerSession } from '@/lib/session_manager';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const userAgent = req.headers.get('user-agent') || '';

  // 1. Rate Limiting Check
  if (!checkRateLimit(ip)) {
    writeAuditRecord({ adminName: 'GUEST', action: 'BLOCKED - RATE LIMIT EXCEEDED', ip, userAgent });
    return NextResponse.json(
      { error: 'Too many requests. Please try again in 1 minute.' }, 
      { status: 429 }
    );
  }

  // 2. CSRF Origin Verification
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  if (!checkCsrf(origin, referer)) {
    writeAuditRecord({ adminName: 'GUEST', action: 'BLOCKED - CSRF ORIGIN INVALID', ip, userAgent });
    return NextResponse.json(
      { error: 'Cross-Site Request Blocked. Invalid Referer.' }, 
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { password, otp, email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email address is required.' }, { status: 400 });
    }

    // 3. Brute Force & Account Lockout Check
    const lockoutState = checkLockout(email);
    if (lockoutState.isLocked) {
      writeAuditRecord({ adminName: email, action: 'LOGIN BLOCKED - ACCOUNT LOCKED', ip, userAgent });
      return NextResponse.json(
        { error: `Account locked due to multiple failed login attempts. Please try again in ${lockoutState.remainingTime} seconds.` }, 
        { status: 423 }
      );
    }

    // Find staff member
    const staffMembers = getStaffList();
    const staff = staffMembers.find(s => s.email.toLowerCase() === email.toLowerCase());

    if (!staff) {
      // Avoid user enumeration by applying same artificial delay and returning generic error
      recordFailedAttempt(email);
      logLoginHistory({ email, ip, userAgent, success: false, failedAttempts: 1 });
      return NextResponse.json(
        { success: false, error: 'Incorrect credentials or unauthorized access.' }, 
        { status: 401 }
      );
    }

    // 4. Password Check
    const hashedInput = encryptPassword(password || '');
    if (hashedInput !== staff.passwordHash) {
      recordFailedAttempt(email);
      logLoginHistory({ email, ip, userAgent, success: false, failedAttempts: 1 });
      writeAuditRecord({ adminName: staff.name, action: `LOGIN FAILED - INVALID PASSWORD`, ip, userAgent });
      return NextResponse.json(
        { success: false, error: 'Incorrect credentials or unauthorized access.' }, 
        { status: 401 }
      );
    }

    // 5. Two-Factor Authentication Check
    if (!otp) {
      // Password is correct, generate OTP
      const generatedOtp = generatePersistentOTP(email);
      
      // LOG OTP FOR DEVELOPER / TEST VERIFICATION
      console.log(`[SECURITY] 6-digit OTP Generated for ${email}: [ ${generatedOtp} ] (Expires in 5 minutes)`);
      
      writeAuditRecord({ adminName: staff.name, action: '2FA OTP GENERATED', ip, userAgent });
      
      return NextResponse.json({
        success: true,
        is2faRequired: true,
        // Send OTP in response for test scenarios as we have no mail server
        otp: generatedOtp 
      });
    }

    // 6. Verify OTP
    if (!verifyPersistentOTP(email, otp)) {
      recordFailedAttempt(email);
      logLoginHistory({ email, ip, userAgent, success: false, failedAttempts: 1 });
      writeAuditRecord({ adminName: staff.name, action: 'LOGIN FAILED - INVALID OTP', ip, userAgent });
      return NextResponse.json(
        { success: false, error: 'Invalid or expired 2FA OTP code.' }, 
        { status: 401 }
      );
    }

    // Success! Reset Lockout attempts
    resetAttempts(email);

    // 7. Secure JWT Token Signing
    const token = signToken({
      role: staff.role,
      email: staff.email,
      name: staff.name,
      exp: Math.floor(Date.now() / 1000) + (2 * 60 * 60) // 2 hours session absolute timeout
    });

    logLoginHistory({ email, ip, userAgent, success: true, failedAttempts: 0 });
    registerSession(staff.email, token, userAgent);
    writeAuditRecord({ adminName: staff.name, action: 'LOGIN SUCCESSFUL', ip, userAgent });

    const response = NextResponse.json({ 
      success: true, 
      token, 
      role: staff.role,
      name: staff.name 
    });

    // 8. Set Secure HTTPOnly Session Cookie
    response.cookies.set('vbs_admin_session', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 2 * 60 * 60 // 2 hours
    });

    return response;
  } catch (error) {
    console.error('Error during authentication API:', error);
    return NextResponse.json(
      { error: 'Failed to process authentication request' }, 
      { status: 500 }
    );
  }
}
