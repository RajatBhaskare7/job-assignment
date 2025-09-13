'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { api } from '@/lib/api/trpc';
import { PlusIcon, MessageSquare, Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

type SidebarProps = {
  className?: string;
};

export function Sidebar({ className }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  const { data: sessions, isLoading } = api.session.getAll.useQuery();
  const createSessionMutation = api.session.create.useMutation({
    onSuccess: (data) => {
      router.push(`/chat/${data.id}`);
    },
  });

  const handleNewChat = () => {
    createSessionMutation.mutate({
      title: 'New Chat',
    });
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] p-0">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between p-4">
              <SheetTitle className="text-lg font-semibold">Chats</SheetTitle>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <Button onClick={handleNewChat} size="sm">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  New Chat
                </Button>
              </div>
            </div>
            <Separator />
            <div className="flex-1 overflow-auto p-4">
              <SessionList sessions={sessions || []} isLoading={isLoading} currentPath={pathname} />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className={`hidden w-[300px] flex-col border-r md:flex ${className}`}>
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold">Chats</h2>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button onClick={handleNewChat} size="sm">
              <PlusIcon className="mr-2 h-4 w-4" />
              New Chat
            </Button>
          </div>
        </div>
        <Separator />
        <div className="flex-1 overflow-auto p-4">
          <SessionList sessions={sessions || []} isLoading={isLoading} currentPath={pathname} />
        </div>
      </div>
    </>
  );
}

type Session = {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
};

function SessionList({ sessions, isLoading, currentPath }: { sessions: Session[]; isLoading: boolean; currentPath: string }) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded-lg bg-muted"></div>
        ))}
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-4 text-center">
        <MessageSquare className="h-12 w-12 text-muted-foreground" />
        <div>
          <p className="text-lg font-medium">No chat sessions</p>
          <p className="text-sm text-muted-foreground">
            Start a new chat to begin your career counseling session.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {sessions.map((session) => {
        const isActive = currentPath === `/chat/${session.id}`;
        return (
          <Link key={session.id} href={`/chat/${session.id}`}>
            <Card
              className={`flex cursor-pointer flex-col p-3 transition-colors hover:bg-muted/50 ${isActive ? 'bg-muted' : ''}`}
            >
              <div className="font-medium">{session.title}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(session.updatedAt).toLocaleDateString()} at{' '}
                {new Date(session.updatedAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}