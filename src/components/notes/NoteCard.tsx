import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit3, Trash2, MoreVertical, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  currentUserEmail: string;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onDelete,
  currentUserEmail,
}) => {
  const isOwner = note.author?.email === currentUserEmail;
  const timeAgo = formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true });

  return (
    <Card className="card-interactive group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base md:text-lg text-card-foreground truncate group-hover:text-primary transition-colors">
              {note.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-[10px] md:text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                {timeAgo}
              </Badge>
              {note.author && (
                <Badge variant="secondary" className="text-[10px] md:text-xs">
                  {note.author.email}
                </Badge>
              )}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 md:h-9 md:w-9 transition-opacity focus:opacity-100"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(note)}>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(note.id)}
                className="text-destructive focus:text-destructive"
                disabled={!isOwner}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-foreground-muted text-sm leading-relaxed line-clamp-3">
          {note.content || 'No content'}
        </p>
      </CardContent>
    </Card>
  );
};