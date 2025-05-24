import React, { useState } from 'react';
import ExecutionTabs from './ExecutionTabs';
import TabContent from './TabContent';
import { TabType } from '../../types';

interface ExecutionContainerProps {
  // Additional props as needed
}

const ExecutionContainer: React.FC<ExecutionContainerProps> = () => {
  const [activeTab, setActiveTab] = useState<TabType>('vscode');
  
  return (
    <div className="flex flex-col h-full border-l border-neutral-200">
      <ExecutionTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-hidden">
        <TabContent activeTab={activeTab} />
      </div>
    </div>
  );
};

export default ExecutionContainer;