import { TaskEvent } from '../types';

interface SSEHandlerOptions {
  onEvent: (event: TaskEvent) => void;
  onError: (error: string) => void;
  onClose?: () => void;
}

export class SSEHandler {
  private eventSource: EventSource | null = null;
  private options: SSEHandlerOptions;

  constructor(options: SSEHandlerOptions) {
    this.options = options;
  }

  public connect(url: string): void {
    // Close any existing connection
    this.close();

    try {
      // Create a new connection
      this.eventSource = new EventSource(url);

      // Handle incoming messages
      this.eventSource.onmessage = (event) => {
        try {
          // Parse the event data
          const data = JSON.parse(event.data);
          this.options.onEvent(data);
        } catch (error) {
          console.error('Error parsing SSE event:', error);
          this.options.onError('Failed to parse streaming data');
        }
      };

      // Handle errors
      this.eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        this.options.onError('Connection error, please try again');
        this.close();
      };
    } catch (error) {
      console.error('Failed to establish SSE connection:', error);
      this.options.onError('Failed to connect to the server');
    }
  }

  public close(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      
      if (this.options.onClose) {
        this.options.onClose();
      }
    }
  }

  public connectWithFetch(sessionId: string, query: string): void {
    const controller = new AbortController();
    const { signal } = controller;

    fetch('http://localhost:5001/Query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        query: query,
      }),
      signal,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('Response body is not readable');
        }
        
        const decoder = new TextDecoder();
        let buffer = '';
        
        const processStream = () => {
          reader.read().then(({ done, value }) => {
            if (done) {
              if (this.options.onClose) {
                this.options.onClose();
              }
              return;
            }
            
            buffer += decoder.decode(value, { stream: true });
            
            // Process each complete "data:" line
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // Keep the last incomplete line in the buffer
            
            for (const line of lines) {
              if (line.startsWith('data:')) {
                try {
                  const data = JSON.parse(line.substring(5).trim());
                  this.options.onEvent(data);
                } catch (error) {
                  console.error('Error parsing SSE line:', error);
                }
              }
            }
            
            processStream();
          }).catch(error => {
            console.error('Error reading stream:', error);
            this.options.onError('Error reading response stream');
          });
        };
        
        processStream();
      })
      .catch(error => {
        console.error('Fetch error:', error);
        this.options.onError(`Connection error: ${error.message}`);
      });
  }
}