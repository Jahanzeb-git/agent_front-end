import React from 'react';
import { Bot, History, Book, Settings, User, Plus } from 'lucide-react';
import SidebarItem from './SidebarItem';
import { useSession } from '../../contexts/SessionContext';

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onItemClick }) => {
  const { resetSession } = useSession();
  
  const handleNewSession = async () => {
    await resetSession();
    onItemClick('new');
  };
  
  return (
    <div className="h-sidebar flex flex-col bg-white border-r border-neutral-200">
      <div className="flex items-center justify-center h-16 border-b border-neutral-200">
        <Bot size={32} className="text-primary-600" />
      </div>
      
      <div className="flex flex-col flex-1 py-4">
        <SidebarItem 
          icon={Plus} 
          label="New" 
          isActive={activeItem === 'new'}
          onClick={handleNewSession}
        />
        <SidebarItem 
          icon={History} 
          label="History" 
          isActive={activeItem === 'history'}
          onClick={() => onItemClick('history')}
        />
        <SidebarItem 
          icon={Book} 
          label="Docs" 
          isActive={activeItem === 'docs'}
          onClick={() => onItemClick('docs')}
        />
        <SidebarItem 
          icon={Settings} 
          label="Settings" 
          isActive={activeItem === 'settings'}
          onClick={() => onItemClick('settings')}
        />
      </div>
      
      <div className="py-4 border-t border-neutral-200">
        <SidebarItem 
          icon={User} 
          label="Profile" 
          isActive={activeItem === 'profile'}
          onClick={() => onItemClick('profile')}
        />
      </div>
    </div>
  );
};

export default Sidebar;