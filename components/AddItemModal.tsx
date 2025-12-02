import React, { useState, useEffect } from 'react';
import { InventoryItem, Category, Unit } from '../types';
import { CATEGORIES, UNITS } from '../constants';
import { X, Save } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<InventoryItem, 'id' | 'addedAt' | 'updatedAt'>) => void;
  editingItem?: InventoryItem | null;
}

const AddItemModal: React.FC<Props> = ({ isOpen, onClose, onSave, editingItem }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: CATEGORIES[0],
    quantity: 1,
    unit: UNITS[0],
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default +30 days
    location: 'Despensa',
    minStock: 1
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        category: editingItem.category as Category,
        quantity: editingItem.quantity,
        unit: editingItem.unit as Unit,
        expiryDate: editingItem.expiryDate,
        location: editingItem.location,
        minStock: editingItem.minStock
      });
    } else {
        // Reset defaults
        setFormData({
            name: '',
            category: CATEGORIES[0],
            quantity: 1,
            unit: UNITS[0],
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            location: 'Despensa',
            minStock: 1
        });
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
        
        <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-slate-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {editingItem ? 'Editar Item' : 'Novo Item'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[70vh] overflow-y-auto no-scrollbar">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome</label>
            <input 
              required
              type="text" 
              className="w-full p-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary outline-none transition"
              placeholder="Ex: Arroz Branco"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoria</label>
              <select 
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white outline-none"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value as Category})}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Local</label>
               <input 
                type="text"
                list="locations"
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white outline-none"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
               />
               <datalist id="locations">
                 <option value="Despensa"/>
                 <option value="Geladeira"/>
                 <option value="Armário"/>
               </datalist>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Qtd</label>
              <input 
                type="number"
                min="0"
                step="0.1"
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white text-center font-bold outline-none"
                value={formData.quantity}
                onChange={e => setFormData({...formData, quantity: parseFloat(e.target.value)})}
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unidade</label>
              <select 
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white outline-none"
                value={formData.unit}
                onChange={e => setFormData({...formData, unit: e.target.value as Unit})}
              >
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
             <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Min.</label>
              <input 
                type="number"
                min="0"
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white text-center outline-none"
                value={formData.minStock}
                onChange={e => setFormData({...formData, minStock: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Validade</label>
             <input 
                type="date"
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white outline-none"
                value={formData.expiryDate}
                onChange={e => setFormData({...formData, expiryDate: e.target.value})}
              />
          </div>

          <button 
            type="submit"
            className="w-full py-4 mt-4 bg-primary hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg transform transition active:scale-95 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Salvar Item
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;