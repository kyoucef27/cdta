import { useNavContext } from '../contexts/NavContext';

export const useNav = () => {
  const { navData, loading, error } = useNavContext();
  return { navData, loading, error };
};