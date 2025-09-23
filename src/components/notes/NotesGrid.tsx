import React from 'react';
import { NoteCard } from './NoteCard';
import { EmptyState } from './EmptyState';

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

interface NotesGridProps {
  notes: Note[];
  onEditNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
  onCreateNote: () => void;
  currentUserEmail: string;
  canCreateNote: boolean;
  isLoading?: boolean;
}

export const NotesGrid: React.FC<NotesGridProps> = ({
  notes,
  onEditNote,
  onDeleteNote,
  onCreateNote,
  currentUserEmail,
  canCreateNote,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <EmptyState
        onCreateNote={onCreateNote}
        canCreateNote={canCreateNote}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onEdit={onEditNote}
            onDelete={onDeleteNote}
            currentUserEmail={currentUserEmail}
          />
        ))}
      </div>
    </div>
  );
};