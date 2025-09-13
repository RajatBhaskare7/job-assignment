'use client';

import { useEffect, useRef, useState } from 'react';
import { Message } from './message';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ChevronUp } from 'lucide-react';

type MessageType = {
  id: string;
  content: string;
  role: 'user' | 'ai';
  timestamp: Date;
};

type MessageListProps = {
  messages: MessageType[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
};

export function MessageList({
  messages,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  isLoadingMore = false,
}: MessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Auto-scroll to bottom when new messages arrive if autoScroll is enabled
  useEffect(() => {
    if (!autoScroll) return;
    
    const scrollArea = scrollAreaRef.current;
    if (scrollArea) {
      const scrollContainer = scrollArea.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, autoScroll]);
  
  // Handle manual scroll to detect when user scrolls up
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 100;
    setAutoScroll(isAtBottom);
  };

  return (
    <ScrollArea 
      ref={scrollAreaRef} 
      className="flex-1 overflow-y-auto pb-20 pt-4 md:pb-8"
      onScroll={handleScroll}
    >
      <div className="flex flex-col gap-4">
        {hasMore && (
          <div className="flex justify-center py-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onLoadMore}
              disabled={isLoadingMore}
              className="flex items-center gap-1"
            >
              {isLoadingMore ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
              {isLoadingMore ? 'Loading...' : 'Load more'}
            </Button>
          </div>
        )}
        
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-center text-muted-foreground">
              No messages yet. Start a conversation!
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <Message
              key={message.id}
              content={message.content}
              role={message.role}
              timestamp={message.timestamp}
            />
          ))
        )}

        {isLoading && (
          <div className="flex items-center gap-2 self-start rounded-lg bg-muted p-4 text-sm">
            <div className="flex space-x-1">
              <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground delay-75"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground delay-150"></div>
            </div>
            <span className="text-xs text-muted-foreground">AI is thinking...</span>
          </div>
        )}
        
        {!autoScroll && messages.length > 0 && (
          <Button
            className="fixed bottom-24 right-4 z-10 rounded-full shadow-lg md:bottom-8"
            size="icon"
            onClick={() => {
              setAutoScroll(true);
              const scrollArea = scrollAreaRef.current;
              if (scrollArea) {
                const scrollContainer = scrollArea.querySelector('[data-radix-scroll-area-viewport]');
                if (scrollContainer) {
                  scrollContainer.scrollTop = scrollContainer.scrollHeight;
                }
              }
            }}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        )}
      </div>
    </ScrollArea>
  );
}