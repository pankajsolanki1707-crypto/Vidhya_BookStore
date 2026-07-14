import fs from 'fs';
import path from 'path';
import { verifyToken } from './security';

const STAFF_FILE = path.join(process.cwd(), 'src/data/staff.json');

export interface Staff {
  email: string;
  name: string;
  role: string;
  passwordHash: string;
}

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  'Owner': ['all'],
  'Super Admin': ['all'],
  'Inventory Manager': ['tab_dashboard', 'tab_inventory', 'tab_backup', 'action_inventory_write', 'action_ledger_write'],
  'Sales Manager': ['tab_dashboard', 'tab_orders', 'tab_marketing', 'action_orders_write', 'action_marketing_write'],
  'Delivery Manager': ['tab_orders', 'action_delivery_update'],
  'Content Manager': ['tab_content', 'tab_seo', 'action_content_write', 'action_seo_write'],
  'Marketing Manager': ['tab_marketing', 'tab_seo', 'action_marketing_write', 'action_seo_write'],
  'Customer Support': ['tab_dashboard', 'tab_orders', 'action_support_read'],
  'Viewer': ['tab_dashboard', 'action_read_only']
};

export function getStaffList(): Staff[] {
  try {
    if (!fs.existsSync(STAFF_FILE)) return [];
    const data = fs.readFileSync(STAFF_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading staff database:', err);
    return [];
  }
}

export function saveStaffList(staff: Staff[]): boolean {
  try {
    fs.writeFileSync(STAFF_FILE, JSON.stringify(staff, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing staff database:', err);
    return false;
  }
}

export function verifyRolePermission(token: string | null, requiredPermission: string): boolean {
  if (!token) return false;
  const payload = verifyToken(token);
  if (!payload || !payload.role) return false;

  const role = payload.role;
  const permissions = ROLE_PERMISSIONS[role] || [];
  
  if (permissions.includes('all')) return true;
  return permissions.includes(requiredPermission);
}

export function hasTabAccess(role: string, tab: string): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  if (permissions.includes('all')) return true;
  return permissions.includes(`tab_${tab}`);
}
