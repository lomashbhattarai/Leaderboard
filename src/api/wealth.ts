import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import { WealthEntry } from '../types/wealth';

export interface CreateWealthEntryData {
  name: string;
  assetType: string;
  description?: string;
  amount: number;
  type?: 'asset' | 'liability';
}

export interface UpdateWealthEntryData {
  name?: string;
  assetType?: string;
  description?: string;
  amount?: number;
  type?: 'asset' | 'liability';
}

export interface WealthEntriesResponse {
  status: 'success';
  data: WealthEntry[];
}

export interface WealthEntryResponse {
  status: 'success';
  data: WealthEntry;
}

export const getWealthEntries = async (): Promise<WealthEntry[]> => {
  const response = await apiClient.get<WealthEntriesResponse>(ENDPOINTS.WEALTH_ENTRIES.LIST);
  return response.data.data;
};

export const createWealthEntry = async (data: CreateWealthEntryData): Promise<WealthEntry> => {
  const response = await apiClient.post<WealthEntryResponse>(
    ENDPOINTS.WEALTH_ENTRIES.CREATE,
    data
  );
  return response.data.data;
};

export const updateWealthEntry = async (
  id: number,
  data: UpdateWealthEntryData
): Promise<WealthEntry> => {
  const response = await apiClient.put<WealthEntryResponse>(
    ENDPOINTS.WEALTH_ENTRIES.UPDATE(id),
    data
  );
  return response.data.data;
};

export const deleteWealthEntry = async (id: number): Promise<void> => {
  await apiClient.delete(ENDPOINTS.WEALTH_ENTRIES.DELETE(id));
};

export const createMultipleWealthEntries = async (
  entries: CreateWealthEntryData[]
): Promise<WealthEntry[]> => {
  const response = await apiClient.post<WealthEntriesResponse>(
    ENDPOINTS.WEALTH_ENTRIES.CREATE_BULK,
    { entries }
  );
  return response.data.data;
};

