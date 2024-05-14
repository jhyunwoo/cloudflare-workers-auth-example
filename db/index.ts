import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

export default function createDb(env: Env) {
	const sql = postgres(env.DATABASE_URL)

	return drizzle(sql, { schema })
}
