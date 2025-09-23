const { upgradeTenantToPro, getTenantStats, getTenantBySlug } = require('../../_lib/store');
const { withCors, sendJson, method, requireAdmin, parseAuth } = require('../../_lib/http');

module.exports = async (req, res) => {
  withCors(res);
  if (method(req) === 'OPTIONS') return res.status(200).end();
  if (method(req) !== 'POST') return sendJson(res, 405, { error: 'Method Not Allowed' });

  const ctx = requireAdmin(req, res);
  if (!ctx) return;

  const slug = (req.query && req.query.slug) || (req.params && req.params.slug);
  if (!slug) return sendJson(res, 400, { error: 'slug is required' });

  // Ensure admin is upgrading their own tenant
  if (ctx.tenant.slug !== slug) return sendJson(res, 403, { error: 'Forbidden: cross-tenant access' });

  const upgraded = upgradeTenantToPro(slug);
  if (!upgraded) return sendJson(res, 404, { error: 'Tenant not found' });

  const stats = getTenantStats(slug);
  return sendJson(res, 200, {
    tenant: {
      id: upgraded.id,
      name: upgraded.name,
      slug: upgraded.slug,
      plan: upgraded.plan,
      notesCount: stats.notesCount,
      notesLimit: stats.notesLimit,
    },
  });
};


