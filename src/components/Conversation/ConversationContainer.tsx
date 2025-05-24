import React, { useEffect, useState } from 'react';
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
  const { getCurrentSessionId, error: sessionError } = useSession();
  const { addEventToTask, setTaskStatus } = useTaskStore();
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const messagesRef = useAutoScroll<HTMLDivElement>({ 
    enabled: true,
    smooth: true,
    threshold: 150
  });
  
  // Handle query submission
  const handleSubmitQuery = async (query: string) => {
    const sessionId = getCurrentSessionId();
    
    if (!sessionId) {
      setConnectionError('No active session found. Please refresh the page.');
      return;
    }
    
    // Clear any previous errors
    setConnectionError(null);
    setIsConnecting(true);
    
    // Create a new task
    const taskId = useTaskStore.getState().createTask(query);
    setTaskStatus(taskId, 'running');
    
    // Create SSE handler
    const sseHandler = new SSEHandler({
      onConnectionStart: () => {
        setIsConnecting(false);
        setTaskStatus(taskId, 'running');
      },
      onEvent: (event) => {
        addEventToTask(taskId, event);
        
        // Update task status based on event type
        if (event.type === 'final_answer' || event.type === 'execution_time') {
          setTaskStatus(taskId, 'completed');
        }
      },
      onError: (error) => {
        console.error('SSE error:', error);
        setConnectionError(error);
        setTaskStatus(taskId, 'error');
        addEventToTask(taskId, { type: 'error', error });
        setIsConnecting(false);
      },
      onClose: () => {
        console.log('SSE connection closed');
        setIsConnecting(false);
        
        // Set to completed if not already in error state
        const currentTask = useTaskStore.getState().tasks.find(t => t.id === taskId);
        if (currentTask && currentTask.status === 'running') {
          setTaskStatus(taskId, 'completed');
        }
      },
    });
    
    // Connect using fetch implementation
    try {
      await sseHandler.connectWithFetch(sessionId, query);
    } catch (error) {
      console.error('Failed to initiate connection:', error);
      setConnectionError('Failed to connect to server');
      setTaskStatus(taskId, 'error');
      setIsConnecting(false);
    }
  };
  
  // Display empty state if no task
  if (!task) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4v-4z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Ready to Help</h2>
            <p className="text-gray-600 mb-6">
              I'm an AI agent that can help you with various tasks. Ask me anything!
            </p>
            
            {(sessionError || connectionError) && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">
                  {sessionError || connectionError}
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4 bg-white border-t border-gray-200">
          <UserInput 
            onSubmit={handleSubmitQuery}
            isDisabled={isConnecting}
            placeholder={isConnecting ? "Connecting..." : "Ask me anything..."}
          />
        </div>
      </div>
    );
  }
  
  const getTaskStatus = () => {
    if (isConnecting) return 'connecting';
    return task.status;
  };
  
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Task query header with status */}
      <div className="p-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-600 mb-1">Your Query</h3>
              <p className="text-gray-800 text-sm leading-relaxed">{task.query}</p>
            </div>
          </div>
          <StatusIndicator status={getTaskStatus()} />
        </div>
      </div>
      
      {/* Conversation messages */}
      <div 
        ref={messagesRef}
        className="flex-1 overflow-y-auto bg-gray-50"
      >
        {task.events.length === 0 && !isConnecting ? (
          <div className="flex items-center justify-center h-full p-8">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-3"></div>
              <p className="text-gray-500 text-sm">Waiting for response...</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {task.events.map((event, index) => (
              <MessageItem 
                key={index} 
                event={event} 
                isLatest={index === task.events.length - 1}
              />
            ))}
          </div>
        )}
        
        {connectionError && (
          <div className="p-4">
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-red-600 mb-2">Connection Error</p>
                  <p className="text-gray-800 text-sm leading-relaxed">{connectionError}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationContainer;