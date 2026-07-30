import React, { useState, useEffect } from 'react';
import { ShopGroup, ViewState } from './types';
import { loadShopGroups, saveShopGroups, loadTheme, saveTheme } from './services/storage';
import ShopList from './components/ShopList';
import ShopDetail from './components/ShopDetail';

// Helper ID gen
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

const App: React.FC = () => {
  const [groups, setGroups] = useState<ShopGroup[]>([]);
  const [view, setView] = useState<ViewState>('LIST');
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Initialization
  useEffect(() => {
    const savedGroups = loadShopGroups();
    setGroups(savedGroups);
    
    const savedTheme = loadTheme();
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }

  }, []);

  // Persistence Effects
  useEffect(() => {
    saveShopGroups(groups);
  }, [groups]);

  useEffect(() => {
    saveTheme(theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Handlers
  const handleCreateGroup = (name: string) => {
    const newGroup: ShopGroup = {
      id: generateId(),
      name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      items: []
    };
    const updatedGroups = [...groups, newGroup];
    setGroups(updatedGroups);
    // Auto open the new group
    setActiveGroupId(newGroup.id);
    setView('DETAIL');
  };

  const handleUpdateGroup = (updatedGroup: ShopGroup) => {
    setGroups(prev => prev.map(g => g.id === updatedGroup.id ? updatedGroup : g));
  };

  const handleDeleteGroup = (id: string) => {
    setGroups(prev => prev.filter(g => g.id !== id));
    setView('LIST');
    setActiveGroupId(null);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // View Logic
  const activeGroup = groups.find(g => g.id === activeGroupId);

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      {view === 'LIST' ? (
        <ShopList 
          groups={groups} 
          onSelectGroup={(g) => {
            setActiveGroupId(g.id);
            setView('DETAIL');
          }}
          onCreateGroup={handleCreateGroup}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      ) : activeGroup ? (
        <ShopDetail 
          group={activeGroup}
          onBack={() => setView('LIST')}
          onUpdateGroup={handleUpdateGroup}
          onDeleteGroup={handleDeleteGroup}
        />
      ) : (
        // Fallback if active group not found (deleted/error)
        <div className="flex items-center justify-center h-full">
          <button onClick={() => setView('LIST')} className="text-primary">Return to List</button>
        </div>
      )}
    </div>
  );
};

export default App;