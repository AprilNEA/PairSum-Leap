import { gameRouter } from './router/game'
import { userRouter } from './router/user'
import { procedure, trpc } from './trpc'

export const appRouter = trpc.router({
  user: userRouter,
  game: gameRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
