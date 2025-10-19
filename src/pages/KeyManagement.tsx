import { useQuery } from '@tanstack/react-query';
import { mockApi } from '@/lib/mockApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Key, Clock, Shield, Loader2 } from 'lucide-react';

export default function KeyManagement() {
  const { data: keyPairs = [], isLoading } = useQuery({
    queryKey: ['keys'],
    queryFn: mockApi.getKeyPairs
  });

  const getDaysUntilExpiry = (expiresAt: string) => {
    const days = Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Key Management</h1>
        <p className="text-muted-foreground">Manage encryption keys for secure transmissions</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-6">
          {keyPairs.map((key) => {
            const daysUntilExpiry = getDaysUntilExpiry(key.expiresAt);
            const isExpiringSoon = daysUntilExpiry < 30;

            return (
              <Card key={key.id} className={isExpiringSoon ? 'border-destructive/50' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5 text-primary" />
                        {key.name}
                      </CardTitle>
                      <CardDescription>
                        Created: {new Date(key.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant={isExpiringSoon ? 'destructive' : 'default'}>
                      {isExpiringSoon ? 'Expiring Soon' : 'Active'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Public Key:</span>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-md border font-mono text-xs break-all">
                      {key.publicKey}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Expires:</span>
                      <span className={isExpiringSoon ? 'text-destructive font-medium' : 'text-muted-foreground'}>
                        {new Date(key.expiresAt).toLocaleDateString()} ({daysUntilExpiry} days)
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="py-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Automatic Key Rotation</p>
              <p className="text-xs text-muted-foreground">
                Keys are automatically rotated every 365 days for maximum security. You will be notified 30 days before expiration.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
