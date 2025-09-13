'use client';

import { useState, useEffect } from 'react';
import { MessageList } from './message-list';
import { ChatInput } from './chat-input';
import { api } from '@/lib/api/trpc';

import { Message, ChatSession } from '@/types/chat';

type ChatContainerProps = {
  sessionId: string;
  initialMessages?: Message[];
};

export function ChatContainer({ sessionId, initialMessages = [] }: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const utils = api.useUtils();
  
  // Fetch messages with pagination
  const { data: messageData } = api.chat.getMessages.useQuery(
    {
      sessionId,
      limit: 20,
      cursor: null,
    },
    {
      enabled: !!sessionId,
    }
  );

  // Update messages when data changes
  useEffect(() => {
    if (messageData) {
      // Ensure messages match the expected type
      const typedMessages: Message[] = messageData.messages.map((msg: { id: string; role: string; content: string; timestamp: Date; sessionId: string }) => ({
        ...msg,
        role: msg.role === 'assistant' ? 'ai' : 'user' as const
      }));
      setMessages(typedMessages);
      setCursor(messageData.nextCursor ?? null);
      setHasMore(!!messageData.nextCursor);
    }
  }, [messageData]);
  
  // Load more messages when scrolling up
  const loadMoreMessages = async () => {
    if (!cursor || isLoadingMore) return;
    
    setIsLoadingMore(true);
    
    try {
      const moreMessages = await utils.chat.getMessages.fetch({
        sessionId,
        limit: 20,
        cursor,
      });
      
      setMessages((prev) => [...moreMessages.messages, ...prev]);
      setCursor(moreMessages.nextCursor || null);
      setHasMore(!!moreMessages.nextCursor);
    } catch (error) {
      console.error('Error loading more messages:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };
  
  // Send message mutation
  const sendMessageMutation = api.chat.sendMessage.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [...prev, data.userMessage, data.aiMessage]);
      setIsLoading(false);
      // Invalidate the query cache to refresh the session list
      utils.session.getAll.invalidate();
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      setIsLoading(false);
    },
  });

  const handleSendMessage = (content: string) => {
    if (!content.trim() || isLoading) return;

    // Optimistically add user message
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      content,
      role: 'user',
      timestamp: new Date(),
      sessionId
    };

    setMessages((prev) => [...prev, tempUserMessage]);
    setIsLoading(true);

    // Send message to API
    sendMessageMutation.mutate({
      content,
      sessionId,
    });
  };

  // Use effect to update messages when messageData changes
  useEffect(() => {
    if (messageData && messageData.messages.length > 0) {
      setMessages(messageData.messages);
      setCursor(messageData.nextCursor || null);
      setHasMore(!!messageData.nextCursor);
    }
  }, [messageData]);

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <div className="absolute inset-0 flex flex-col">
        <MessageList 
          messages={messages} 
          isLoading={isLoading} 
          hasMore={hasMore}
          onLoadMore={loadMoreMessages}
          isLoadingMore={isLoadingMore}
        />
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}