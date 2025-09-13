import { z } from 'zod';
import { publicProcedure, router } from '../trpc/trpc';
import { prisma } from '../../../lib/db';

export const sessionRouter = router({
  create: publicProcedure
    .input(
      z.object({
        title: z.string().default('New Chat'),
        userId: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return prisma.chatSession.create({
        data: {
          title: input.title,
          userId: input.userId,
        },
      });
    }),

  getAll: publicProcedure
    .input(
      z.object({
        userId: z.string().optional(),
      }).optional(),
    )
    .query(async ({ input }) => {
      return prisma.chatSession.findMany({
        where: input?.userId ? { userId: input.userId } : {},
        orderBy: {
          updatedAt: 'desc',
        },
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return prisma.chatSession.findUnique({
        where: {
          id: input.id,
        },
        include: {
          messages: {
            orderBy: {
              timestamp: 'asc',
            },
            take: 1,
          },
        },
      });
    }),

  rename: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return prisma.chatSession.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return prisma.chatSession.delete({
        where: {
          id: input.id,
        },
      });
    }),
});