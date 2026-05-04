import React, { createContext, useContext, useState, useCallback } from 'react';

interface PublicState {
  events?: any[];
  news?: any[];
}

interface PublicContextType {
  cache: PublicState;
  setPublicCache: (key: keyof PublicState, data: any[]) => void;
}

const PublicContext = createContext<PublicContextType | undefined>(undefined);

export const PublicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cache, setCache] = useState<PublicState>({});

  const setPublicCache = useCallback((key: keyof PublicState, data: any[]) => {
    setCache(prev => ({ ...prev, [key]: data }));
  }, []);

  return (
    <PublicContext.Provider value={{ cache, setPublicCache }}>
      {children}
    </PublicContext.Provider>
  );
};

export const usePublic = () => {
  const context = useContext(PublicContext);
  if (!context) throw new Error('usePublic must be used within PublicProvider');
  return context;
};
