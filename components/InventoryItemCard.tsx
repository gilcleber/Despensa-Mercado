import React from 'react';
import { InventoryItem, Unit } from '../types';
import { calculateStatus } from '../services/storageService';
import { Minus, Plus, Trash2, AlertTriangle, Calendar, MapPin } from 'lucide-react';

interface Props {
  item: InventoryItem;
  onUpdate: (id: string, data: Partial<InventoryItem>) => void;
  onDelete: (id: string) => void;
  onEdit: (item: InventoryItem) => void;
}

const InventoryItemCard: React.FC<Props> = ({ item, onUpdate, onDelete, onEdit }) => {
  const { isLowStock, isExpired, isExpiringSoon, diffDays } = calculateStatus(item);

  // Status Color Logic
  let statusBorder = 'border-l-4 border-l-emerald-500'; // Healthy
  if (isExpired) statusBorder = 'border-l-4 border-l-red-500';
  else if (isExpiringSoon || isLowStock) statusBorder = 'border-l-4 border-l-amber-500';

  const handleDecrement = () => {
    if (item.quantity > 0) {
      onUpdate(item.id, { quantity: item.quantity - 1 });
    }
  };

  const handleIncrement = () => {
    onUpdate(item.id, { quantity: item.quantity + 1 });
  };

  return (
    <div className={`relative bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 ${statusBorder} mb-3 transition-all hover:shadow-md`}>
      <div className="flex justify-between items-start mb-2">
        <div onClick={() => onEdit(item)} className="cursor-pointer flex-1">
          <h3 className="font-bold text-gray-800 dark:text-white text-lg">{item.name}</h3>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-2 mt-1">
            <span className="flex items-center gap-1 bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
               <MapPin size={10} /> {item.location}
            </span>
            <span className="flex items-center gap-1 bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
               {item.category}
            </span>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="flex items-center gap-1 bg-gray-50 dark:bg-slate-700 rounded-lg p-1">
          <button 
            onClick={handleDecrement}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-md transition"
            disabled={item.quantity <= 0}
          >
            <Minus size={16} />
          </button>
          <span className="min-w-[3rem] text-center font-bold text-gray-800 dark:text-white">
            {item.quantity} <span className="text-xs font-normal">{item.unit}</span>
          </span>
          <button 
            onClick={handleIncrement}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-md transition"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-2 text-xs">
          {isExpired ? (
            <span className="text-red-500 font-bold flex items-center gap-1">
              <AlertTriangle size={12} /> Vencido há {Math.abs(diffDays)} dias
            </span>
          ) : isExpiringSoon ? (
            <span className="text-amber-500 font-bold flex items-center gap-1">
              <Calendar size={12} /> Vence em {diffDays} dias
            </span>
          ) : (
            <span className="text-gray-400 flex items-center gap-1">
              <Calendar size={12} /> {new Date(item.expiryDate).toLocaleDateString('pt-BR')}
            </span>
          )}
        </div>

        <div className="flex gap-2">
            <button 
                onClick={() => onEdit(item)}
                className="text-xs text-blue-500 hover:underline"
            >
                Editar
            </button>
            <button 
                onClick={() => {
                    if(window.confirm('Tem certeza que deseja excluir este item?')) {
                        onDelete(item.id);
                    }
                }}
                className="text-xs text-red-500 hover:underline"
            >
                Excluir
            </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryItemCard;