import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { NavItem } from '../types/nav';
import { fetchClient } from '../services/api';

interface NavContextType {
  navData: NavItem[];
  loading: boolean;
  error: string | null;
  refreshNav: () => Promise<void>;
}

const NavContext = createContext<NavContextType | undefined>(undefined);

export const NavProvider = ({ children }: { children: ReactNode }) => {
  const [navData, setNavData] = useState<NavItem[]>(() => {
    const saved = localStorage.getItem('cdta_nav_cache');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNav = async () => {
    try {
      setLoading(true);
      const data = await fetchClient('/nav');
      setNavData(data);
      localStorage.setItem('cdta_nav_cache', JSON.stringify(data));
      setError(null);
    } catch (err: any) {
      console.error('Nav fetch error:', err);
      setError(err?.message || 'Failed to load navigation');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNav();
  }, []);

  return (
    <NavContext.Provider value={{ navData, loading, error, refreshNav: fetchNav }}>
      {children}
    </NavContext.Provider>
  );
};

export const useNavContext = () => {
  const context = useContext(NavContext);
  if (context === undefined) {
    throw new Error('useNavContext must be used within a NavProvider');
  }
  return context;
};
