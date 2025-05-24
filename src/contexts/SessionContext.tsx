import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createSession } from '../services/api';
import { Session } from '../types';

interface SessionContextType {
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  resetSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initSession = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const newSession = await createSession();
      setSession(newSession);
    } catch (err) {
      setError('Failed to create a new session. Please try again.');
      console.error('Session creation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetSession = async () => {
    setSession(null);
    await initSession();
  };

  useEffect(() => {
    initSession();
  }, []);

  return (
    <SessionContext.Provider value={{ session, isLoading, error, resetSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};