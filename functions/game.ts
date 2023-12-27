import { GameValue } from "./types";

export const onRequest: PagesFunction<Env> = async (context) => {
  const { id, answer } = (await context.request.json()) as {
    id: string;
    answer: string;
  };
  const newNumber = Math.round(Math.random() * 99);
  const game = ((await context.env.KV.get(`${id}:game`, {
    type: "json",
  })) as GameValue) ?? {
    score: 0,
    sequence: [],
  };
  if (game.sequence.length === 3) {
    if (game.sequence[0] + game.sequence[2] === parseInt(answer, 10)) {
      game.score += 1;
    } else {
      const userId = await context.env.KV.get(`${id}:userId`);
      if (userId) {
        const stmt = context.env.DB.prepare(
          "INSERT INTO scores (user_id, difficulty, score) VALUES (?1, 'Medium', ?2)",
        ).bind(userId, game.score);
        await stmt.run();
      }
      game.score = 0;
    }
  }
  game.sequence.push(newNumber);
  if (game.sequence.length > 3) {
    game.sequence.shift();
  }
  await context.env.KV.put(`${id}:game`, JSON.stringify(game), {
    expirationTtl: 60,
  });
  return new Response(
    JSON.stringify({
      score: game.score,
      number: newNumber,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};
