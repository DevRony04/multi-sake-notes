import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author?: {
    email: string;
  };
}

// Mock notes data - Replace with Supabase integration
const mockNotes: Record<string, Note[]> = {
  'acme': [
    {
      id: '1',
      title: 'Welcome to Acme Notes',
      content: 'This is your first note in the Acme tenant. You can create, edit, and delete notes here.',
      createdAt: new Date('2024-01-15T10:00:00Z'),
      updatedAt: new Date('2024-01-15T10:00:00Z'),
      author: { email: 'admin@acme.test' },
    },
    {
      id: '2',
      title: 'Team Meeting Notes',
      content: 'Discussion points for the weekly team meeting. We covered project updates and upcoming deadlines.',
      createdAt: new Date('2024-01-16T14:30:00Z'),
      updatedAt: new Date('2024-01-16T14:30:00Z'),
      author: { email: 'user@acme.test' },
    },
  ],
  'globex': [
    {
      id: '3',
      title: 'Globex Strategy Document',
      content: 'Our comprehensive strategy for Q2 includes expanding into new markets and improving customer satisfaction.',
      createdAt: new Date('2024-01-10T09:00:00Z'),
      updatedAt: new Date('2024-01-10T09:00:00Z'),
      author: { email: 'admin@globex.test' },
    },
    {
      id: '4',
      title: 'Product Roadmap',
      content: 'Key features planned for the next release cycle, including improved user interface and performance optimizations.',
      createdAt: new Date('2024-01-12T11:15:00Z'),
      updatedAt: new Date('2024-01-12T11:15:00Z'),
      author: { email: 'user@globex.test' },
    },
    {
      id: '5',
      title: 'Budget Planning',
      content: 'Financial projections and budget allocation for the upcoming quarter.',
      createdAt: new Date('2024-01-14T16:45:00Z'),
      updatedAt: new Date('2024-01-14T16:45:00Z'),
      author: { email: 'admin@globex.test' },
    },
  ],
};

export const useNotes = () => {
  const { user, updateTenant } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load notes for current tenant
  useEffect(() => {
    if (user?.tenant?.slug) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        const tenantNotes = mockNotes[user.tenant.slug] || [];
        setNotes(tenantNotes);
        setIsLoading(false);
      }, 500);
    }
  }, [user?.tenant?.slug]);

  const createNote = async (data: { title: string; content: string }) => {
    if (!user) throw new Error('User not authenticated');

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      const newNote: Note = {
        id: Date.now().toString(),
        title: data.title,
        content: data.content,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: { email: user.email },
      };

      // Update local state
      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      
      // Update mock data
      mockNotes[user.tenant.slug] = updatedNotes;

      // Update tenant notes count
      updateTenant({ notesCount: updatedNotes.length });
    } finally {
      setIsLoading(false);
    }
  };

  const updateNote = async (id: string, data: { title: string; content: string }) => {
    if (!user) throw new Error('User not authenticated');

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));

      const updatedNotes = notes.map(note =>
        note.id === id
          ? { ...note, ...data, updatedAt: new Date() }
          : note
      );

      setNotes(updatedNotes);
      mockNotes[user.tenant.slug] = updatedNotes;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNote = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 400));

      const updatedNotes = notes.filter(note => note.id !== id);
      setNotes(updatedNotes);
      mockNotes[user.tenant.slug] = updatedNotes;

      // Update tenant notes count
      updateTenant({ notesCount: updatedNotes.length });
    } finally {
      setIsLoading(false);
    }
  };

  const upgradeToPro = async () => {
    if (!user || user.role !== 'admin') {
      throw new Error('Only admins can upgrade subscriptions');
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update tenant to Pro plan
      updateTenant({ 
        plan: 'pro', 
        notesLimit: undefined // Remove limit for Pro plan
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canCreateNote = user ? (
    user.tenant.plan === 'pro' || 
    notes.length < (user.tenant.notesLimit || 3)
  ) : false;

  return {
    notes,
    isLoading,
    createNote,
    updateNote,
    deleteNote,
    upgradeToPro,
    canCreateNote,
  };
};