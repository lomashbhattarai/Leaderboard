import { useState, useCallback, useMemo, useEffect } from 'react';
import { getWealthEntries, saveWealthEntries } from '../utils/localStorage';
import { WealthEntry } from '../types/wealth';

export const useWealth = () => {
  const [wealthEntries, setWealthEntries] = useState<WealthEntry[]>([]);

  useEffect(() => {
    const storedWealth = getWealthEntries();
    if (storedWealth.length > 0) {
        setWealthEntries(   storedWealth);
    }
  }, []);

  const addWealthEntry = useCallback((entry: Omit<WealthEntry, 'id'>) => {
    setWealthEntries(prev => {
      const newEntries = [...prev, { ...entry, id: Date.now().toString() }];
      saveWealthEntries(newEntries);
      return newEntries;
    });
  }, []);

  const addMultipleWealthEntries = useCallback((entries: Array<WealthEntry>) => 
    setWealthEntries(prev => {
      const newEntries = [...prev, ...entries];
      saveWealthEntries(newEntries);
      return newEntries;
    }),
    []
  );

  const netWorth = useMemo(() => {
    return wealthEntries.reduce((sum, entry) => {
      if (entry.type === 'liability') {
        return sum - entry.amount;
      } else {
        return sum + entry.amount;
      }
    }, 0);
  }, [wealthEntries]);

  const deleteWealthEntry = useCallback((index: number) => {
    setWealthEntries(prev => {
      const newEntries = prev.filter((entry, idx) => idx !== index);
      saveWealthEntries(newEntries);
      return newEntries;
    });
  }, []);

  return { 
    wealthEntries, 
    addWealthEntry, 
    netWorth, 
    addMultipleWealthEntries, 
    deleteWealthEntry 
  };
}; 