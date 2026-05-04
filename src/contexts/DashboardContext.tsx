import React, { createContext, useContext, useState, useCallback } from 'react';

interface DashboardState {
  [key: string]: any[]; // Entity name -> rows
}

interface DashboardContextType {
  cache: DashboardState;
  isInitialized: boolean;
  setCache: (entity: string, rows: any[]) => void;
  invalidateCache: (entity: string) => void;
  clearCache: () => void;
  setInitialized: (val: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cache, setCacheInternal] = useState<DashboardState>({});
  const [isInitialized, setInitialized] = useState(false);

  const setCache = useCallback((entity: string, rows: any[]) => {
    setCacheInternal(prev => ({ ...prev, [entity]: rows }));
  }, []);

  const invalidateCache = useCallback((entity: string) => {
    setCacheInternal(prev => {
      const next = { ...prev };
      delete next[entity];
      return next;
    });
  }, []);

  const clearCache = useCallback(() => {
    setCacheInternal({});
    setInitialized(false);
  }, []);

  return (
    <DashboardContext.Provider value={{ cache, setCache, invalidateCache, clearCache, isInitialized, setInitialized }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('useDashboard must be used within a DashboardProvider');
  return context;
};
