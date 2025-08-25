import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const SESSION_COOKIE_NAME = 'democracy-tools-session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export interface LoginCredentials {
  username: string;
  password: string;
}

export function validateCredentials(credentials: LoginCredentials): boolean {
  const expectedUsername = process.env.AUTH_USERNAME;
  const expectedPassword = process.env.AUTH_PASSWORD;
  
  if (!expectedUsername || !expectedPassword) {
    console.error('Authentication credentials not configured in environment variables');
    return false;
  }
  
  return credentials.username === expectedUsername && credentials.password === expectedPassword;
}

export function createSession(): string {
  const sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
  const expiresAt = Date.now() + SESSION_DURATION;
  return JSON.stringify({ sessionId, expiresAt });
}

export function validateSession(sessionData: string): boolean {
  try {
    const session = JSON.parse(sessionData);
    return session.expiresAt > Date.now();
  } catch {
    return false;
  }
}

export function getSessionFromCookies(): string | null {
  const cookieStore = cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value || null;
}

export function isAuthenticated(): boolean {
  const sessionData = getSessionFromCookies();
  if (!sessionData) return false;
  return validateSession(sessionData);
}

export function requireAuth(): void {
  if (!isAuthenticated()) {
    redirect('/login');
  }
}

export function clearSession(): void {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
