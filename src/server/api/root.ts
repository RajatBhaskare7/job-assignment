import { router } from './trpc/trpc';
import { chatRouter } from './routers/chat';
import { sessionRouter } from './routers/session';

export const appRouter = router({
  chat: chatRouter,
  session: sessionRouter,
});

export type AppRouter = typeof appRouter;