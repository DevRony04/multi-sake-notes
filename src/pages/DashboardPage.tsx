import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNotes } from '@/hooks/useNotes';
import { NotesHeader } from '@/components/notes/NotesHeader';
import { NotesGrid } from '@/components/notes/NotesGrid';
import { NoteDialog } from '@/components/notes/NoteDialog';
import { useToast } from '@/hooks/use-toast';

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

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { notes, isLoading, createNote, updateNote, deleteNote, upgradeToPro, canCreateNote } = useNotes();
  const { toast } = useToast();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>();
  const [dialogLoading, setDialogLoading] = useState(false);

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleCreateNote = () => {
    if (!canCreateNote) {
      toast({
        title: "Cannot create note",
        description: "You've reached your note limit. Upgrade to Pro for unlimited notes.",
        variant: "destructive",
      });
      return;
    }
    setEditingNote(undefined);
    setDialogOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setDialogOpen(true);
  };

  const handleSaveNote = async (data: { title: string; content: string }) => {
    setDialogLoading(true);
    try {
      if (editingNote) {
        await updateNote(editingNote.id, data);
        toast({
          title: "Note updated",
          description: "Your note has been successfully updated.",
        });
      } else {
        await createNote(data);
        toast({
          title: "Note created",
          description: "Your new note has been created successfully.",
        });
      }
      setDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setDialogLoading(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(id);
      toast({
        title: "Note deleted",
        description: "Your note has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete note.",
        variant: "destructive",
      });
    }
  };

  const handleUpgrade = async () => {
    try {
      await upgradeToPro();
      toast({
        title: "Upgraded to Pro!",
        description: "Your tenant has been upgraded to Pro. You now have unlimited notes!",
      });
    } catch (error) {
      toast({
        title: "Upgrade failed",
        description: error instanceof Error ? error.message : "Failed to upgrade subscription.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NotesHeader
        user={user}
        onCreateNote={handleCreateNote}
        onLogout={logout}
        onUpgrade={user.role === 'admin' ? handleUpgrade : undefined}
        canCreateNote={canCreateNote}
      />

      <NotesGrid
        notes={notes}
        onEditNote={handleEditNote}
        onDeleteNote={handleDeleteNote}
        onCreateNote={handleCreateNote}
        currentUserEmail={user.email}
        canCreateNote={canCreateNote}
        isLoading={isLoading}
      />

      <NoteDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveNote}
        note={editingNote}
        isLoading={dialogLoading}
        mode={editingNote ? 'edit' : 'create'}
      />
    </div>
  );
};