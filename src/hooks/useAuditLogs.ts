
import { useState, useEffect } from 'react';

// Mock data for audit logs
const mockAuditLogs = [
  {
    id: '1',
    type: 'authentication',
    timestamp: '2023-06-15T10:30:45',
    user: 'admin@example.com',
    action: 'User Login',
    ip_address: '192.168.1.1',
    details: 'Successful login attempt'
  },
  {
    id: '2',
    type: 'booking',
    timestamp: '2023-06-15T11:15:22',
    user: 'staff@example.com',
    action: 'Booking Created',
    ip_address: '192.168.1.2',
    details: 'New booking #BK-2023-0001 created for John Smith'
  },
  {
    id: '3',
    type: 'system',
    timestamp: '2023-06-15T12:45:10',
    user: 'system',
    action: 'Backup Completed',
    ip_address: '192.168.1.100',
    details: 'Daily system backup completed successfully'
  },
  {
    id: '4',
    type: 'user',
    timestamp: '2023-06-15T14:22:05',
    user: 'admin@example.com',
    action: 'User Created',
    ip_address: '192.168.1.1',
    details: 'New staff user created: reception@example.com'
  },
  {
    id: '5',
    type: 'settings',
    timestamp: '2023-06-15T16:10:30',
    user: 'admin@example.com',
    action: 'Settings Changed',
    ip_address: '192.168.1.1',
    details: 'Email notification settings updated'
  },
  {
    id: '6',
    type: 'booking',
    timestamp: '2023-06-15T17:05:12',
    user: 'staff@example.com',
    action: 'Booking Updated',
    ip_address: '192.168.1.2',
    details: 'Booking #BK-2023-0001 check-out date changed'
  },
  {
    id: '7',
    type: 'authentication',
    timestamp: '2023-06-15T18:30:40',
    user: 'staff@example.com',
    action: 'User Logout',
    ip_address: '192.168.1.2',
    details: 'User logged out successfully'
  },
];

export function useAuditLogs() {
  const [data, setData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    // Simulate API call with a delay
    const fetchData = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setData(mockAuditLogs);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
}
