import { Transmission, AuditLog, KeyPair } from '@/types/transmission';

// Mock data storage
let transmissions: Transmission[] = [
  {
    id: '1',
    sender: 'admin@hospital-a.com',
    receiver: 'Hospital B Database',
    query: 'SELECT * FROM patients WHERE admission_date > "2024-01-01"',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: 'completed',
    signature: '0x4f7a2b9e...',
    schema: 'hospital_db'
  },
  {
    id: '2',
    sender: 'admin@hospital-a.com',
    receiver: 'Hospital C Database',
    query: 'SELECT doctor_id, COUNT(*) FROM appointments GROUP BY doctor_id',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    status: 'pending',
    signature: '0x8c3d1a5f...',
    schema: 'hospital_db'
  }
];

const auditLogs: AuditLog[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    action: 'TRANSMISSION_ACCEPTED',
    user: 'receiver@hospital-b.com',
    details: 'Accepted transmission #1 from admin@hospital-a.com'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    action: 'TRANSMISSION_CREATED',
    user: 'admin@hospital-a.com',
    details: 'Created new transmission to Hospital B Database'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 5400000).toISOString(),
    action: 'KEY_ROTATED',
    user: 'system',
    details: 'Rotated encryption keys for receiver Hospital B'
  }
];

const keyPairs: KeyPair[] = [
  {
    id: '1',
    name: 'Hospital A Primary Key',
    publicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    expiresAt: new Date(Date.now() + 86400000 * 335).toISOString()
  },
  {
    id: '2',
    name: 'Hospital B Receiver Key',
    publicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...',
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    expiresAt: new Date(Date.now() + 86400000 * 350).toISOString()
  }
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  async getTransmissions(): Promise<Transmission[]> {
    await delay(500);
    return [...transmissions];
  },

  async createTransmission(data: Omit<Transmission, 'id' | 'timestamp' | 'status'>): Promise<Transmission> {
    await delay(800);
    const newTransmission: Transmission = {
      ...data,
      id: String(transmissions.length + 1),
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    transmissions.push(newTransmission);
    return newTransmission;
  },

  async updateTransmissionStatus(id: string, status: 'completed' | 'rejected'): Promise<Transmission> {
    await delay(600);
    const transmission = transmissions.find(t => t.id === id);
    if (!transmission) throw new Error('Transmission not found');
    transmission.status = status;
    return transmission;
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    await delay(400);
    return [...auditLogs];
  },

  async getKeyPairs(): Promise<KeyPair[]> {
    await delay(300);
    return [...keyPairs];
  }
};
