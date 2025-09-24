import { listNotes, createNote, getNote, updateNote, deleteNote, getTenantStats } from './_lib/store';
import { withCors, sendJson, method, requireAuth } from './_lib/http';

export default async function handler(req: any, res: any) {
  withCors(res);
  if (method(req) === 'OPTIONS') return res.status(200).end();

  const ctx = requireAuth(req, res);
  if (!ctx) return; // response already sent

  const tenantSlug = ctx.tenant.slug;
  const httpMethod = method(req);

  try {
    if (httpMethod === 'GET') {
      return sendJson(res, 200, listNotes(tenantSlug));
    }
    if (httpMethod === 'POST') {
      const stats = getTenantStats(tenantSlug);
      if (ctx.tenant.plan === 'free' && typeof stats.notesLimit === 'number' && stats.notesCount >= stats.notesLimit) {
        return sendJson(res, 402, { error: 'Note limit reached. Upgrade to Pro.' });
      }
      const { title, content } = req.body || {};
      if (!title || !content) return sendJson(res, 400, { error: 'title and content required' });
      const note = createNote(tenantSlug, { title, content, authorEmail: ctx.user.email });
      return sendJson(res, 201, note);
    }

    // For PUT/DELETE on /api/notes?id=noteId (Vercel single file route)
    const id = req.query && req.query.id ? String(req.query.id) : null;
    if ((httpMethod === 'GET' || httpMethod === 'PUT' || httpMethod === 'DELETE') && id) {
      const existing = getNote(tenantSlug, id);
      if (!existing) return sendJson(res, 404, { error: 'Note not found' });
      if (httpMethod === 'GET') return sendJson(res, 200, existing);
      if (httpMethod === 'PUT') {
        const { title, content } = req.body || {};
        const updated = updateNote(tenantSlug, id, { title, content });
        return sendJson(res, 200, updated);
      }
      if (httpMethod === 'DELETE') {
        deleteNote(tenantSlug, id);
        return sendJson(res, 204, {});
      }
    }

    return sendJson(res, 405, { error: 'Method Not Allowed' });
  } catch (e) {
    return sendJson(res, 500, { error: 'Internal Server Error' });
  }
}

module.exports = handler;

