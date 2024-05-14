import { Lucia } from 'lucia'
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle'
import { sessions, users } from '../db/schema'
import { PgDatabase } from 'drizzle-orm/pg-core'

declare module 'lucia' {
	interface Register {
		Lucia: Lucia<Record<never, never>, Record<never, never>>
		DatabaseUserAttributes: DatabaseUserAttributes
	}
}

interface DatabaseUserAttributes {
	email: string
}

export default function createLucia(db: PgDatabase<any, any, any>) {
	const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users)

	return new Lucia(adapter, {
		sessionCookie: {
			expires: false,
			attributes: {
				secure: process.env.NODE_ENV === 'production',
			},
		},
		getUserAttributes: (attributes) => {
			return {
				// attributes has the type of DatabaseUserAttributes
				email: attributes.email,
			}
		},
	})
}
