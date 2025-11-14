import React from 'react';
import { SearchMode } from '../types';

interface TabsProps {
  activeTab: SearchMode;
  setActiveTab: (tab: SearchMode) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  const getButtonClass = (tab: SearchMode) => {
    const baseClasses = "flex-1 py-3 px-4 text-center font-semibold rounded-t-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500";
    if (activeTab === tab) {
      return `${baseClasses} bg-white text-orange-700 shadow-inner`;
    }
    return `${baseClasses} bg-slate-200 text-slate-600 hover:bg-slate-300`;
  };

  return (
    <div className="flex bg-slate-200 rounded-t-lg overflow-hidden">
      <button
        className={getButtonClass(SearchMode.BY_INGREDIENTS)}
        onClick={() => setActiveTab(SearchMode.BY_INGREDIENTS)}
      >
        Buscar por Ingredientes
      </button>
      <button
        className={getButtonClass(SearchMode.BY_NAME)}
        onClick={() => setActiveTab(SearchMode.BY_NAME)}
      >
        Buscar por Nome da Receita
      </button>
    </div>
  );
};

export default Tabs;