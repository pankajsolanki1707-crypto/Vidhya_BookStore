import fs from 'fs';
import path from 'path';

const AUDIT_FILE = path.join(process.cwd(), 'src/data/audit_logs.json');

export interface AuditRecord {
  id: string;
  timestamp: string;
  adminName: string;
  ip: string;
  browser: string;
  action: string;
  oldValue: string;
  newValue: string;
}

function ensureAuditFileExists(): AuditRecord[] {
  const dir = path.dirname(AUDIT_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(AUDIT_FILE)) {
    fs.writeFileSync(AUDIT_FILE, JSON.stringify([], null, 2), 'utf-8');
    return [];
  }
  try {
    const data = fs.readFileSync(AUDIT_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function getAuditRecords(): AuditRecord[] {
  return ensureAuditFileExists();
}

export function writeAuditRecord(params: {
  adminName: string;
  action: string;
  oldValue?: any;
  newValue?: any;
  ip?: string;
  userAgent?: string;
}) {
  const records = ensureAuditFileExists();
  
  let browser = 'Unknown';
  if (params.userAgent) {
    const ua = params.userAgent;
    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
    else if (ua.includes('Edge')) browser = 'Edge';
  }

  const formatValue = (val: any): string => {
    if (val === undefined || val === null) return '';
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
  };

  const record: AuditRecord = {
    id: 'AUD-' + Date.now().toString() + '-' + Math.floor(Math.random() * 1000),
    timestamp: new Date().toISOString(),
    adminName: params.adminName || 'System',
    ip: params.ip || '127.0.0.1',
    browser,
    action: params.action,
    oldValue: formatValue(params.oldValue),
    newValue: formatValue(params.newValue)
  };

  records.unshift(record); // Prepend to show latest first
  
  // Keep only last 1000 records for performance
  const trimmed = records.slice(0, 1000);
  
  try {
    fs.writeFileSync(AUDIT_FILE, JSON.stringify(trimmed, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing audit log:', err);
  }
}
