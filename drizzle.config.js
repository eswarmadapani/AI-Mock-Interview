import { defineConfig } from "drizzle-kit";
export default defineConfig({
  out: "./drizzle",
  schema: "./utils/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DRIZZLE_DB_URL || 'postgresql://neondb_owner:npg_w02LTRgiZYCB@ep-gentle-sun-a1fqk3bh-pooler.ap-southeast-1.aws.neon.tech/Ai-mock?sslmode=require&channel_binding=require',
  },
}); 