export interface WealthEntry {
  id: string;
  amount: number;
  type?: "asset" | "liability";
  description: string;
  name: string;
  assetType: string;
}