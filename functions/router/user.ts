import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { z } from 'zod'

import { initTRPC, TRPCError } from '@trpc/server'

import { users } from '../schema'
import { publicProcedure, trpc } from '../trpc'

const hash = async (password: string) =>
  Array.from(
    new Uint8Array(
      await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password)),
    ),
  )
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

export const userRouter = trpc.router({
  login: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
        isNew: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { username, password, isNew } = input
      let user = await ctx.db.query.users.findFirst({
        where: eq(users.username, username),
      })
      if (!user) {
        if (!isNew) {
          throw new TRPCError({ code: 'NOT_FOUND' })
        }
        const results = await ctx.db
          .insert(users)
          .values({
            username,
            password: await hash(password),
          })
          .onConflictDoNothing({ target: users.username })
          .returning()
        user = results[0]
      } else {
        if (user.password !== (await hash(password))) {
          throw new TRPCError({ code: 'FORBIDDEN' })
        }
      }

      const id = nanoid()
      await ctx.kv.put(`${id}:userId`, user.id.toString())
      ctx.setId(id)
    }),
})
