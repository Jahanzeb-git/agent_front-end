import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import clsx from 'clsx';

interface UserInputProps {
  onSubmit: (query: string) => void;
  isDisabled?: boolean;
  placeholder?: string;
}

const UserInput: React.FC<UserInputProps> = ({
  onSubmit,
  isDisabled = false,
  placeholder = 'Enter your query...',
}) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200 // Max height
      )}px`;
    }
  }, [query]);
  
  const handleSubmit = () => {
    if (query.trim() && !isDisabled) {
      onSubmit(query.trim());
      setQuery('');
      setIsExpanded(false);
      
      // Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  
  return (
    <div
      className={clsx(
        'bg-white border border-neutral-300 rounded-lg transition-all duration-300 ease-in-out',
        'shadow-sm hover:shadow focus-within:shadow',
        isDisabled && 'opacity-60 cursor-not-allowed'
      )}
    >
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsExpanded(true)}
          onBlur={() => setIsExpanded(query.length > 0)}
          placeholder={placeholder}
          rows={1}
          className={clsx(
            'w-full py-3 px-4 resize-none bg-transparent',
            'text-neutral-800 placeholder-neutral-500',
            'focus:outline-none transition-all duration-200',
            {
              'min-h-[96px]': isExpanded,
              'min-h-[48px]': !isExpanded,
            }
          )}
          disabled={isDisabled}
        />
        
        <button
          className={clsx(
            'absolute right-3 bottom-3 p-2 rounded-full',
            'text-white bg-primary-600 hover:bg-primary-700',
            'transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
          )}
          onClick={handleSubmit}
          disabled={!query.trim() || isDisabled}
          aria-label="Send query"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default UserInput;