import React, { useState } from 'react';
import { ShopGroup } from '../types';
import { PlusIcon, ShoppingBagIcon, SunIcon, MoonIcon, DownloadIcon } from './Icons';

interface ShopListProps {
  groups: ShopGroup[];
  onSelectGroup: (group: ShopGroup) => void;
  onCreateGroup: (name: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  installPromptAvailable: boolean;
  onInstallClick: () => void;
}

const ShopList: React.FC<ShopListProps> = ({ 
  groups, 
  onSelectGroup, 
  onCreateGroup, 
  theme, 
  onToggleTheme,
  installPromptAvailable,
  onInstallClick 
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newShopName, setNewShopName] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShopName.trim()) return;
    onCreateGroup(newShopName);
    setNewShopName('');
    setIsCreating(false);
  };

  // Sort by date descending (newest first)
  const sortedGroups = [...groups].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="flex flex-col h-full p-4 max-w-md mx-auto w-full">
      <div className="flex justify-between items-center mb-6 mt-2">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="bg-primary/10 text-primary p-2 rounded-lg">
            <ShoppingBagIcon className="w-6 h-6" />
          </span>
          GrocerTrack
        </h1>
        <div className="flex gap-2">
          {installPromptAvailable && (
            <button 
              onClick={onInstallClick}
              className="flex items-center gap-1 px-3 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium text-sm"
              title="Install App"
            >
              <DownloadIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Install</span>
            </button>
          )}
          <button 
            onClick={onToggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
          >
            {theme === 'light' ? <MoonIcon className="w-5 h-5"/> : <SunIcon className="w-5 h-5"/>}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {isCreating ? (
          <form onSubmit={handleCreate} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border-2 border-primary mb-4 animate-fade-in-down">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Shop Name</label>
            <input
              autoFocus
              type="text"
              value={newShopName}
              onChange={(e) => setNewShopName(e.target.value)}
              placeholder="e.g. Weekly Veggies"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none mb-3"
            />
            <div className="flex gap-2 justify-end">
              <button 
                type="button" 
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium shadow-md shadow-primary/20"
              >
                Create
              </button>
            </div>
          </form>
        ) : null}

        {sortedGroups.length === 0 && !isCreating ? (
          <div className="text-center mt-20 text-gray-400">
            <p className="mb-2">No shopping lists yet.</p>
            <p className="text-sm">Create one to get started!</p>
          </div>
        ) : (
          sortedGroups.map(group => {
            const itemCount = group.items.length;
            const subtotal = group.items.reduce((acc, i) => acc + (parseFloat(i.totalPaid) || 0), 0);
            
            return (
              <div 
                key={group.id}
                onClick={() => onSelectGroup(group)}
                className="group bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-3 cursor-pointer hover:border-primary/50 dark:hover:border-primary/50 transition-all active:scale-[0.98]"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white group-hover:text-primary transition-colors">
                    {group.name}
                  </h3>
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                    {new Date(group.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-md">
                    {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                  </span>
                  <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        
        {/* Attribution Footer */}
        <div className="mt-8 text-center">
          <a 
            href="http://omsurushe.bio.link/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block text-[10px] text-gray-400 dark:text-gray-600 hover:text-primary dark:hover:text-primary transition-colors tracking-widest uppercase font-semibold"
          >
            vibe coded by om surushe
          </a>
        </div>
      </div>

      {!isCreating && (
        <button
          onClick={() => setIsCreating(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-primary/40 flex items-center justify-center hover:bg-primary/90 active:scale-95 transition-transform"
        >
          <PlusIcon className="w-8 h-8" />
        </button>
      )}
    </div>
  );
};

export default ShopList;