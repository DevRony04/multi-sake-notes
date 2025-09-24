import { verify } from './jwt';
import { getTenantBySlug, getUserByEmail } from './store';

const ALLOWED_ORIGIN = process.env.CORS_ORIGIN || '*';

export function withCors(res: any) {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export function sendJson(res: any, status: number, body: unknown) {
  withCors(res);
  res.status(status).json(body);
}

export function method(req: any): string {
  return (req.method || 'GET').toUpperCase();
}

export function parseAuth(req: any) {
  const auth = req.headers?.['authorization'] || req.headers?.['Authorization'];
  if (!auth || typeof auth !== 'string') return null;
  const [scheme, token] = auth.split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  try {
    const payload = verify(token) as { email?: string; tenantSlug?: string };
    const user = payload.email ? getUserByEmail(payload.email) : null;
    const tenant = payload.tenantSlug ? getTenantBySlug(payload.tenantSlug) : null;
    if (!user || !tenant) return null;
    return { user, tenant, tokenPayload: payload };
  } catch (e) {
    return null;
  }
}

export function requireAuth(req: any, res: any) {
  const ctx = parseAuth(req);
  if (!ctx) {
    sendJson(res, 401, { error: 'Unauthorized' });
    return null;
  }
  return ctx;
}

export function requireAdmin(req: any, res: any) {
  const ctx = requireAuth(req, res);
  if (!ctx) return null;
  if (ctx.user.role !== 'admin') {
    sendJson(res, 403, { error: 'Forbidden: admin role required' });
    return null;
  }
  return ctx;
}


