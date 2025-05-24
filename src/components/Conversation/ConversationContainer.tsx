import React, { useEffect } from 'react';
import MessageItem from './MessageItem';
import UserInput from './UserInput';
import StatusIndicator from './StatusIndicator';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import { useSession } from '../../contexts/SessionContext';
import { Task } from '../../types';
import { SSEHandler } from '../../services/sseHandler';
import { useTaskStore } from '../../store/taskStore';

interface ConversationContainerProps {
  task?: Task | null;
}

const ConversationContainer: React.FC<ConversationContainerProps> = ({ task }) => {
  const { session } = useSession();
  const { addEventToTask, setTaskStatus } = useTaskStore();
  const messagesRef = useAutoScroll<HTMLDivElement>({ 
    enabled: true,
    smooth: true,
    threshold: 150
  });
  
  // Initialize SSE handler
  const handleSubmitQuery = (query: string) => {
    if (!session || !session.id) {
      console.error('No active session');
      return;
    }
    
    // Create a new task
    const taskId = useTaskStore.getState().createTask(query);
    
    // Create SSE handler
    const sseHandler = new SSEHandler({
      onEvent: (event) => {
        addEventToTask(taskId, event);
      },
      onError: (error) => {
        console.error('SSE error:', error);
        setTaskStatus(taskId, 'error');
        addEventToTask(taskId, { type: 'error', error });
      },
      onClose: () => {
        console.log('SSE connection closed');
      },
    });
    
    // Connect using fetch implementation
    sseHandler.connectWithFetch(session.id, query);
  };
  
  // Display empty state if no task
  if (!task) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-neutral-50">
          <h2 className="text-2xl font-semibold text-neutral-800 mb-2">No Active Task</h2>
          <p className="text-neutral-600 text-center max-w-md mb-8">
            Enter a query below to start a new conversation with the AI agent.
          </p>
        </div>
        
        <div className="p-4 border-t border-neutral-200">
          <UserInput onSubmit={handleSubmitQuery} />
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Task query */}
      <div className="p-4 border-b border-neutral-200 bg-white">
        <h2 className="font-medium text-neutral-900 mb-1">Query</h2>
        <p className="text-neutral-800">{task.query}</p>
      </div>
      
      {/* Conversation messages */}
      <div 
        ref={messagesRef}
        className="flex-1 overflow-y-auto"
      >
        {task.events.length === 0 ? (
          <div className="flex items-center justify-center h-full p-8">
            <p className="text-neutral-500 italic">Waiting for response...</p>
          </div>
        ) : (
          task.events.map((event, index) => (
            <MessageItem key={index} event={event} />
          ))
        )}
      </div>
      
      {/* Status indicator */}
      <div className="px-4 py-2 border-t border-neutral-200 bg-white">
        <StatusIndicator status={task.status} />
      </div>
      
      {/* User input */}
      <div className="p-4 border-t border-neutral-200 bg-white">
        <UserInput 
          onSubmit={handleSubmitQuery}
          isDisabled={task.status === 'running'}
          placeholder={task.status === 'running' ? 'Please wait...' : 'Enter your query...'}
        />
      </div>
    </div>
  );
};

export default ConversationContainer;