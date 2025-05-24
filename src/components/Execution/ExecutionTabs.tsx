import React from 'react';
import clsx from 'clsx';
import { Code, Terminal, AppWindow, Globe } from 'lucide-react';
import { TabType } from '../../types';

interface ExecutionTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

interface TabItemProps {
  id: TabType;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const TabItem: React.FC<TabItemProps> = ({ id, label, icon, isActive, onClick }) => {
  return (
    <button
      className={clsx(
        'flex items-center gap-2 px-4 py-2 border-b-2 transition-all duration-200',
        isActive 
          ? 'border-primary-600 text-primary-700 font-medium'
          : 'border-transparent text-neutral-600 hover:text-neutral-800 hover:border-neutral-300'
      )}
      onClick={onClick}
      aria-selected={isActive}
      role="tab"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

const ExecutionTabs: React.FC<ExecutionTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'vscode' as TabType, label: 'VS Code', icon: <Code size={18} /> },
    { id: 'terminal' as TabType, label: 'Terminal', icon: <Terminal size={18} /> },
    { id: 'app' as TabType, label: 'App', icon: <AppWindow size={18} /> },
    { id: 'browser' as TabType, label: 'Browser', icon: <Globe size={18} /> },
  ];
  
  return (
    <div className="flex border-b border-neutral-200 bg-white">
      {tabs.map((tab) => (
        <TabItem
          key={tab.id}
          id={tab.id}
          label={tab.label}
          icon={tab.icon}
          isActive={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
        />
      ))}
    </div>
  );
};

export default ExecutionTabs;