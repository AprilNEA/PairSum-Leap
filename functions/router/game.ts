import { z } from 'zod'

import { initTRPC } from '@trpc/server'

import { scores } from '../schema'
import { trpc } from '../trpc'
import { GameValue } from '../types'

export const gameRouter = trpc.router({
  answer: trpc.procedure
    .input(
      z.object({
        answer: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { answer } = input
      const newNumber = Math.round(Math.random() * 99)
      const game = ((await ctx.kv.get(`${ctx.id}:game`, {
        type: 'json',
      })) as GameValue) ?? {
        score: 0,
        sequence: [],
      }
      if (answer && game.sequence.length === 3) {
        if (game.sequence[0] + game.sequence[2] === parseInt(answer, 10)) {
          game.score += 1
        } else if (game.score > 0) {
          const userId = await ctx.kv.get(`${ctx.id}:userId`)
          if (userId) {
            await ctx.db.insert(scores).values({
              userId: parseInt(userId),
              difficulty: 'Medium',
              score: game.score,
            })
          }
          game.score = 0
        }
      }
      game.sequence.push(newNumber)
      if (game.sequence.length > 3) {
        game.sequence.shift()
      }
      await ctx.kv.put(`${ctx.id}:game`, JSON.stringify(game), {
        expirationTtl: 60,
      })
      return {
        score: game.score,
        number: newNumber,
      }
    }),
})
