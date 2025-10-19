import { useQuery } from '@tanstack/react-query';
import { mockApi } from '@/lib/mockApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, User, Clock, Activity, Loader2 } from 'lucide-react';

export default function AuditLogs() {
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: mockApi.getAuditLogs
  });

  const getActionBadge = (action: string) => {
    if (action.includes('ACCEPTED')) return 'default';
    if (action.includes('REJECTED')) return 'destructive';
    if (action.includes('CREATED')) return 'secondary';
    return 'outline';
  };

  const getActionIcon = (action: string) => {
    if (action.includes('KEY')) return '🔑';
    if (action.includes('TRANSMISSION')) return '📡';
    return '📋';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Audit Logs</h1>
        <p className="text-muted-foreground">Complete history of all system activities</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Showing {logs.length} most recent events
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{getActionIcon(log.action)}</span>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={getActionBadge(log.action)}>
                          {log.action.replace(/_/g, ' ')}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <User className="h-3 w-3" />
                          {log.user}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground pl-8">
                      {log.details}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                    <Clock className="h-3 w-3" />
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="bg-accent/5 border-accent/20">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-accent mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Audit Log Retention</p>
              <p className="text-xs text-muted-foreground">
                All audit logs are retained for 90 days and stored in compliance with security standards.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
