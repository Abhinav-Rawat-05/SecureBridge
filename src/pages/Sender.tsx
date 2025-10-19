import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mockApi } from '@/lib/mockApi';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Send, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Sender() {
  const [query, setQuery] = useState('SELECT * FROM patients WHERE admission_date > "2024-01-01"');
  const [receiver, setReceiver] = useState('Hospital B Database');
  const queryClient = useQueryClient();

  const { data: transmissions = [], isLoading } = useQuery({
    queryKey: ['transmissions'],
    queryFn: mockApi.getTransmissions
  });

  const sendMutation = useMutation({
    mutationFn: (data: { query: string; receiver: string }) =>
      mockApi.createTransmission({
        sender: 'admin@hospital-a.com',
        receiver: data.receiver,
        query: data.query,
        signature: `0x${Math.random().toString(16).substring(2, 10)}...`,
        schema: 'hospital_db'
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transmissions'] });
      toast.success('Transmission sent successfully');
      setQuery('');
    }
  });

  const handleSend = () => {
    if (!query.trim()) {
      toast.error('Please enter a SQL query');
      return;
    }
    sendMutation.mutate({ query, receiver });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'completed':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Sender Dashboard</h1>
        <p className="text-muted-foreground">Compose and send encrypted SQL queries to receiver databases</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Compose Query</CardTitle>
            <CardDescription>Write your SQL query and select the target receiver</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">SQL Query</label>
              <Textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="SELECT * FROM..."
                className="font-mono min-h-[200px] bg-muted/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Receiver Database</label>
              <Select value={receiver} onValueChange={setReceiver}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hospital B Database">Hospital B Database</SelectItem>
                  <SelectItem value="Hospital C Database">Hospital C Database</SelectItem>
                  <SelectItem value="Research Lab Database">Research Lab Database</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleSend} 
              className="w-full" 
              disabled={sendMutation.isPending}
            >
              {sendMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Encrypting & Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Query
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transmission History</CardTitle>
            <CardDescription>Recent query transmissions and their status</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-3">
                {transmissions.slice().reverse().map((t) => (
                  <div key={t.id} className="p-4 border rounded-lg space-y-2 bg-card hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{t.receiver}</span>
                      <Badge variant={getStatusVariant(t.status)} className="flex items-center gap-1">
                        {getStatusIcon(t.status)}
                        {t.status}
                      </Badge>
                    </div>
                    <code className="text-xs bg-muted px-2 py-1 rounded block overflow-x-auto">
                      {t.query.substring(0, 60)}...
                    </code>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{new Date(t.timestamp).toLocaleString()}</span>
                      <span>Sig: {t.signature}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
