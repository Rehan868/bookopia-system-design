import { useState, useEffect } from 'react';
import { checkSupabaseConnection } from '@/integrations/supabase/client';

export function SupabaseConnectionStatus() {
  const [status, setStatus] = useState<{
    connected: boolean;
    error?: string;
    checking: boolean;
  }>({
    connected: false,
    checking: true
  });

  const checkConnection = async () => {
    setStatus(prev => ({ ...prev, checking: true }));
    try {
      const result = await checkSupabaseConnection();
      setStatus({
        connected: result.connected,
        error: result.error as string | undefined,
        checking: false
      });
    } catch (error) {
      setStatus({
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        checking: false
      });
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  if (!status.checking && status.connected) {
    return null; // Don't show anything if connected
  }

  return (
    <div className="fixed bottom-4 right-4 p-3 bg-amber-50 border border-amber-300 rounded-md shadow-md z-50 max-w-md">
      <div className="flex items-start gap-2">
        <div className={`w-3 h-3 rounded-full mt-1 ${status.checking ? 'bg-amber-400' : 'bg-red-500'}`} />
        <div>
          <h3 className="font-medium text-amber-800">
            {status.checking ? 'Checking Supabase connection...' : 'Supabase Disconnected'}
          </h3>
          {!status.checking && (
            <>
              <p className="text-sm text-amber-700 mt-1">
                Unable to connect to Supabase. The app is using mock data.
              </p>
              {status.error && (
                <p className="text-xs text-red-600 mt-1 font-mono">
                  Error: {status.error}
                </p>
              )}
              <div className="mt-2 flex justify-between">
                <button
                  onClick={checkConnection}
                  className="text-xs bg-amber-100 hover:bg-amber-200 px-2 py-1 rounded text-amber-800"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
                  className="text-xs bg-amber-100 hover:bg-amber-200 px-2 py-1 rounded text-amber-800"
                >
                  Open Supabase Dashboard
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}