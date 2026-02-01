
export enum Unit {
  KG = 'kg',
  G = 'g',
  L = 'l',
  ML = 'ml',
  UN = 'un',
  CX = 'cx',
  PCT = 'pct'
}

export enum Category {
  PANTRY = 'Despensa',
  FRIDGE = 'Geladeira',
  FREEZER = 'Freezer',
  CLEANING = 'Limpeza',
  HYGIENE = 'Higiene',
  PHARMACY = 'Farmácia',
  OTHER = 'Outros'
}

export interface InventoryItem {
  id: string;
  name: string;
  category: Category | string;
  quantity: number;
  unit: Unit | string;
  price: number;
  expiryDate: string;
  location: string;
  minStock: number;
  observation?: string;
  inCart?: boolean;
  addedAt: number;
  updatedAt: number;
}

export interface FilterState {
  search: string;
  category: string;
  onlyLowStock: boolean;
  onlyExpiring: boolean;
}
