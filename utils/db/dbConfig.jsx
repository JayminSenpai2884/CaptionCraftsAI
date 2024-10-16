import {neon} from '@neondatabase/serverless'
import {drizzle} from 'drizzle-orm/neon-http'
import * as schema from './schema'

// const sql = neon(process.env.DATABASE_URL)

const sql = neon('postgresql://AiWrite_owner:GTIW8Vjm7Myx@ep-soft-breeze-a5bxqsbx.us-east-2.aws.neon.tech/AiWrite?sslmode=require');
console.log("DATABASE_URL:", process.env.DATABASE_URL);

export const db = drizzle(sql, {schema});