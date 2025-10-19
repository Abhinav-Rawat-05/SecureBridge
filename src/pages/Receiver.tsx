import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mockApi } from '@/lib/mockApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Clock, Loader2, Shield, Database, User } from 'lucide-react';
import { toast } from 'sonner';

export default function Receiver() {
  const queryClient = useQueryClient();

  const { data: transmissions = [], isLoading } = useQuery({
    queryKey: ['transmissions'],
    queryFn: mockApi.getTransmissions
  });

  const acceptMutation = useMutation({
    mutationFn: (id: string) => mockApi.updateTransmissionStatus(id, 'completed'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transmissions'] });
      toast.success('Transmission accepted and decrypted');
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => mockApi.updateTransmissionStatus(id, 'rejected'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transmissions'] });
      toast.error('Transmission rejected');
    }
  });

  const pendingTransmissions = transmissions.filter(t => t.status === 'pending');
  const processedTransmissions = transmissions.filter(t => t.status !== 'pending');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Receiver Dashboard</h1>
        <p className="text-muted-foreground">Review and process incoming encrypted transmissions</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pending Transmissions */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Pending Transmissions ({pendingTransmissions.length})
            </h2>
            {pendingTransmissions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No pending transmissions
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {pendingTransmissions.map((transmission) => (
                  <Card key={transmission.id} className="border-primary/20">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="flex items-center gap-2">
                            <Database className="h-5 w-5 text-accent" />
                            Transmission #{transmission.id}
                          </CardTitle>
                          <CardDescription>
                            Received: {new Date(transmission.timestamp).toLocaleString()}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Pending
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Sender:</span>
                            <span className="text-muted-foreground">{transmission.sender}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Signature:</span>
                            <code className="text-xs bg-muted px-2 py-1 rounded">{transmission.signature}</code>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Database className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Schema:</span>
                            <span className="text-muted-foreground">{transmission.schema}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Encrypted Query:</label>
                          <div className="bg-muted/50 p-3 rounded-md border">
                            <code className="text-xs font-mono break-all">
                              {transmission.query}
                            </code>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Button
                          onClick={() => acceptMutation.mutate(transmission.id)}
                          disabled={acceptMutation.isPending}
                          className="flex-1 bg-success hover:bg-success/90"
                        >
                          {acceptMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Decrypting...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Accept & Decrypt
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => rejectMutation.mutate(transmission.id)}
                          disabled={rejectMutation.isPending}
                          variant="destructive"
                          className="flex-1"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Processed Transmissions */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Processing History</h2>
            <div className="space-y-3">
              {processedTransmissions.map((transmission) => (
                <Card key={transmission.id} className="bg-muted/30">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="font-medium">Transmission #{transmission.id}</div>
                        <div className="text-sm text-muted-foreground">
                          From: {transmission.sender} • {new Date(transmission.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <Badge
                        variant={transmission.status === 'completed' ? 'default' : 'destructive'}
                        className="flex items-center gap-1"
                      >
                        {transmission.status === 'completed' ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" />
                            Completed
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3" />
                            Rejected
                          </>
                        )}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
