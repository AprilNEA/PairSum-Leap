import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./functions/schema.ts",
  out: "./drizzle",
  driver: "d1",
} satisfies Config;
