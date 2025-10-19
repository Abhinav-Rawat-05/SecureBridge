export type TransmissionStatus = 'pending' | 'completed' | 'rejected';

export interface Transmission {
  id: string;
  sender: string;
  receiver: string;
  query: string;
  timestamp: string;
  status: TransmissionStatus;
  signature?: string;
  schema?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
}

export interface KeyPair {
  id: string;
  name: string;
  publicKey: string;
  createdAt: string;
  expiresAt: string;
}
