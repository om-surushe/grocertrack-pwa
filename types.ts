export type UnitType = 'kg' | 'liter' | 'quantity';

export interface ShopItem {
  id: string;
  name: string;
  unitType: UnitType;
  // We store as strings to handle empty states gracefully in inputs
  // but they represent numeric values
  pricePerUnit: string; 
  quantity: string; // Renamed from amount
  totalPaid: string;
  isCompleted: boolean;
  timestamp: number;
}

export interface ShopGroup {
  id: string;
  name: string;
  createdAt: number; // Timestamp
  updatedAt: number;
  items: ShopItem[];
}

export type Theme = 'light' | 'dark';

export type ViewState = 'LIST' | 'DETAIL';