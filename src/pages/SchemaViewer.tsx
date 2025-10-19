import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, ChevronDown, ChevronRight, Database, Table, Columns } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Column {
  name: string;
  type: string;
  nullable: boolean;
}

interface TableSchema {
  name: string;
  columns: Column[];
  rowCount: number;
}

const hospitalSchema: TableSchema[] = [
  {
    name: 'patients',
    rowCount: 1547,
    columns: [
      { name: 'patient_id', type: 'INT PRIMARY KEY', nullable: false },
      { name: 'first_name', type: 'VARCHAR(100)', nullable: false },
      { name: 'last_name', type: 'VARCHAR(100)', nullable: false },
      { name: 'dob', type: 'DATE', nullable: false },
      { name: 'gender', type: 'VARCHAR(10)', nullable: true },
      { name: 'admission_date', type: 'TIMESTAMP', nullable: true },
      { name: 'discharge_date', type: 'TIMESTAMP', nullable: true }
    ]
  },
  {
    name: 'doctors',
    rowCount: 89,
    columns: [
      { name: 'doctor_id', type: 'INT PRIMARY KEY', nullable: false },
      { name: 'first_name', type: 'VARCHAR(100)', nullable: false },
      { name: 'last_name', type: 'VARCHAR(100)', nullable: false },
      { name: 'specialization', type: 'VARCHAR(100)', nullable: false },
      { name: 'email', type: 'VARCHAR(255)', nullable: false }
    ]
  },
  {
    name: 'appointments',
    rowCount: 3204,
    columns: [
      { name: 'appointment_id', type: 'INT PRIMARY KEY', nullable: false },
      { name: 'patient_id', type: 'INT FOREIGN KEY', nullable: false },
      { name: 'doctor_id', type: 'INT FOREIGN KEY', nullable: false },
      { name: 'appointment_date', type: 'TIMESTAMP', nullable: false },
      { name: 'status', type: 'VARCHAR(20)', nullable: false }
    ]
  },
  {
    name: 'medications',
    rowCount: 412,
    columns: [
      { name: 'medication_id', type: 'INT PRIMARY KEY', nullable: false },
      { name: 'name', type: 'VARCHAR(200)', nullable: false },
      { name: 'description', type: 'TEXT', nullable: true },
      { name: 'dosage', type: 'VARCHAR(50)', nullable: false }
    ]
  },
  {
    name: 'prescriptions',
    rowCount: 2891,
    columns: [
      { name: 'prescription_id', type: 'INT PRIMARY KEY', nullable: false },
      { name: 'patient_id', type: 'INT FOREIGN KEY', nullable: false },
      { name: 'doctor_id', type: 'INT FOREIGN KEY', nullable: false },
      { name: 'medication_id', type: 'INT FOREIGN KEY', nullable: false },
      { name: 'prescribed_on', type: 'TIMESTAMP', nullable: false },
      { name: 'instructions', type: 'TEXT', nullable: true }
    ]
  },
  {
    name: 'hospital_staff',
    rowCount: 234,
    columns: [
      { name: 'staff_id', type: 'INT PRIMARY KEY', nullable: false },
      { name: 'name', type: 'VARCHAR(200)', nullable: false },
      { name: 'role', type: 'VARCHAR(100)', nullable: false },
      { name: 'email', type: 'VARCHAR(255)', nullable: false },
      { name: 'joined_on', type: 'DATE', nullable: false }
    ]
  }
];

export default function SchemaViewer() {
  const [isConnected, setIsConnected] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set(['patients']));
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate network delay
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefresh(new Date());
    }, 1200);
  };

  const toggleTable = (tableName: string) => {
    const newExpanded = new Set(expandedTables);
    if (newExpanded.has(tableName)) {
      newExpanded.delete(tableName);
    } else {
      newExpanded.add(tableName);
    }
    setExpandedTables(newExpanded);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Database Schema Viewer</h1>
          <p className="text-muted-foreground">Live view of connected database schemas</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={cn(
              "h-2 w-2 rounded-full",
              isConnected ? "bg-success animate-pulse" : "bg-destructive"
            )} />
            <span className="text-sm font-medium">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
          >
            <RefreshCw className={cn("mr-2 h-4 w-4", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                hospital_db
              </CardTitle>
              <CardDescription>
                PostgreSQL 14.5 • Last updated: {lastRefresh.toLocaleTimeString()}
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-mono">
              {hospitalSchema.length} tables
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {hospitalSchema.map((table) => {
            const isExpanded = expandedTables.has(table.name);
            return (
              <div key={table.name} className="border rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleTable(table.name)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                    <Table className="h-4 w-4 text-accent" />
                    <span className="font-mono font-medium">{table.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {table.rowCount.toLocaleString()} rows
                    </Badge>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {table.columns.length} columns
                  </Badge>
                </button>

                {isExpanded && (
                  <div className="border-t bg-muted/30">
                    <div className="px-4 py-3 space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                        <Columns className="h-4 w-4" />
                        Columns
                      </div>
                      {table.columns.map((column) => (
                        <div
                          key={column.name}
                          className="flex items-center justify-between py-2 px-3 bg-card rounded border"
                        >
                          <div className="flex items-center gap-3">
                            <code className="text-sm font-mono font-medium">
                              {column.name}
                            </code>
                            {!column.nullable && (
                              <Badge variant="destructive" className="text-xs">
                                NOT NULL
                              </Badge>
                            )}
                          </div>
                          <Badge variant="outline" className="font-mono text-xs">
                            {column.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="bg-accent/5 border-accent/20">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Database className="h-5 w-5 text-accent mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Database Connection Info</p>
              <p className="text-xs text-muted-foreground">
                Connected to <code className="bg-muted px-1 py-0.5 rounded">hospital-db-prod.secure-proxy.local:5432</code> via encrypted proxy
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
