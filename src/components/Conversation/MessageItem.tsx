import React from 'react';
import clsx from 'clsx';
import { TaskEvent } from '../../types';
import { formatExecutionTime } from '../../utils/formatters';

interface MessageItemProps {
  event: TaskEvent;
  isLatest?: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ event, isLatest = false }) => {
  // Get status indicator color based on event type
  const getStatusColor = (type: string) => {
    switch (type) {
      case 'step':
        return 'bg-blue-500';
      case 'final_answer':
        return 'bg-green-500';
      case 'execution_time':
        return 'bg-gray-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  // Render different content based on event type
  const renderContent = () => {
    switch (event.type) {
      case 'step':
        return (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex items-start gap-3">
                <div className={clsx(
                  'w-2 h-2 rounded-full mt-2 flex-shrink-0',
                  getStatusColor(event.type)
                )} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-600 mb-2">Thinking</p>
                  <p className="text-gray-800 text-sm leading-relaxed">{event.thought}</p>
                </div>
              </div>
            </div>
            
            {event.action && (
              <div className="flex items-center gap-2 ml-5">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Action: {event.action}
                </span>
              </div>
            )}
          </div>
        );
        
      case 'final_answer':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex items-start gap-3">
                <div className={clsx(
                  'w-2 h-2 rounded-full mt-2 flex-shrink-0',
                  getStatusColor(event.type)
                )} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-600 mb-2">Final Thought</p>
                  <p className="text-gray-800 text-sm leading-relaxed">{event.thought}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-green-700 mb-2">Answer</p>
                  <p className="text-gray-800 text-sm leading-relaxed">{event.answer}</p>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'execution_time':
        return (
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={clsx(
                  'w-2 h-2 rounded-full',
                  getStatusColor(event.type)
                )} />
                <span className="text-sm font-medium text-gray-600">Execution completed</span>
              </div>
              <span className="text-sm font-semibold text-gray-800">
                {formatExecutionTime(event.time)}
              </span>
            </div>
          </div>
        );
        
      case 'error':
        return (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <div className={clsx(
                'w-2 h-2 rounded-full mt-2 flex-shrink-0',
                getStatusColor(event.type)
              )} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-red-700 mb-2">Error</p>
                <p className="text-gray-800 text-sm leading-relaxed">{event.error}</p>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div 
      className={clsx(
        'p-4 transition-all duration-500 ease-out',
        isLatest && 'animate-[slideInFromBottom_0.4s_ease-out]',
        'border-b border-gray-100 last:border-b-0'
      )}
    >
      {renderContent()}
    </div>
  );
};

export default MessageItem;