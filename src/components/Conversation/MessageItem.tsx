import React from 'react';
import clsx from 'clsx';
import { TaskEvent } from '../../types';
import { formatExecutionTime } from '../../utils/formatters';

interface MessageItemProps {
  event: TaskEvent;
}

const MessageItem: React.FC<MessageItemProps> = ({ event }) => {
  // Render different content based on event type
  const renderContent = () => {
    switch (event.type) {
      case 'step':
        return (
          <div className="space-y-2">
            <div className="bg-neutral-100 p-3 rounded-md">
              <p className="text-sm font-medium text-neutral-700">Thought</p>
              <p className="text-neutral-800">{event.thought}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 bg-primary-100 text-primary-800 rounded">
                {event.action}
              </span>
            </div>
          </div>
        );
        
      case 'final_answer':
        return (
          <div className="space-y-3">
            <div className="bg-neutral-100 p-3 rounded-md">
              <p className="text-sm font-medium text-neutral-700">Thought</p>
              <p className="text-neutral-800">{event.thought}</p>
            </div>
            <div className="bg-primary-50 border border-primary-200 p-3 rounded-md">
              <p className="text-sm font-medium text-primary-800">Answer</p>
              <p className="text-neutral-800">{event.answer}</p>
            </div>
          </div>
        );
        
      case 'execution_time':
        return (
          <div className="flex items-center justify-between p-2 bg-neutral-50 rounded-md">
            <span className="text-sm text-neutral-600 font-medium">Execution Time</span>
            <span className="text-sm font-semibold text-neutral-800">{formatExecutionTime(event.time)}</span>
          </div>
        );
        
      case 'error':
        return (
          <div className="p-3 bg-error-50 border border-error-200 rounded-md">
            <p className="text-sm font-medium text-error-600">Error</p>
            <p className="text-neutral-800">{event.error}</p>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div 
      className={clsx(
        'p-4 border-b border-neutral-200 transition-all duration-300',
        'animate-[fadeIn_0.3s_ease-in-out]'
      )}
    >
      {renderContent()}
    </div>
  );
};

export default MessageItem;