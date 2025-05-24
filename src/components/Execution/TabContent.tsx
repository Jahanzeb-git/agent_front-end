import React from 'react';
import { Code, Terminal, Globe, AppWindow } from 'lucide-react';
import { TabType } from '../../types';

interface TabContentProps {
  activeTab: TabType;
}

const TabContent: React.FC<TabContentProps> = ({ activeTab }) => {
  // Placeholder content for each tab
  const renderContent = () => {
    switch (activeTab) {
      case 'vscode':
        return (
          <div className="flex flex-col items-center justify-center h-full bg-[#1e1e1e] text-white">
            <Code size={48} className="mb-4 opacity-40" />
            <h3 className="text-xl font-medium mb-2">VS Code Editor</h3>
            <p className="text-neutral-400 text-center max-w-md">
              Code editor integration will be implemented here
            </p>
          </div>
        );
        
      case 'terminal':
        return (
          <div className="flex flex-col items-center justify-center h-full bg-[#121212] text-white">
            <Terminal size={48} className="mb-4 opacity-40" />
            <h3 className="text-xl font-medium mb-2">Terminal</h3>
            <p className="text-neutral-400 text-center max-w-md">
              Terminal integration will be implemented here
            </p>
          </div>
        );
        
      case 'app':
        return (
          <div className="flex flex-col items-center justify-center h-full bg-white">
            <AppWindow size={48} className="mb-4 text-neutral-400" />
            <h3 className="text-xl font-medium text-neutral-800 mb-2">Application Preview</h3>
            <p className="text-neutral-600 text-center max-w-md">
              Application preview will be displayed here
            </p>
          </div>
        );
        
      case 'browser':
        return (
          <div className="flex flex-col items-center justify-center h-full bg-white">
            <Globe size={48} className="mb-4 text-neutral-400" />
            <h3 className="text-xl font-medium text-neutral-800 mb-2">Browser</h3>
            <p className="text-neutral-600 text-center max-w-md">
              Web browser integration will be implemented here
            </p>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="h-full overflow-hidden">
      {renderContent()}
    </div>
  );
};

export default TabContent;