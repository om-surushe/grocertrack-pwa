import React from 'react';
import { ShopGroup, ShopItem } from '../types';
import ItemRow from './ItemRow';
import { ChevronLeftIcon, PlusIcon, ShoppingBagIcon, TrashIcon } from './Icons';

// Simple ID generator to avoid heavy dependencies if possible, 
// but for robustness in code we can just use Date.now() + random in a real tiny app
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

interface ShopDetailProps {
  group: ShopGroup;
  onBack: () => void;
  onUpdateGroup: (updatedGroup: ShopGroup) => void;
  onDeleteGroup: (id: string) => void;
}

const ShopDetail: React.FC<ShopDetailProps> = ({ group, onBack, onUpdateGroup, onDeleteGroup }) => {
  
  const addItem = () => {
    const newItem: ShopItem = {
      id: generateId(),
      name: '',
      unitType: 'kg',
      pricePerUnit: '',
      amount: '',
      totalPaid: '',
      isCompleted: false,
      timestamp: Date.now(),
    };
    onUpdateGroup({
      ...group,
      updatedAt: Date.now(),
      items: [...group.items, newItem]
    });
  };

  const updateItem = (itemId: string, updates: Partial<ShopItem>) => {
    const newItems = group.items.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    );
    onUpdateGroup({
      ...group,
      updatedAt: Date.now(),
      items: newItems
    });
  };

  const deleteItem = (itemId: string) => {
    onUpdateGroup({
      ...group,
      updatedAt: Date.now(),
      items: group.items.filter(i => i.id !== itemId)
    });
  };

  const calculateSubtotal = () => {
    return group.items.reduce((acc, item) => {
      const val = parseFloat(item.totalPaid);
      return acc + (isNaN(val) ? 0 : val);
    }, 0);
  };

  const confirmDelete = () => {
    if (confirm("Delete this entire shopping list?")) {
      onDeleteGroup(group.id);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-950">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <div className="flex-1 text-center">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white truncate max-w-[200px] mx-auto">
            {group.name}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(group.createdAt).toLocaleDateString()}
          </p>
        </div>
        <button 
          onClick={confirmDelete}
          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-32 no-scrollbar">
        {group.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 mt-10">
            <ShoppingBagIcon className="w-16 h-16 mb-4 opacity-20" />
            <p>No items yet.</p>
            <p className="text-sm">Tap the + button to add one.</p>
          </div>
        ) : (
          group.items.map(item => (
            <ItemRow 
              key={item.id} 
              item={item} 
              onUpdate={updateItem}
              onDelete={deleteItem}
            />
          ))
        )}
      </div>

      {/* Sticky Bottom Summary & FAB */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent dark:from-gray-950 dark:via-gray-950 pointer-events-none">
        <div className="flex items-center justify-between gap-4 pointer-events-auto max-w-md mx-auto">
          <div className="bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 rounded-2xl px-5 py-3 flex-1 flex flex-col">
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-bold">Subtotal</span>
            <span className="text-2xl font-bold text-primary">₹{calculateSubtotal().toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>

          <button
            onClick={addItem}
            className="w-14 h-14 bg-primary text-white rounded-2xl shadow-lg shadow-primary/30 flex items-center justify-center active:scale-95 transition-transform hover:bg-primary/90"
          >
            <PlusIcon className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopDetail;