
import { InventoryItem, Category, Unit } from '../types';

const STORAGE_KEY = 'despensa_smart_data';

// Fallback in-memory storage if localStorage is blocked (e.g., privacy mode)
let memoryStorage: InventoryItem[] | null = null;

const safeGetStorage = (): InventoryItem[] => {
  if (memoryStorage) return memoryStorage;
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.warn("LocalStorage unavailable, using memory fallback", e);
    return memoryStorage || [];
  }
};

const safeSetStorage = (items: InventoryItem[]) => {
  memoryStorage = items;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Error saving to localStorage", e);
  }
};

export const getItems = (): InventoryItem[] => {
  return safeGetStorage();
};

export const saveItems = (items: InventoryItem[]) => {
  safeSetStorage(items);
};

export const addItem = (item: Omit<InventoryItem, 'id' | 'addedAt' | 'updatedAt'>): InventoryItem[] => {
  const items = safeGetStorage();
  const newItem: InventoryItem = {
    ...item,
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(), // Fallback for older browsers
    addedAt: Date.now(),
    updatedAt: Date.now()
  };
  const updatedItems = [newItem, ...items];
  safeSetStorage(updatedItems);
  return updatedItems;
};

export const updateItem = (id: string, updates: Partial<InventoryItem>): InventoryItem[] => {
  const items = safeGetStorage();
  const updatedItems = items.map(item => 
    item.id === id ? { ...item, ...updates, updatedAt: Date.now() } : item
  );
  safeSetStorage(updatedItems);
  return updatedItems;
};

export const deleteItem = (id: string): InventoryItem[] => {
  const items = safeGetStorage();
  const updatedItems = items.filter(item => item.id !== id);
  safeSetStorage(updatedItems);
  return updatedItems;
};

export const calculateStatus = (item: InventoryItem) => {
  try {
    const today = new Date();
    const expiry = new Date(item.expiryDate);
    // Validate date
    if (isNaN(expiry.getTime())) return { isLowStock: false, isExpired: false, isExpiringSoon: false, diffDays: 0 };

    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const isLowStock = item.quantity <= item.minStock;
    const isExpired = diffDays < 0;
    const isExpiringSoon = diffDays >= 0 && diffDays <= 7;

    return { isLowStock, isExpired, isExpiringSoon, diffDays };
  } catch (e) {
    return { isLowStock: false, isExpired: false, isExpiringSoon: false, diffDays: 0 };
  }
};

export const getShoppingList = (items: InventoryItem[]): InventoryItem[] => {
  return items.filter(item => {
    return item.quantity <= 1 || item.quantity <= item.minStock;
  });
};

// Dados de exemplo para inicialização
export const initializeSampleData = (): InventoryItem[] => {
  try {
    const currentItems = safeGetStorage();
    if (currentItems.length > 0) return currentItems;

    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setDate(today.getDate() + 30);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 5);

    const sampleItems: InventoryItem[] = [
      {
        id: '1',
        name: "Arroz Branco",
        category: Category.PANTRY,
        quantity: 5,
        unit: Unit.KG,
        expiryDate: nextMonth.toISOString().split('T')[0],
        location: "Despensa",
        minStock: 2,
        addedAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: '2',
        name: "Leite Integral",
        category: Category.FRIDGE,
        quantity: 1,
        unit: Unit.CX,
        expiryDate: nextWeek.toISOString().split('T')[0],
        location: "Geladeira",
        minStock: 3,
        addedAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        id: '3',
        name: "Sabão em Pó",
        category: Category.CLEANING,
        quantity: 0.5,
        unit: Unit.KG,
        expiryDate: "2025-12-31",
        location: "Lavanderia",
        minStock: 1,
        addedAt: Date.now(),
        updatedAt: Date.now()
      }
    ];

    safeSetStorage(sampleItems);
    return sampleItems;
  } catch (e) {
    console.error("Failed to initialize sample data", e);
    return [];
  }
};
