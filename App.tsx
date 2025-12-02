import React, { useState, useEffect, useMemo } from 'react';
import { InventoryItem, FilterState, Category } from './types';
import { getItems, addItem, updateItem, deleteItem } from './services/storageService';
import { NAV_ITEMS, CATEGORIES } from './constants';
import InventoryItemCard from './components/InventoryItemCard';
import AddItemModal from './components/AddItemModal';
import ShoppingList from './components/ShoppingList';
import RecipeSuggester from './components/RecipeSuggester';
import InventoryStats from './components/InventoryStats';
import { Search, Filter, SlidersHorizontal, Sun, Moon, Plus } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [view, setView] = useState('inventory');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    onlyLowStock: false,
    onlyExpiring: false,
  });
  const [showFilters, setShowFilters] = useState(false);

  // Initial Load
  useEffect(() => {
    setItems(getItems());
    
    // Check system preference for theme
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  // Theme Effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Derived State: Filtered & Sorted Items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(filters.search.toLowerCase()) || 
                            item.location.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = filters.category ? item.category === filters.category : true;
      
      let matchesStatus = true;
      if (filters.onlyLowStock) matchesStatus = matchesStatus && item.quantity <= item.minStock;
      
      // Expiring logic repeats slightly from Service, but kept simple here for filter
      const daysUntilExpiry = Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (86400000));
      if (filters.onlyExpiring) matchesStatus = matchesStatus && daysUntilExpiry <= 30;

      return matchesSearch && matchesCategory && matchesStatus;
    }).sort((a, b) => b.quantity - a.quantity); // Requirements: Higher quantity on top
  }, [items, filters]);

  // Handlers
  const handleAddItem = (data: any) => {
    if (editingItem) {
      const updated = updateItem(editingItem.id, data);
      setItems(updated);
      setEditingItem(null);
    } else {
      const updated = addItem(data);
      setItems(updated);
    }
  };

  const handleUpdateItem = (id: string, updates: Partial<InventoryItem>) => {
    const updated = updateItem(id, updates);
    setItems(updated);
  };

  const handleDeleteItem = (id: string) => {
    const updated = deleteItem(id);
    setItems(updated);
  };

  const openEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 px-4 py-3 shadow-sm transition-colors">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
            Despensa Smart
          </h1>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-yellow-400 transition"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Search Bar (Only on inventory view) */}
        {view === 'inventory' && (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="Buscar item..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-slate-800 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/50 transition"
                value={filters.search}
                onChange={(e) => setFilters(p => ({...p, search: e.target.value}))}
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-xl transition ${showFilters ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300'}`}
            >
              <SlidersHorizontal size={20} />
            </button>
          </div>
        )}

        {/* Expandable Filters */}
        {view === 'inventory' && showFilters && (
          <div className="mt-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 animate-in slide-in-from-top-2">
            <div className="flex flex-wrap gap-2">
              <select 
                className="p-2 text-sm rounded-lg bg-gray-50 dark:bg-slate-700 border-none outline-none dark:text-white"
                value={filters.category}
                onChange={(e) => setFilters(p => ({...p, category: e.target.value}))}
              >
                <option value="">Todas Categorias</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              
              <button 
                onClick={() => setFilters(p => ({...p, onlyLowStock: !p.onlyLowStock}))}
                className={`px-3 py-2 text-xs font-bold rounded-lg transition ${filters.onlyLowStock ? 'bg-red-100 text-red-600' : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400'}`}
              >
                Estoque Baixo
              </button>
              
              <button 
                onClick={() => setFilters(p => ({...p, onlyExpiring: !p.onlyExpiring}))}
                className={`px-3 py-2 text-xs font-bold rounded-lg transition ${filters.onlyExpiring ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400'}`}
              >
                Vencendo
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto pt-4 px-4">
        {view === 'inventory' && (
          <div className="space-y-1">
            {filteredItems.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <Filter size={48} className="mx-auto mb-4 opacity-20" />
                <p>Nenhum item encontrado.</p>
              </div>
            ) : (
              filteredItems.map(item => (
                <InventoryItemCard 
                  key={item.id} 
                  item={item} 
                  onUpdate={handleUpdateItem}
                  onDelete={handleDeleteItem}
                  onEdit={openEdit}
                />
              ))
            )}
          </div>
        )}

        {view === 'shopping' && (
          <ShoppingList items={items} onUpdate={handleUpdateItem} />
        )}

        {view === 'recipes' && (
          <RecipeSuggester items={items} />
        )}

        {view === 'stats' && (
          <InventoryStats items={items} />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 flex justify-around items-center py-2 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
        {NAV_ITEMS.map((nav) => {
          const Icon = nav.icon;
          const isActive = view === nav.id;

          // Special case for Add button
          if (nav.id === 'add') {
             return (
               <button 
                 key={nav.id}
                 onClick={() => {
                   setEditingItem(null);
                   setIsModalOpen(true);
                 }}
                 className="relative -top-5 bg-primary text-white p-4 rounded-full shadow-lg shadow-emerald-500/30 transform transition active:scale-90"
               >
                 <Plus size={24} />
               </button>
             )
          }

          return (
            <button
              key={nav.id}
              onClick={() => setView(nav.id)}
              className={`flex flex-col items-center gap-1 p-2 min-w-[64px] transition ${
                isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{nav.label}</span>
            </button>
          );
        })}
      </nav>

      <AddItemModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddItem}
        editingItem={editingItem}
      />
    </div>
  );
};

export default App;