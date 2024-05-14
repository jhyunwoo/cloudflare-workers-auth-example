import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('user', {
	id: text('id').primaryKey(),
	email: text('username').notNull().unique(),
	password_hash: text('password_hash').notNull(),
})

export const sessions = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date',
	}).notNull(),
})
