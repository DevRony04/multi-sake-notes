import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, LogOut, Crown, Users } from 'lucide-react';

interface NotesHeaderProps {
  user: {
    email: string;
    role: 'admin' | 'member';
    tenant: {
      name: string;
      plan: 'free' | 'pro';
      notesCount: number;
      notesLimit?: number;
    };
  };
  onCreateNote: () => void;
  onLogout: () => void;
  onUpgrade?: () => void;
  canCreateNote: boolean;
}

export const NotesHeader: React.FC<NotesHeaderProps> = ({
  user,
  onCreateNote,
  onLogout,
  onUpgrade,
  canCreateNote,
}) => {
  const isAtLimit = user.tenant.plan === 'free' && user.tenant.notesCount >= (user.tenant.notesLimit || 3);

  return (
    <div className="border-b border-border bg-card">
      <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo and Tenant Info */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-primary rounded-lg flex items-center justify-center shadow-md">
              <div className="text-base md:text-lg font-bold text-primary-foreground">N</div>
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold gradient-text">NotesApp</h1>
              <div className="flex items-center gap-2 text-xs md:text-sm text-foreground-muted">
                  <span>{user.tenant.name}</span>
                  <Badge 
                    variant={user.tenant.plan === 'pro' ? 'default' : 'secondary'}
                    className="text-[10px] md:text-xs"
                  >
                    {user.tenant.plan === 'pro' ? (
                      <>
                        <Crown className="w-3 h-3 mr-1" />
                        Pro
                      </>
                    ) : (
                      'Free'
                    )}
                  </Badge>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center md:justify-end gap-2 md:gap-3 flex-wrap">
            {/* Notes Count */}
            <div className="text-xs md:text-sm text-foreground-muted order-3 md:order-none w-full md:w-auto">
              {user.tenant.plan === 'free' ? (
                <span className={isAtLimit ? 'text-warning font-medium' : ''}>
                  {user.tenant.notesCount}/{user.tenant.notesLimit || 3} notes
                </span>
              ) : (
                <span>{user.tenant.notesCount} notes</span>
              )}
            </div>

            {/* Upgrade Button (for Free plan admins) */}
            {user.tenant.plan === 'free' && user.role === 'admin' && onUpgrade && (
              <Button
                variant="outline"
                size="sm"
                onClick={onUpgrade}
                className="border-warning text-warning hover:bg-warning hover:text-warning-foreground"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </Button>
            )}

            {/* Create Note Button */}
            <Button
              onClick={onCreateNote}
              disabled={!canCreateNote}
              size="sm"
              className="shadow-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </Button>

            {/* User Menu */}
            <div className="flex items-center gap-2 md:pl-3 md:border-l md:border-border">
              <div className="text-right">
                <div className="text-xs md:text-sm font-medium max-w-[160px] truncate">{user.email}</div>
                <div className="flex items-center text-[11px] md:text-xs text-foreground-muted">
                  {user.role === 'admin' ? (
                    <>
                      <Crown className="w-3 h-3 mr-1" />
                      Admin
                    </>
                  ) : (
                    <>
                      <Users className="w-3 h-3 mr-1" />
                      Member
                    </>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-foreground-muted hover:text-destructive"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Warning for Free plan at limit */}
        {isAtLimit && (
          <div className="mt-3 md:mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div className="text-xs md:text-sm text-warning">
                <span className="font-medium">Note limit reached!</span>
                {user.role === 'admin' ? (
                  <span className="ml-2">Upgrade to Pro for unlimited notes.</span>
                ) : (
                  <span className="ml-2">Ask your admin to upgrade to Pro for unlimited notes.</span>
                )}
              </div>
              {user.role === 'admin' && onUpgrade && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onUpgrade}
                  className="border-warning text-warning hover:bg-warning hover:text-warning-foreground"
                >
                  Upgrade Now
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};