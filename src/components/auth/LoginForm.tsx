import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, isLoading, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogin(email, password);
  };

  // Predefined test accounts for easy access
  const testAccounts = [
    { email: 'admin@acme.test', label: 'Acme Admin', tenant: 'Acme' },
    { email: 'user@acme.test', label: 'Acme Member', tenant: 'Acme' },
    { email: 'admin@globex.test', label: 'Globex Admin', tenant: 'Globex' },
    { email: 'user@globex.test', label: 'Globex Member', tenant: 'Globex' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background-secondary to-background-muted p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-brand">
            <div className="text-2xl font-bold text-primary-foreground">N</div>
          </div>
          <h1 className="text-3xl font-bold gradient-text">NotesApp</h1>
          <p className="text-foreground-muted">Multi-tenant SaaS Notes Platform</p>
        </div>

        {/* Login Form */}
        <Card className="card-interactive">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold">Welcome back</CardTitle>
            <CardDescription>
              Enter your credentials to access your notes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@acme.test"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="focus-ring"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="focus-ring"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>

            {/* Test Accounts */}
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-foreground-muted mb-3 text-center">Test Accounts (password: password)</p>
              <div className="grid grid-cols-2 gap-2">
                {testAccounts.map((account) => (
                  <Button
                    key={account.email}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEmail(account.email);
                      setPassword('password');
                    }}
                    disabled={isLoading}
                    className="text-xs h-auto py-2 px-3"
                  >
                    <div className="text-left">
                      <div className="font-medium">{account.label}</div>
                      <div className="text-muted-foreground">{account.tenant}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-foreground-muted text-blue-800">
        ©.2025 Multi-Tenant-Sass -- All rights reserved.
        </div>
      </div>
    </div>
  );
};