import { NextRequest, NextResponse } from 'next/server';
import { getAuditRecords } from '@/lib/audit_logs';
import { verifyRolePermission } from '@/lib/rbac';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  
  if (!verifyRolePermission(authHeader, 'tab_backup')) {
    return NextResponse.json({ error: 'Unauthorized to view audit logs' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action')?.toLowerCase();
    const admin = searchParams.get('admin')?.toLowerCase();
    const search = searchParams.get('search')?.toLowerCase();

    let logs = getAuditRecords();

    if (action) {
      logs = logs.filter(l => l.action.toLowerCase().includes(action));
    }
    if (admin) {
      logs = logs.filter(l => l.adminName.toLowerCase().includes(admin));
    }
    if (search) {
      logs = logs.filter(l => 
        l.action.toLowerCase().includes(search) || 
        l.adminName.toLowerCase().includes(search) ||
        l.ip.toLowerCase().includes(search) ||
        l.oldValue.toLowerCase().includes(search) ||
        l.newValue.toLowerCase().includes(search)
      );
    }

    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json({ error: 'Failed to retrieve audit logs' }, { status: 500 });
  }
}
