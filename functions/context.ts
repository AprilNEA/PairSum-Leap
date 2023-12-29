import { CookieSerializeOptions, parse, serialize } from 'cookie'
import { drizzle } from 'drizzle-orm/d1'
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'

import { EventContext } from '@cloudflare/workers-types'

import * as schema from './schema'

export const createContext = async (
  { req, resHeaders }: FetchCreateContextFnOptions,
  context: EventContext<Env, any, any>,
) => {
  function getId() {
    const cookieHeader = req.headers.get('Cookie')
    if (!cookieHeader) return null
    const cookies = parse(cookieHeader)
    return cookies?.ID ?? null
  }

  function setId(id: string | null) {
    if (!id) {
    } else {
      resHeaders.append(
        'Set-Cookie',
        serialize('ID', id, {
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        }),
      )
    }
  }

  return {
    id: getId(),
    setId,
    db: drizzle(context.env.DB, { schema }),
    kv: context.env.KV,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
