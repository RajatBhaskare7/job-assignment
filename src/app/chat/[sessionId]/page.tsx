'use client';

import { ChatContainer } from '@/components/chat/chat-container';
import { api } from '@/lib/api/trpc';
import { useParams } from 'next/navigation';

export default function ChatSessionPage() {
  const params = useParams<{ sessionId: string }>();
  const sessionId = params.sessionId;

  const { data: session, isLoading } = api.session.getById.useQuery(
    { id: sessionId },
    {
      enabled: !!sessionId,
      retry: false,
    }
  );

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4 text-center">
        <h2 className="text-xl font-semibold">Session Not Found</h2>
        <p className="mt-2 text-muted-foreground">The chat session you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <h1 className="text-xl font-semibold">{session.title}</h1>
      </div>
      <ChatContainer sessionId={sessionId} />
    </div>
  );
}