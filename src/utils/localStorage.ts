import { Transaction } from "../hooks/useEarningsCalculator";
import { ScriptInPortfolio } from "../types/portfolio";
const TRANSACTIONS_KEY = 'wealth_calculator_transactions';

const PORTFOLIO_KEY = 'mero_share_portfolio';
export const saveToLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getFromLocalStorage = (key: string) => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : null;
};

// Earnings Calculator

export const saveTransactions = (transactions: Transaction[]): void => {
  saveToLocalStorage(TRANSACTIONS_KEY, transactions);
};

export const getTransactions = (): Transaction[] => {
  const storedTransactions = getFromLocalStorage(TRANSACTIONS_KEY);
  if (storedTransactions) {
    return storedTransactions.map((transaction: Transaction) => ({
      ...transaction,
      startDate: new Date(transaction.startDate),
      endDate: transaction.endDate ? new Date(transaction.endDate) : null
    }));
  }
  return [];
};

export const addTransaction = (transaction: Transaction): void => {
  const transactions = getTransactions();
  transactions.push(transaction);
  saveTransactions(transactions);
};

// Portfolio

export const savePortfolio = (portfolio: ScriptInPortfolio[]): void => {
  saveToLocalStorage(PORTFOLIO_KEY, portfolio);
};

export const getPortfolio = (): ScriptInPortfolio[] => {
  const storedPortfolio = getFromLocalStorage(PORTFOLIO_KEY);
  return storedPortfolio || [];
};