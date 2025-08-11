import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema'

// Prefer secure server-side env var, then public as fallback, then repo default (for local dev)
const databaseUrl = process.env.DATABASE_URL 
  || process.env.NEXT_PUBLIC_DRIZZLE_DB_URL 
  || 'postgresql://neondb_owner:npg_w02LTRgiZYCB@ep-gentle-sun-a1fqk3bh-pooler.ap-southeast-1.aws.neon.tech/Ai-mock?sslmode=require&channel_binding=require';

const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });
