'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type MessageProps = {
  content: string;
  role: 'user' | 'ai';
  timestamp: Date;
};

export function Message({ content, role, timestamp }: MessageProps) {
  const isUser = role === 'user';
  const time = new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={cn(
        'flex w-full items-start gap-3 px-4 py-2',
        isUser ? 'justify-end' : 'justify-start',
      )}
    >
      {!isUser && (
        <Avatar className="h-7 w-7">
          <AvatarFallback>AI</AvatarFallback>
          <AvatarImage src="/ai-avatar.png" alt="AI" />
        </Avatar>
      )}

      <div
        className={cn(
          'flex max-w-[85%] flex-col gap-1 rounded-2xl px-4 py-2 shadow-sm',
          isUser
            ? 'rounded-tr-md bg-primary text-primary-foreground'
            : 'rounded-tl-md bg-muted/50',
        )}
      >
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
        <span className="text-[10px] opacity-60">{time}</span>
      </div>

      {isUser && (
        <Avatar className="h-7 w-7">
          <AvatarFallback>U</AvatarFallback>
          <AvatarImage src="/user-avatar.png" alt="User" />
        </Avatar>
      )}
    </div>
  );
}