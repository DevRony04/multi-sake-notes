const { verify } = require('./jwt');
const { getTenantBySlug, getUserByEmail } = require('./store');

const ALLOWED_ORIGIN = process.env.CORS_ORIGIN || '*';

function withCors(res) {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function sendJson(res, status, body) {
  withCors(res);
  res.status(status).json(body);
}

function method(req) {
  return (req.method || 'GET').toUpperCase();
}

function parseAuth(req) {
  const auth = req.headers['authorization'] || req.headers['Authorization'];
  if (!auth || typeof auth !== 'string') return null;
  const [scheme, token] = auth.split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  try {
    const payload = verify(token);
    // normalize user and tenant
    const user = getUserByEmail(payload.email);
    const tenant = getTenantBySlug(payload.tenantSlug);
    if (!user || !tenant) return null;
    return { user, tenant, tokenPayload: payload };
  } catch (e) {
    return null;
  }
}

function requireAuth(req, res) {
  const ctx = parseAuth(req);
  if (!ctx) {
    sendJson(res, 401, { error: 'Unauthorized' });
    return null;
  }
  return ctx;
}

function requireAdmin(req, res) {
  const ctx = requireAuth(req, res);
  if (!ctx) return null;
  if (ctx.user.role !== 'admin') {
    sendJson(res, 403, { error: 'Forbidden: admin role required' });
    return null;
  }
  return ctx;
}

module.exports = { withCors, sendJson, method, parseAuth, requireAuth, requireAdmin };


