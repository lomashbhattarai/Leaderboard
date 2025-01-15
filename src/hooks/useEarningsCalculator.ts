import { useState, useCallback, useMemo, useEffect } from 'react';
import { getTransactions, saveTransactions as saveLocalStorageTransactions } from '../utils/localStorage';

export interface Transaction {
  sn: number;
  id: string;
  startDate: Date;
  endDate: Date;
  amount: number;
  type: "salary" | "earning" | "expense";
  description: string;
  name: string;
}



export const useEarningsCalculator = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const storedTransactions = getTransactions();
    if (storedTransactions.length > 0) {
      setTransactions(storedTransactions);
    }
  }, []);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    setTransactions(prev => {
      const newTransactions = [...prev, { ...transaction, id: Date.now().toString() }];
      saveLocalStorageTransactions(newTransactions);
      return newTransactions;
    });
  }, []);

  const addMultipleTransactions = useCallback((transactions: Array<Transaction>) => 
  setTransactions(prev => {
    const newTransactions = [ ...prev, ...transactions ];
    saveLocalStorageTransactions(newTransactions);
    return newTransactions;
    }),
    []
  );
  
  const calculateTotalAmount = useCallback((transaction: Transaction) => {
    const startDate = new Date(transaction.startDate);
    const endDate = new Date(transaction.endDate);
    const diffMonths =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth());
    return transaction.type === 'salary' ? transaction.amount * Math.max(1, diffMonths) : transaction.amount;
  }, []);

  const totalWealth = useMemo(() => {
    return transactions.reduce((sum, transaction) => {
      const totalAmount = calculateTotalAmount(transaction);
      if (transaction.type === 'expense') {
        return sum - totalAmount;
      } else {
        return sum + totalAmount;
      }
    }, 0);
  }, [transactions, calculateTotalAmount]);

  const deleteTransaction = useCallback((index: number) => {
    setTransactions(prev => {
      const newTransactions = prev.filter((transaction, idx) => idx !== index);
      saveLocalStorageTransactions(newTransactions);
      return newTransactions;
    });
  }, []);

  return { transactions, addTransaction, totalWealth, addMultipleTransactions, deleteTransaction };
};