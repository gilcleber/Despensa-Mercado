import { Category, Unit } from './types';
import { Share, Trash2, Edit2, ShoppingCart, Home, BarChart2, Plus, ChefHat, Moon, Sun } from 'lucide-react';

export const APP_NAME = "Despensa Smart";

export const CATEGORIES = [
  Category.PANTRY,
  Category.FRIDGE,
  Category.FREEZER,
  Category.CLEANING,
  Category.HYGIENE,
  Category.PHARMACY,
  Category.OTHER
];

export const UNITS = [
  Unit.UN,
  Unit.KG,
  Unit.G,
  Unit.L,
  Unit.ML,
  Unit.CX,
  Unit.PCT
];

// Navigation Icons Map
export const NAV_ITEMS = [
  { id: 'inventory', label: 'Estoque', icon: Home },
  { id: 'shopping', label: 'Compras', icon: ShoppingCart },
  { id: 'add', label: 'Adicionar', icon: Plus },
  { id: 'recipes', label: 'Chef IA', icon: ChefHat },
  { id: 'stats', label: 'Análise', icon: BarChart2 },
];
