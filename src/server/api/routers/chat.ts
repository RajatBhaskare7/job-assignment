import { z } from 'zod';
import { publicProcedure, router } from '../trpc/trpc';
import { prisma } from '../../../lib/db';
import { generateCareerCounselingResponse } from '../../../lib/gemini';
import { Message } from '@/types/chat';

const MessageSchema = z.object({
  id: z.string(),
  content: z.string(),
  role: z.enum(['user', 'ai', 'assistant']),
  timestamp: z.date(),
  sessionId: z.string(),
});

export const chatRouter = router({
  sendMessage: publicProcedure
    .input(
      z.object({
        content: z.string(),
        sessionId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      // Save user message
      const userMessage = await prisma.message.create({
        data: {
          role: 'user',
          content: input.content,
          sessionId: input.sessionId,
        },
      });

      // Get session messages for context
      const sessionMessages = await prisma.message.findMany({
        where: {
          sessionId: input.sessionId,
        },
        orderBy: {
          timestamp: 'asc',
        },
      });

      // Format messages for OpenAI
      const formattedMessages = sessionMessages.map((msg: Message) => ({
        role: msg.role === 'ai' ? 'assistant' : 'user',
        content: msg.content,
      }));

      // Get AI response using our career counseling integration
      const aiMessageContent = await generateCareerCounselingResponse(formattedMessages);

      // Save AI message
      const aiMessage = await prisma.message.create({
        data: {
          role: 'ai',
          content: aiMessageContent,
          sessionId: input.sessionId,
        },
      });

      return { userMessage, aiMessage };
    }),

  getMessages: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ input }) => {
      const { sessionId, limit, cursor } = input;

      const messages = await prisma.message.findMany({
        where: {
          sessionId,
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          timestamp: 'desc',
        },
      });

      let nextCursor: typeof cursor = undefined;
      if (messages.length > limit) {
        const nextItem = messages.pop();
        nextCursor = nextItem?.id;
      }

      const typedMessages = messages.map((msg: { id: string; role: string; content: string; timestamp: Date; sessionId: string }) => ({
        ...msg,
        role: msg.role === 'ai' || msg.role === 'assistant' ? 'ai' : 'user'
      }));

      return {
        messages: typedMessages.reverse(),
        nextCursor,
      };
    }),
});