import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

import { createContext } from '../context'
import { appRouter } from '../index'

export const onRequest: PagesFunction<Env> = async (context) => {
  return fetchRequestHandler({
    endpoint: '/trpc',
    req: context.request,
    router: appRouter,
    createContext: (opts) => createContext(opts, context),
  })
}
