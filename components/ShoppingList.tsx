import React, { useState } from 'react';
import { InventoryItem, Unit } from '../types';
import { getShoppingList } from '../services/storageService';
import { Share2, CheckSquare, Square, ShoppingCart } from 'lucide-react';

interface Props {
  items: InventoryItem[];
  onUpdate: (id: string, updates: Partial<InventoryItem>) => void;
}

const ShoppingList: React.FC<Props> = ({ items, onUpdate }) => {
  const shoppingList = getShoppingList(items);
  // Local state to track "checked" items in the shopping list before they are actually restocked
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleCheck = (id: string) => {
    const next = new Set(checkedItems);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCheckedItems(next);
  };

  const handleRestock = (item: InventoryItem) => {
    // Restock logic: Set quantity to minStock * 3 (arbitrary rule) or +1
    const newQuantity = item.quantity + (item.minStock > 0 ? item.minStock * 2 : 1); 
    onUpdate(item.id, { quantity: newQuantity });
    // Uncheck
    const next = new Set(checkedItems);
    next.delete(item.id);
    setCheckedItems(next);
  };

  const shareList = () => {
    const text = "Lista de Compras - Despensa Smart:\n\n" + 
      shoppingList.map(i => `- [ ] ${i.name} (${i.minStock > 0 ? i.minStock * 2 : 1} ${i.unit})`).join('\n');
    
    if (navigator.share) {
      navigator.share({
        title: 'Lista de Compras',
        text: text,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text);
      alert('Lista copiada para a área de transferência!');
    }
  };

  if (shoppingList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
        <ShoppingCart size={64} className="mb-4 opacity-50" />
        <p className="text-lg">Tudo em ordem!</p>
        <p className="text-sm">Nenhum item precisa de reposição.</p>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Lista de Compras</h2>
        <button 
          onClick={shareList}
          className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-200 transition"
        >
          <Share2 size={20} />
        </button>
      </div>

      <div className="space-y-3">
        {shoppingList.map(item => {
          const isChecked = checkedItems.has(item.id);
          return (
            <div 
              key={item.id}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                isChecked 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                  : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <button onClick={() => toggleCheck(item.id)} className="text-gray-400 hover:text-primary transition">
                  {isChecked ? <CheckSquare className="text-primary" /> : <Square />}
                </button>
                <div className={isChecked ? 'opacity-50 line-through' : ''}>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    Estoque atual: <span className="text-red-500 font-bold">{item.quantity} {item.unit}</span>
                  </p>
                </div>
              </div>

              {isChecked && (
                <button
                  onClick={() => handleRestock(item)}
                  className="ml-2 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full hover:bg-emerald-600 transition animate-in fade-in slide-in-from-right-5"
                >
                  Repor
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShoppingList;