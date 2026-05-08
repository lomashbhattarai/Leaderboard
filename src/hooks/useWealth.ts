import { useState, useCallback, useMemo, useEffect } from 'react';
import { WealthEntry } from '../types/wealth';
import {
  getWealthEntries,
  createWealthEntry,
  updateWealthEntry as updateWealthEntryAPI,
  deleteWealthEntry as deleteWealthEntryAPI,
  createMultipleWealthEntries,
} from '../api/wealth';

export const useWealth = () => {
  const [wealthEntries, setWealthEntries] = useState<WealthEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to convert backend WealthEntry (with numeric id) to frontend WealthEntry (with string id)
  const convertWealthEntry = (entry: any): WealthEntry => ({
    ...entry,
    id: entry.id.toString(),
  });

  useEffect(() => {
    const fetchWealthEntries = async () => {
      try {
        setLoading(true);
        setError(null);
        const entries = await getWealthEntries();
        setWealthEntries(entries.map(convertWealthEntry));
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch wealth entries');
        console.error('Error fetching wealth entries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWealthEntries();
  }, []);

  const addWealthEntry = useCallback(
    async (entry: Omit<WealthEntry, 'id'>) => {
      try {
        setError(null);
        const newEntry = await createWealthEntry(entry);
        setWealthEntries((prev) => [...prev, convertWealthEntry(newEntry)]);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to create wealth entry');
        console.error('Error creating wealth entry:', err);
        throw err;
      }
    },
    []
  );

  const addMultipleWealthEntries = useCallback(
    async (entries: Array<Omit<WealthEntry, 'id'>>) => {
      try {
        setError(null);
        const newEntries = await createMultipleWealthEntries(entries);
        setWealthEntries((prev) => [
          ...prev,
          ...newEntries.map(convertWealthEntry),
        ]);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to create wealth entries');
        console.error('Error creating wealth entries:', err);
        throw err;
      }
    },
    []
  );

  const netWorth = useMemo(() => {
    return wealthEntries.reduce((sum, entry) => {
      if (entry.type === 'liability') {
        return sum - parseFloat(entry.amount.toString());
      } else {
        return sum + parseFloat(entry.amount.toString());
      }
    }, 0);
  }, [wealthEntries]);

  const updateWealthEntry = useCallback(
    async (id: string | number, entry: Partial<Omit<WealthEntry, 'id'>>) => {
      try {
        setError(null);
        const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
        const updatedEntry = await updateWealthEntryAPI(numericId, entry);
        setWealthEntries((prev) =>
          prev.map((e) => (e.id === id.toString() ? convertWealthEntry(updatedEntry) : e))
        );
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to update wealth entry');
        console.error('Error updating wealth entry:', err);
        throw err;
      }
    },
    []
  );

  const deleteWealthEntry = useCallback(async (id: string | number) => {
    try {
      setError(null);
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
      await deleteWealthEntryAPI(numericId);
      setWealthEntries((prev) => prev.filter((entry) => entry.id !== id.toString()));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete wealth entry');
      console.error('Error deleting wealth entry:', err);
      throw err;
    }
  }, []);

  return {
    wealthEntries,
    addWealthEntry,
    updateWealthEntry,
    netWorth,
    addMultipleWealthEntries,
    deleteWealthEntry,
    loading,
    error,
  };
}; 
