const crypto = require('crypto');

const TENANTS = {
  acme: {
    id: 'acme',
    name: 'Acme Corporation',
    slug: 'acme',
    plan: 'free',
    notesLimit: 3,
  },
  globex: {
    id: 'globex',
    name: 'Globex Corporation',
    slug: 'globex',
    plan: 'pro',
  },
};

const USERS = {
  'admin@acme.test': {
    id: '1',
    email: 'admin@acme.test',
    role: 'admin',
    tenantSlug: 'acme',
  },
  'user@acme.test': {
    id: '2',
    email: 'user@acme.test',
    role: 'member',
    tenantSlug: 'acme',
  },
  'admin@globex.test': {
    id: '3',
    email: 'admin@globex.test',
    role: 'admin',
    tenantSlug: 'globex',
  },
  'user@globex.test': {
    id: '4',
    email: 'user@globex.test',
    role: 'member',
    tenantSlug: 'globex',
  },
};

const NOTES = {
  acme: [
    {
      id: '1',
      title: 'Welcome to Acme Notes',
      content:
        'This is your first note in the Acme tenant. You can create, edit, and delete notes here.',
      createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
      updatedAt: new Date('2024-01-15T10:00:00Z').toISOString(),
      author: { email: 'admin@acme.test' },
    },
    {
      id: '2',
      title: 'Team Meeting Notes',
      content:
        'Discussion points for the weekly team meeting. We covered project updates and upcoming deadlines.',
      createdAt: new Date('2024-01-16T14:30:00Z').toISOString(),
      updatedAt: new Date('2024-01-16T14:30:00Z').toISOString(),
      author: { email: 'user@acme.test' },
    },
  ],
  globex: [
    {
      id: '3',
      title: 'Globex Strategy Document',
      content:
        'Our comprehensive strategy for Q2 includes expanding into new markets and improving customer satisfaction.',
      createdAt: new Date('2024-01-10T09:00:00Z').toISOString(),
      updatedAt: new Date('2024-01-10T09:00:00Z').toISOString(),
      author: { email: 'admin@globex.test' },
    },
  ],
};

function getTenantBySlug(slug) {
  return TENANTS[slug] || null;
}

function getUserByEmail(email) {
  return USERS[email] || null;
}

function listNotes(tenantSlug) {
  return NOTES[tenantSlug] ? [...NOTES[tenantSlug]] : [];
}

function createNote(tenantSlug, { title, content, authorEmail }) {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const newNote = { id, title, content, createdAt: now, updatedAt: now, author: { email: authorEmail } };
  if (!NOTES[tenantSlug]) NOTES[tenantSlug] = [];
  NOTES[tenantSlug].push(newNote);
  return newNote;
}

function getNote(tenantSlug, id) {
  return (NOTES[tenantSlug] || []).find((n) => n.id === id) || null;
}

function updateNote(tenantSlug, id, { title, content }) {
  const note = getNote(tenantSlug, id);
  if (!note) return null;
  if (typeof title === 'string') note.title = title;
  if (typeof content === 'string') note.content = content;
  note.updatedAt = new Date().toISOString();
  return note;
}

function deleteNote(tenantSlug, id) {
  const list = NOTES[tenantSlug] || [];
  const idx = list.findIndex((n) => n.id === id);
  if (idx >= 0) {
    list.splice(idx, 1);
    return true;
  }
  return false;
}

function getTenantStats(tenantSlug) {
  const tenant = getTenantBySlug(tenantSlug);
  const notesCount = (NOTES[tenantSlug] || []).length;
  const notesLimit = tenant.plan === 'free' ? tenant.notesLimit || 3 : undefined;
  return { notesCount, notesLimit };
}

function upgradeTenantToPro(slug) {
  const tenant = getTenantBySlug(slug);
  if (!tenant) return null;
  tenant.plan = 'pro';
  delete tenant.notesLimit;
  return tenant;
}

module.exports = {
  TENANTS,
  USERS,
  NOTES,
  getTenantBySlug,
  getUserByEmail,
  listNotes,
  createNote,
  getNote,
  updateNote,
  deleteNote,
  getTenantStats,
  upgradeTenantToPro,
};


