import { InventoryItem } from '../types';

const STORAGE_KEY = 'despensa_smart_data';

export const getItems = (): InventoryItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error reading storage", e);
    return [];
  }
};

export const saveItems = (items: InventoryItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Error saving storage", e);
  }
};

export const addItem = (item: Omit<InventoryItem, 'id' | 'addedAt' | 'updatedAt'>): InventoryItem[] => {
  const items = getItems();
  const newItem: InventoryItem = {
    ...item,
    id: crypto.randomUUID(),
    addedAt: Date.now(),
    updatedAt: Date.now()
  };
  const updatedItems = [newItem, ...items]; // Newest first temporarily, but UI sorts by Qty
  saveItems(updatedItems);
  return updatedItems;
};

export const updateItem = (id: string, updates: Partial<InventoryItem>): InventoryItem[] => {
  const items = getItems();
  const updatedItems = items.map(item => 
    item.id === id ? { ...item, ...updates, updatedAt: Date.now() } : item
  );
  saveItems(updatedItems);
  return updatedItems;
};

export const deleteItem = (id: string): InventoryItem[] => {
  const items = getItems();
  const updatedItems = items.filter(item => item.id !== id);
  saveItems(updatedItems);
  return updatedItems;
};

export const calculateStatus = (item: InventoryItem) => {
  const today = new Date();
  const expiry = new Date(item.expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const isLowStock = item.quantity <= item.minStock;
  const isExpired = diffDays < 0;
  const isExpiringSoon = diffDays >= 0 && diffDays <= 7;

  return { isLowStock, isExpired, isExpiringSoon, diffDays };
};

export const getShoppingList = (items: InventoryItem[]): InventoryItem[] => {
  return items.filter(item => {
    // Logic: Add to list if quantity is 1 or less OR quantity is below/equal minStock
    return item.quantity <= 1 || item.quantity <= item.minStock;
  });
};
