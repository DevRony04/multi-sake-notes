import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText } from 'lucide-react';

interface EmptyStateProps {
  onCreateNote: () => void;
  canCreateNote: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onCreateNote,
  canCreateNote,
}) => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center">
          <FileText className="w-12 h-12 text-muted-foreground" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">No notes yet</h3>
          <p className="text-foreground-muted">
            {canCreateNote 
              ? "Get started by creating your first note."
              : "Your note limit has been reached. Upgrade to Pro to create more notes."
            }
          </p>
        </div>

        {canCreateNote && (
          <Button 
            onClick={onCreateNote}
            size="lg"
            className="shadow-brand"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Create your first note
          </Button>
        )}
      </div>
    </div>
  );
};