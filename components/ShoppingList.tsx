
import React from 'react';
import { InventoryItem } from '../types';
import { ShoppingCart, CheckCircle2, Circle, Trash2, Share2, Calculator } from 'lucide-react';

interface Props {
  items: InventoryItem[];
  onUpdate: (id: string, updates: Partial<InventoryItem>) => void;
}

const ShoppingList: React.FC<Props> = ({ items, onUpdate }) => {
  const shoppingList = items.filter(item => item.quantity <= item.minStock || item.inCart);
  
  const toBuy = shoppingList.filter(i => !i.inCart);
  const inCart = shoppingList.filter(i => i.inCart);

  const calculateTotal = (list: InventoryItem[]) => 
    list.reduce((acc, curr) => acc + (curr.price * (curr.minStock || 1)), 0);

  const totalToBuy = calculateTotal(toBuy);
  const totalInCart = calculateTotal(inCart);

  const toggleCart = (item: InventoryItem) => {
    onUpdate(item.id, { inCart: !item.inCart });
  };

  const shareList = () => {
    const text = "🛒 Minha Lista de Compras:\n\n" + 
      toBuy.map(i => `☐ ${i.name} - ${i.minStock} ${i.unit}`).join('\n') +
      "\n\nGerado por Despensa Smart";
    
    if (navigator.share) {
      navigator.share({ title: 'Lista de Compras', text }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text);
      alert('Lista copiada!');
    }
  };

  if (shoppingList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
        <ShoppingCart size={64} className="mb-4 opacity-20" />
        <p className="text-lg font-medium">Lista vazia</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-slate-900">
      <div className="p-4 flex justify-between items-center bg-white dark:bg-slate-800 border-b dark:border-slate-700">
        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
          <ShoppingCart size={24} /> Minha Lista
        </h2>
        <button onClick={shareList} className="p-2 text-gray-500 hover:text-primary"><Share2 size={20} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">
        {/* Para Comprar */}
        {toBuy.length > 0 && (
          <section>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Para Comprar ({toBuy.length})</h3>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm divide-y dark:divide-slate-700">
              {toBuy.map(item => (
                <div key={item.id} className="flex items-center p-3 gap-3">
                  <button onClick={() => toggleCart(item)} className="text-gray-300"><Circle /></button>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 dark:text-gray-100">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.minStock} {item.unit} • R$ {item.price.toFixed(2)}</div>
                  </div>
                  <div className="font-bold text-primary">R$ {(item.price * (item.minStock || 1)).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* No Carrinho */}
        {inCart.length > 0 && (
          <section>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">No Carrinho ({inCart.length})</h3>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl shadow-sm divide-y dark:divide-green-800/30">
              {inCart.map(item => (
                <div key={item.id} className="flex items-center p-3 gap-3 opacity-60">
                  <button onClick={() => toggleCart(item)} className="text-primary"><CheckCircle2 /></button>
                  <div className="flex-1 line-through">
                    <div className="font-semibold text-gray-800 dark:text-gray-100">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.minStock} {item.unit}</div>
                  </div>
                  <div className="font-bold">R$ {(item.price * (item.minStock || 1)).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Rodapé de Totais (SoftList Style) */}
      <div className="fixed bottom-16 left-0 right-0 bg-primary text-white p-4 flex justify-around items-center shadow-lg">
        <div className="text-center">
          <div className="text-[10px] uppercase opacity-80">Total</div>
          <div className="font-bold text-lg">R$ {(totalToBuy + totalInCart).toFixed(2)}</div>
        </div>
        <div className="h-8 w-px bg-white/20"></div>
        <div className="text-center">
          <div className="text-[10px] uppercase opacity-80">No Carrinho</div>
          <div className="font-bold text-lg">R$ {totalInCart.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingList;
