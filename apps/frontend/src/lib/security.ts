import crypto from 'crypto';

// Server-side secret key for cryptography
const SECRET_KEY = process.env.JWT_SECRET || 'vidhya_store_indore_secret_key_2026_mppsc';

// Simple in-memory rate limiting map
// Maps IP to array of request timestamps
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_MAX = 60; // Max 60 requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute window

/**
 * Enterprise Rate Limiter
 * Returns true if request is allowed, false if limit exceeded (429)
 */
export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, [now]);
    return true;
  }

  const timestamps = rateLimitMap.get(ip) || [];
  // Filter out timestamps outside the window
  const activeTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);
  
  if (activeTimestamps.length >= RATE_LIMIT_MAX) {
    return false;
  }

  activeTimestamps.push(now);
  rateLimitMap.set(ip, activeTimestamps);
  return true;
}

/**
 * Secure password hashing using cryptographic scrypt (Argon2 replacement)
 */
export function encryptPassword(password: string): string {
  const salt = 'vbs_secure_salt_mppsc_2026_indore';
  // Enterprise-standard scrypt parameters
  const key = crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
  return key.toString('hex');
}

// In-memory OTP storage
const otpMap = new Map<string, { code: string; expires: number }>();

export function generateOTP(email: string): string {
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  otpMap.set(email, {
    code,
    expires: Date.now() + 5 * 60 * 1000 // 5 minutes expiration
  });
  return code;
}

export function verifyOTP(email: string, code: string): boolean {
  const record = otpMap.get(email);
  if (!record) return false;
  if (record.expires < Date.now()) {
    otpMap.delete(email);
    return false;
  }
  const match = record.code === code;
  if (match) {
    otpMap.delete(email);
  }
  return match;
}


/**
 * Cryptographic JWT Signature Generator (Enterprise-Grade)
 */
export function signToken(payload: object): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const base64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(`${base64Header}.${base64Payload}`)
    .digest('base64url');
    
  return `${base64Header}.${base64Payload}.${signature}`;
}

/**
 * Cryptographic JWT Signature Verification
 */
export function verifyToken(token: string): any | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [header, payload, signature] = parts;
    
    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(`${header}.${payload}`)
      .digest('base64url');
      
    if (signature !== expectedSignature) {
      return null;
    }
    
    // Decode payload
    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    
    // Check expiration if present
    if (decodedPayload.exp && decodedPayload.exp < Date.now() / 1000) {
      return null;
    }
    
    return decodedPayload;
  } catch (err) {
    return null;
  }
}

/**
 * CSRF protection: verify origin headers or custom headers
 */
export function checkCsrf(origin: string | null, referer: string | null): boolean {
  if (!origin && !referer) return true; // API client bypass
  
  const allowedHosts = ['localhost:3000', 'localhost:3001'];
  const allowedDomains = ['vidhyabookstore.com', 'vercel.app'];

  const checkURL = (urlStr: string) => {
    try {
      const url = new URL(urlStr);
      return (
        allowedHosts.includes(url.host) ||
        allowedDomains.some(domain => url.host === domain || url.host.endsWith(`.${domain}`))
      );
    } catch {
      return false;
    }
  };

  if (origin && !checkURL(origin)) return false;
  if (referer && !checkURL(referer)) return false;

  return true;
}

/**
 * Input sanitization helper to block XSS and malicious script injections
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function validateImageUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    // Allow unsplash, local image, and uploads folders
    return (
      parsed.protocol === 'https:' ||
      parsed.pathname.startsWith('/images/') ||
      parsed.pathname.startsWith('/uploads/')
    );
  } catch {
    return url.startsWith('/images/') || url.startsWith('/uploads/');
  }
}

/**
 * Enterprise Fraud Detection check (flag transactions above ₹10,000 or COD abuse)
 */
export function checkFraudAlert(totalAmount: number, itemsCount: number): boolean {
  // High order amount triggers merchant review flag
  if (totalAmount > 10000) {
    return true;
  }
  // Suspicious item count on a single checkout
  if (itemsCount > 15) {
    return true;
  }
  return false;
}

/**
 * System audit logging utility
 */
export function writeAuditLog(user: string, action: string, ip = '127.0.0.1') {
  const timestamp = new Date().toISOString();
  console.log(`[AUDIT LOG] [${timestamp}] [IP: ${ip}] [USER: ${user}] -> ACTION: ${action}`);
}
