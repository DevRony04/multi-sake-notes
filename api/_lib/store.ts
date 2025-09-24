import crypto from 'crypto';

export type Plan = 'free' | 'pro';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: Plan;
  notesLimit?: number;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'member';
  tenantSlug: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: { email: string };
}

export const TENANTS: Record<string, Tenant> = {
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

export const USERS: Record<string, User> = {
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

export const NOTES: Record<string, Note[]> = {
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

export function getTenantBySlug(slug: string): Tenant | null {
  return TENANTS[slug] || null;
}

export function getUserByEmail(email: string): User | null {
  return USERS[email] || null;
}

export function listNotes(tenantSlug: string): Note[] {
  return NOTES[tenantSlug] ? [...NOTES[tenantSlug]] : [];
}

export function createNote(tenantSlug: string, { title, content, authorEmail }: { title: string; content: string; authorEmail: string; }): Note {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const newNote: Note = { id, title, content, createdAt: now, updatedAt: now, author: { email: authorEmail } };
  if (!NOTES[tenantSlug]) NOTES[tenantSlug] = [];
  NOTES[tenantSlug].push(newNote);
  return newNote;
}

export function getNote(tenantSlug: string, id: string): Note | null {
  return (NOTES[tenantSlug] || []).find((n) => n.id === id) || null;
}

export function updateNote(tenantSlug: string, id: string, { title, content }: { title?: string; content?: string; }): Note | null {
  const note = getNote(tenantSlug, id);
  if (!note) return null;
  if (typeof title === 'string') note.title = title;
  if (typeof content === 'string') note.content = content;
  note.updatedAt = new Date().toISOString();
  return note;
}

export function deleteNote(tenantSlug: string, id: string): boolean {
  const list = NOTES[tenantSlug] || [];
  const idx = list.findIndex((n) => n.id === id);
  if (idx >= 0) {
    list.splice(idx, 1);
    return true;
  }
  return false;
}

export function getTenantStats(tenantSlug: string): { notesCount: number; notesLimit?: number } {
  const tenant = getTenantBySlug(tenantSlug);
  const notesCount = (NOTES[tenantSlug] || []).length;
  const notesLimit = tenant && tenant.plan === 'free' ? tenant.notesLimit || 3 : undefined;
  return { notesCount, notesLimit };
}

export function upgradeTenantToPro(slug: string): Tenant | null {
  const tenant = getTenantBySlug(slug);
  if (!tenant) return null;
  tenant.plan = 'pro';
  delete tenant.notesLimit;
  return tenant;
}


