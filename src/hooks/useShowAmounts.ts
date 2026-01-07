import { useState, useEffect, useCallback } from 'react';
import { getShowAmounts, setShowAmounts } from '../utils/localStorage';

export const useShowAmounts = () => {
  const [showAmounts, setShowAmountsState] = useState<boolean>(() => getShowAmounts());

  const toggleShowAmounts = useCallback(() => {
    setShowAmountsState((prev) => {
      const newValue = !prev;
      setShowAmounts(newValue);
      return newValue;
    });
  }, []);

  // Sync with localStorage on mount in case it changed in another tab
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'show_amounts_preference') {
        setShowAmountsState(getShowAmounts());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return { showAmounts, toggleShowAmounts };
};

