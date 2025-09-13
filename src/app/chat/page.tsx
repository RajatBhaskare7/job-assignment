'use client';

import { api } from '@/lib/api/trpc';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

export default function ChatPage() {
  const router = useRouter();
  const { data: sessions, isLoading } = api.session.getAll.useQuery();
  const createSessionMutation = api.session.create.useMutation({
    onSuccess: (data) => {
      router.push(`/chat/${data.id}`);
    },
  });

  // Redirect to the first session if it exists
  useEffect(() => {
    if (sessions && sessions.length > 0) {
      router.push(`/chat/${sessions[0].id}`);
    }
  }, [sessions, router]);

  const handleNewChat = () => {
    createSessionMutation.mutate({
      title: 'New Chat',
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
        <p className="mt-4 text-sm text-muted-foreground">Loading sessions...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center p-4 text-center">
      <MessageSquare className="h-16 w-16 text-muted-foreground" />
      <h2 className="mt-4 text-xl font-semibold">No Active Chat Session</h2>
      <p className="mt-2 max-w-md text-muted-foreground">
        Start a new chat to begin your career counseling session.
      </p>
      <Button onClick={handleNewChat} className="mt-6">
        Start a New Chat
      </Button>
    </div>
  );
}