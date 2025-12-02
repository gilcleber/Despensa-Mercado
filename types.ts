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
  expiryDate: string; // ISO Date string YYYY-MM-DD
  location: string;
  minStock: number;
  addedAt: number;
  updatedAt: number;
}

export interface FilterState {
  search: string;
  category: string;
  onlyLowStock: boolean;
  onlyExpiring: boolean;
}

export type ThemeMode = 'light' | 'dark';

export interface ShoppingItem extends InventoryItem {
  toBuy: number;
}