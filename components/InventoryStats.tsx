import React from 'react';
import { InventoryItem, Category } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface Props {
  items: InventoryItem[];
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

const InventoryStats: React.FC<Props> = ({ items }) => {
  // Group by category
  const categoryData = Object.values(Category).map(cat => {
    return {
      name: cat,
      value: items.filter(i => i.category === cat).length
    };
  }).filter(d => d.value > 0);

  // Expiring soon logic
  const now = new Date();
  const expiringItems = items
    .filter(i => {
       const exp = new Date(i.expiryDate);
       const diff = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
       return diff <= 30 && diff >= -5; // expiring in next 30 days or recently expired
    })
    .map(i => ({
      name: i.name,
      days: Math.ceil((new Date(i.expiryDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    }))
    .sort((a, b) => a.days - b.days)
    .slice(0, 5);

  return (
    <div className="p-4 space-y-6 pb-24">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Análise de Estoque</h2>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Distribuição por Categoria</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                 contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Vencimento Próximo (Dias)</h3>
        {expiringItems.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expiringItems} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#475569" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="days" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Nenhum item vencendo em breve!</p>
        )}
      </div>
    </div>
  );
};

export default InventoryStats;