import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/security';
import { getLoginHistory, checkLockout } from '@/lib/auth_security';
import { forceLogoutAllDevices, invalidateSession } from '@/lib/session_manager';
import { writeAuditRecord } from '@/lib/audit_logs';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = verifyToken(authHeader);
  if (!payload) {
    return NextResponse.json({ error: 'Session invalid or expired' }, { status: 401 });
  }

  try {
    const history = getLoginHistory();
    // Filter history for current logged-in user
    const userHistory = history.filter(h => h.email.toLowerCase() === payload.email.toLowerCase()).slice(0, 10);
    return NextResponse.json(userHistory);
  } catch (error) {
    console.error('Error fetching session history:', error);
    return NextResponse.json({ error: 'Failed to retrieve sessions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = verifyToken(authHeader);
  if (!payload) {
    return NextResponse.json({ error: 'Session invalid or expired' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action } = body;

    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

    if (action === 'logout_all') {
      forceLogoutAllDevices(payload.email);
      writeAuditRecord({ 
        adminName: payload.name, 
        action: 'FORCE LOGOUT FROM ALL DEVICES', 
        ip 
      });
      return NextResponse.json({ success: true, message: 'Successfully logged out from all devices.' });
    } else if (action === 'logout_current') {
      invalidateSession(authHeader);
      writeAuditRecord({ 
        adminName: payload.name, 
        action: 'LOGOUT', 
        ip 
      });
      
      const response = NextResponse.json({ success: true });
      // Clear cookie
      response.cookies.delete('vbs_admin_session');
      return response;
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error handling session action:', error);
    return NextResponse.json({ error: 'Failed to execute session action' }, { status: 500 });
  }
}
