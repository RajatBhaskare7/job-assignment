'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SendIcon } from 'lucide-react';
import { useState, FormEvent, useRef, useEffect } from 'react';

type ChatInputProps = {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
};

export function ChatInput({ onSendMessage, isLoading = false }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  // Handle Enter to submit and Shift+Enter for new line
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (!e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky bottom-0 flex w-full items-end gap-2 border-t bg-background/80 p-4 backdrop-blur-sm"
    >
      <Textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="min-h-[40px] max-h-[200px] resize-none rounded-xl"
        disabled={isLoading}
      />
      <Button
        type="submit"
        size="icon"
        disabled={!message.trim() || isLoading}
        className="h-10 w-10 shrink-0 rounded-full"
      >
        <SendIcon className="h-4 w-4" />
      </Button>
    </form>
  );
}