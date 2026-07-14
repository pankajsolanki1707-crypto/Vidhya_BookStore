import fs from 'fs';
import path from 'path';

const SECURITY_FILE = path.join(process.cwd(), 'src/data/auth_security.json');

interface LockoutRecord {
  failedAttempts: number;
  lockedUntil: number;
}

interface OtpRecord {
  code: string;
  expiresAt: number;
  resendAllowedAfter: number;
}

interface LoginLog {
  id: string;
  email: string;
  ip: string;
  browser: string;
  os: string;
  location: string;
  loginTime: string;
  logoutTime: string | null;
  failedAttempts: number;
  success: boolean;
}

interface SecurityData {
  lockouts: Record<string, LockoutRecord>;
  otps: Record<string, OtpRecord>;
  history: LoginLog[];
}

function ensureDataExists(): SecurityData {
  const dir = path.dirname(SECURITY_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(SECURITY_FILE)) {
    const defaultData: SecurityData = { lockouts: {}, otps: {}, history: [] };
    fs.writeFileSync(SECURITY_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
    return defaultData;
  }
  try {
    const data = fs.readFileSync(SECURITY_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    const defaultData: SecurityData = { lockouts: {}, otps: {}, history: [] };
    return defaultData;
  }
}

function writeData(data: SecurityData) {
  try {
    fs.writeFileSync(SECURITY_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing security data:', err);
  }
}

export function checkLockout(email: string): { isLocked: boolean; remainingTime: number } {
  const data = ensureDataExists();
  const record = data.lockouts[email];
  if (!record) return { isLocked: false, remainingTime: 0 };

  const now = Date.now();
  if (record.lockedUntil > now) {
    return { isLocked: true, remainingTime: Math.ceil((record.lockedUntil - now) / 1000) };
  }

  // Lock has expired, reset attempts
  if (record.failedAttempts >= 5) {
    record.failedAttempts = 0;
    record.lockedUntil = 0;
    writeData(data);
  }

  return { isLocked: false, remainingTime: 0 };
}

export function recordFailedAttempt(email: string) {
  const data = ensureDataExists();
  if (!data.lockouts[email]) {
    data.lockouts[email] = { failedAttempts: 0, lockedUntil: 0 };
  }
  
  const record = data.lockouts[email];
  record.failedAttempts += 1;
  
  if (record.failedAttempts >= 5) {
    record.lockedUntil = Date.now() + 15 * 60 * 1000; // 15 mins lock
  }
  writeData(data);
}

export function resetAttempts(email: string) {
  const data = ensureDataExists();
  if (data.lockouts[email]) {
    data.lockouts[email] = { failedAttempts: 0, lockedUntil: 0 };
    writeData(data);
  }
}

export function generatePersistentOTP(email: string): string {
  const data = ensureDataExists();
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes expiration
  const resendAllowedAfter = Date.now() + 60 * 1000; // 60s cooldown

  data.otps[email] = { code, expiresAt, resendAllowedAfter };
  writeData(data);
  return code;
}

export function verifyPersistentOTP(email: string, code: string): boolean {
  const data = ensureDataExists();
  const record = data.otps[email];
  if (!record) return false;

  if (Date.now() > record.expiresAt) {
    delete data.otps[email];
    writeData(data);
    return false;
  }

  const matches = record.code === code;
  if (matches) {
    delete data.otps[email]; // OTP cannot be reused
    writeData(data);
  }
  return matches;
}

export function logLoginHistory(params: {
  email: string;
  ip: string;
  userAgent: string;
  success: boolean;
  failedAttempts: number;
}) {
  const data = ensureDataExists();
  
  // Parse UserAgent basic info
  let browser = 'Unknown';
  let os = 'Unknown';
  const ua = params.userAgent;
  if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Edge')) browser = 'Edge';

  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Macintosh')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone')) os = 'iOS';

  // Geolocation simulation (since Indore is local service area)
  const location = params.ip === '127.0.0.1' || params.ip === '::1' ? 'Indore (Localhost)' : 'Indore, MP';

  const newLog: LoginLog = {
    id: 'LOG-' + Date.now().toString() + '-' + Math.floor(Math.random() * 1000),
    email: params.email,
    ip: params.ip,
    browser,
    os,
    location,
    loginTime: new Date().toISOString(),
    logoutTime: null,
    failedAttempts: params.failedAttempts,
    success: params.success
  };

  data.history.unshift(newLog); // Prepend so recent is first
  writeData(data);
  return newLog.id;
}

export function logLogout(logId: string) {
  const data = ensureDataExists();
  const index = data.history.findIndex(h => h.id === logId);
  if (index !== -1) {
    data.history[index].logoutTime = new Date().toISOString();
    writeData(data);
  }
}

export function getLoginHistory(): LoginLog[] {
  const data = ensureDataExists();
  return data.history;
}
