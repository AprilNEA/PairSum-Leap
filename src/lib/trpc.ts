import type { AppRouter } from '../../functions'

import {
  createTRPCProxyClient,
  httpBatchLink,
  TRPCClientError,
} from '@trpc/client'

export function isTRPCClientError(
  cause: unknown,
): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError
}

export const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: '/trpc',

      // You can pass any HTTP headers you wish here
      // async headers() {
      //   return {
      //     authorization: getAuthCookie(),
      //   };
      // },
    }),
  ],
})
