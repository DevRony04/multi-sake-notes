import { sign } from './_lib/jwt';
import { getUserByEmail, getTenantBySlug, getTenantStats } from './_lib/store';
import { withCors, sendJson, method } from './_lib/http';

export default async function handler(req: any, res: any) {
  withCors(res);
  if (method(req) === 'OPTIONS') return res.status(200).end();
  if (method(req) !== 'POST') return sendJson(res, 405, { error: 'Method Not Allowed' });

  try {
    const { email, password } = req.body || {};
    if (!email || !password) return sendJson(res, 400, { error: 'email and password required' });
    if (password !== 'password') return sendJson(res, 401, { error: 'Invalid credentials' });

    const user = getUserByEmail(email);
    if (!user) return sendJson(res, 401, { error: 'Invalid credentials' });
    const tenant = getTenantBySlug(user.tenantSlug);
    if (!tenant) return sendJson(res, 401, { error: 'Invalid tenant' });

    const token = sign({ email: user.email, role: user.role, tenantSlug: tenant.slug });
    const stats = getTenantStats(tenant.slug);
    return sendJson(res, 200, {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        tenant: {
          id: tenant.id,
          name: tenant.name,
          slug: tenant.slug,
          plan: tenant.plan,
          notesCount: stats.notesCount,
          notesLimit: stats.notesLimit,
        },
      },
    });
  } catch (e) {
    return sendJson(res, 500, { error: 'Internal Server Error' });
  }
}

module.exports = handler;

