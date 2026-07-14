import fs from 'fs';
import path from 'path';

const SESSIONS_FILE = path.join(process.cwd(), 'src/data/sessions.json');

export interface SessionRecord {
  token: string;
  email: string;
  createdAt: number;
  lastActiveAt: number;
  userAgent: string;
}

function ensureSessionsFileExists(): SessionRecord[] {
  const dir = path.dirname(SESSIONS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(SESSIONS_FILE)) {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify([], null, 2), 'utf-8');
    return [];
  }
  try {
    const data = fs.readFileSync(SESSIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeSessions(sessions: SessionRecord[]) {
  try {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing sessions:', err);
  }
}

export function registerSession(email: string, token: string, userAgent: string) {
  const sessions = ensureSessionsFileExists();
  const now = Date.now();
  const newSession: SessionRecord = {
    token,
    email,
    createdAt: now,
    lastActiveAt: now,
    userAgent
  };
  sessions.push(newSession);
  writeSessions(sessions);
}

export function updateSessionActivity(token: string): boolean {
  const sessions = ensureSessionsFileExists();
  const index = sessions.findIndex(s => s.token === token);
  if (index === -1) return false;

  const now = Date.now();
  const IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes
  const ABSOLUTE_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours

  const session = sessions[index];

  // Check absolute expiration
  if (now - session.createdAt > ABSOLUTE_TIMEOUT) {
    sessions.splice(index, 1); // remove
    writeSessions(sessions);
    return false;
  }

  // Check idle expiration
  if (now - session.lastActiveAt > IDLE_TIMEOUT) {
    sessions.splice(index, 1); // remove
    writeSessions(sessions);
    return false;
  }

  // Session is active and valid, update activity
  session.lastActiveAt = now;
  writeSessions(sessions);
  return true;
}

export function isSessionValid(token: string): boolean {
  return updateSessionActivity(token);
}

export function rotateSession(oldToken: string, newToken: string) {
  const sessions = ensureSessionsFileExists();
  const index = sessions.findIndex(s => s.token === oldToken);
  if (index !== -1) {
    sessions[index].token = newToken;
    sessions[index].lastActiveAt = Date.now();
    writeSessions(sessions);
  }
}

export function invalidateSession(token: string) {
  const sessions = ensureSessionsFileExists();
  const filtered = sessions.filter(s => s.token !== token);
  writeSessions(filtered);
}

export function forceLogoutAllDevices(email: string) {
  const sessions = ensureSessionsFileExists();
  const filtered = sessions.filter(s => s.email.toLowerCase() !== email.toLowerCase());
  writeSessions(filtered);
}
