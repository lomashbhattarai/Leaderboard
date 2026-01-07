import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { getShowAmounts, setShowAmounts } from "../utils/localStorage";

interface ShowAmountsContextType {
  showAmounts: boolean;
  toggleShowAmounts: () => void;
}

const ShowAmountsContext = createContext<ShowAmountsContextType | undefined>(
  undefined
);

export const ShowAmountsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [showAmounts, setShowAmountsState] = useState<boolean>(() =>
    getShowAmounts()
  );

  const toggleShowAmounts = useCallback(() => {
    setShowAmountsState((prev) => {
      const newValue = !prev;
      setShowAmounts(newValue);
      return newValue;
    });
  }, []);

  // Sync with localStorage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "show_amounts_preference") {
        setShowAmountsState(getShowAmounts());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <ShowAmountsContext.Provider value={{ showAmounts, toggleShowAmounts }}>
      {children}
    </ShowAmountsContext.Provider>
  );
};

export const useShowAmounts = () => {
  const context = useContext(ShowAmountsContext);
  if (context === undefined) {
    throw new Error("useShowAmounts must be used within a ShowAmountsProvider");
  }
  return context;
};
