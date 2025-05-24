import React from 'react';
import clsx from 'clsx';
import { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  isActive = false,
  onClick,
}) => {
  return (
    <button
      className={clsx(
        'w-full flex flex-col items-center justify-center py-3 px-2 relative',
        'transition-colors duration-200 ease-in-out',
        'hover:text-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        {
          'text-primary-600': isActive,
          'text-neutral-600': !isActive,
        }
      )}
      onClick={onClick}
      title={label}
      aria-label={label}
    >
      <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
      <span className="text-xs mt-1 font-medium">{label}</span>
      
      {isActive && (
        <span 
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-600 rounded-r"
          aria-hidden="true"
        />
      )}
    </button>
  );
};

export default SidebarItem;