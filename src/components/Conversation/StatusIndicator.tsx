import React from 'react';
import clsx from 'clsx';

type StatusType = 'running' | 'waiting' | 'stopped' | 'error';

interface StatusIndicatorProps {
  status: StatusType;
  className?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, className }) => {
  // Determine the color based on status
  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case 'running':
        return 'bg-success-500';
      case 'waiting':
        return 'bg-warning-500';
      case 'error':
        return 'bg-error-500';
      case 'stopped':
      default:
        return 'bg-neutral-500';
    }
  };
  
  // Determine if it should pulse
  const shouldPulse = status === 'running' || status === 'waiting';
  
  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <span
        className={clsx(
          'h-2.5 w-2.5 rounded-full',
          getStatusColor(status),
          { 'animate-pulse-slow': shouldPulse }
        )}
        aria-hidden="true"
      />
      <span className="text-xs text-neutral-600 font-medium">
        {status === 'running' && 'Running'}
        {status === 'waiting' && 'Waiting for input'}
        {status === 'stopped' && 'Completed'}
        {status === 'error' && 'Error'}
      </span>
    </div>
  );
};

export default StatusIndicator;