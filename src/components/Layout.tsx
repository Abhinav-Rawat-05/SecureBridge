import { Link, useLocation } from 'react-router-dom';
import { Database, Lock, FileText, Send, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Sender', icon: Send },
    { path: '/receiver', label: 'Receiver', icon: Inbox },
    { path: '/schema', label: 'Schema Viewer', icon: Database },
    { path: '/keys', label: 'Key Management', icon: Lock },
    { path: '/audit', label: 'Audit Logs', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Secure DB Proxy
              </h1>
            </div>
            <nav className="flex gap-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-md transition-colors",
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-muted"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-8">
        {children}
      </main>

      <footer className="border-t bg-card mt-auto">
        <div className="container mx-auto px-6 py-4">
          <p className="text-center text-sm text-muted-foreground">
            Secure DB Proxy - Phase 2 (40% Complete)
          </p>
        </div>
      </footer>
    </div>
  );
};
