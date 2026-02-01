
import React, { useState, useEffect } from 'react';
import { InventoryItem, Category, Unit } from '../types';
import { CATEGORIES, UNITS } from '../constants';
import { X, Save, DollarSign, StickyNote } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: any) => void;
  editingItem?: InventoryItem | null;
}

const AddItemModal: React.FC<Props> = ({ isOpen, onClose, onSave, editingItem }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: CATEGORIES[0],
    quantity: 1,
    unit: UNITS[0],
    price: 0,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    location: 'Despensa',
    minStock: 1,
    observation: ''
  });

  useEffect(() => {
    if (editingItem) setFormData({ ...editingItem });
    else setFormData({
        name: '', category: CATEGORIES[0], quantity: 1, unit: UNITS[0], price: 0,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        location: 'Despensa', minStock: 1, observation: ''
    });
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl h-[90vh] sm:h-auto overflow-hidden flex flex-col">
        <div className="p-4 bg-primary text-white flex justify-between items-center">
          <h2 className="font-bold text-lg">{editingItem ? 'Editar Item' : 'Novo Item'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full"><X /></button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); onClose(); }} className="p-6 space-y-5 overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome do Produto</label>
            <input required type="text" className="w-full p-3 rounded-xl bg-gray-100 dark:bg-slate-700 outline-none border-2 border-transparent focus:border-primary transition" 
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Qtd Atual</label>
              <input type="number" step="0.1" className="w-full p-3 rounded-xl bg-gray-100 dark:bg-slate-700 outline-none" 
                value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseFloat(e.target.value)})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Qtd Mínima</label>
              <input type="number" className="w-full p-3 rounded-xl bg-gray-100 dark:bg-slate-700 outline-none" 
                value={formData.minStock} onChange={e => setFormData({...formData, minStock: parseFloat(e.target.value)})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Preço Unitário (R$)</label>
              <input type="number" step="0.01" className="w-full p-3 rounded-xl bg-gray-100 dark:bg-slate-700 outline-none" 
                value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Unidade</label>
              <select className="w-full p-3 rounded-xl bg-gray-100 dark:bg-slate-700 outline-none"
                value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})}>
                {UNITS.map(u => <option key={u} value={u}>{u.toUpperCase()}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Observação</label>
            <textarea className="w-full p-3 rounded-xl bg-gray-100 dark:bg-slate-700 outline-none resize-none" rows={2}
              value={formData.observation} onChange={e => setFormData({...formData, observation: e.target.value})} placeholder="Ex: Marca preferida, local no armário..."></textarea>
          </div>

          <button type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg hover:bg-secondary transition active:scale-95 flex items-center justify-center gap-2">
            <Save size={20} /> Salvar Produto
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;
