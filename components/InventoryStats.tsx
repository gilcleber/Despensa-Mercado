
import React from 'react';
import { InventoryItem, Category } from '../types';

interface Props {
  items: InventoryItem[];
}

const InventoryStats: React.FC<Props> = ({ items }) => {
  const categoryStats = Object.values(Category).map(cat => ({
    name: cat,
    count: items.filter(i => i.category === cat).length,
    value: items.filter(i => i.category === cat).reduce((acc, curr) => acc + (curr.price * curr.quantity), 0)
  })).filter(s => s.count > 0).sort((a, b) => b.value - a.value);

  const totalValue = categoryStats.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm text-center">
        <h3 className="text-gray-500 text-sm font-medium uppercase mb-1">Valor Total em Estoque</h3>
        <div className="text-3xl font-black text-primary">R$ {totalValue.toFixed(2)}</div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm">
        <h3 className="font-bold mb-4 flex items-center gap-2">Distribuição por Categoria (R$)</h3>
        <div className="space-y-4">
          {categoryStats.map((stat, idx) => (
            <div key={stat.name} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{stat.name}</span>
                <span className="text-gray-500">R$ {stat.value.toFixed(2)}</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-1000" 
                  style={{ width: `${(stat.value / totalValue * 100) || 0}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm">
        <h3 className="font-bold mb-4">Itens com Estoque Crítico</h3>
        <div className="space-y-2">
          {items.filter(i => i.quantity <= i.minStock).slice(0, 5).map(item => (
            <div key={item.id} className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <span className="text-sm font-medium">{item.name}</span>
              <span className="text-xs font-bold text-red-600">{item.quantity} {item.unit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryStats;
