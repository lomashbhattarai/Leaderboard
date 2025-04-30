import React, { createContext, useContext, ReactNode } from "react";
import {
  useWatchList,
  useAddToWatchList,
  useRemoveFromWatchList,
} from "../api/queries/useWatchList";
import type { WatchListEntry, AddToWatchListDTO } from "../types/api";

interface WatchListContextType {
  watchList: WatchListEntry[] | undefined;
  isLoading: boolean;
  isError: boolean;
  addToWatchList: (data: AddToWatchListDTO) => Promise<void>;
  removeFromWatchList: (id: number) => Promise<void>;
}

const WatchListContext = createContext<WatchListContextType | undefined>(
  undefined
);

export const WatchListProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { data: watchList, isLoading, isError } = useWatchList();
  const addMutation = useAddToWatchList();
  const removeMutation = useRemoveFromWatchList();

  const addToWatchList = async (data: AddToWatchListDTO) => {
    await addMutation.mutateAsync(data);
  };

  const removeFromWatchList = async (id: number) => {
    await removeMutation.mutateAsync(id);
  };

  return (
    <WatchListContext.Provider
      value={{
        watchList,
        isLoading,
        isError,
        addToWatchList,
        removeFromWatchList,
      }}
    >
      {children}
    </WatchListContext.Provider>
  );
};

export const useWatchListContext = () => {
  const context = useContext(WatchListContext);
  if (!context) {
    throw new Error(
      "useWatchListContext must be used within a WatchListProvider"
    );
  }
  return context;
};
