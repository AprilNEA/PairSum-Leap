const hash = async (password: string) =>
  Array.from(
    new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password)),
    ),
  )
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

export const onRequest: PagesFunction<Env> = async (context) => {
  const { id, username, password } = (await context.request.json()) as {
    id: string;
    username: string;
    password: string;
  };
  const stmt = context.env.DB.prepare(
    "SELECT * FROM users WHERE username = ?1",
  ).bind(username);
  const value = (await stmt.first()) as any;
  if (!value) {
    return new Response("user not found", { status: 404 });
  }
  if (value.password !== (await hash(password))) {
    return new Response("wrong password", { status: 401 });
  }
  await context.env.KV.put(`${id}:userId`, value.id);
  return new Response("ok");
};
