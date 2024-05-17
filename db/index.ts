import * as schema from './schema'
import { drizzle } from 'drizzle-orm/d1'

export default function createDb(env: Env) {
	return drizzle(env.DB, { schema })
}
