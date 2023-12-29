import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "./context";

export const trpc = initTRPC.context<Context>().create();

export const middleware = trpc.middleware;
export const router = trpc.router;

const isAuthed = middleware(({ ctx, next }) => {
  if (!ctx.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next();
});

export const procedure = trpc.procedure.use(isAuthed);
export const publicProcedure = trpc.procedure;
