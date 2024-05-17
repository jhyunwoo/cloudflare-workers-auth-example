import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('user', {
	id: text('id').notNull().primaryKey(),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
	orgId: text('org_id').references(() => orgs.id),
	role: text('role').notNull(),
})

export const sessions = sqliteTable('session', {
	id: text('id').notNull().primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: integer('expires_at').notNull(),
})

export const orgs = sqliteTable('org', {
	id: text('id').notNull().primaryKey(),
	name: text('name').notNull(),
})

export const tables = sqliteTable('tables', {
	id: text('id').notNull().primaryKey(),
	orgId: text('org_id')
		.notNull()
		.references(() => orgs.id, { onDelete: 'cascade' }),
	number: integer('number').notNull(),
	term: integer('term').notNull(),
})

export const orders = sqliteTable('order', {
	id: text('id').notNull().primaryKey(),
	tableId: text('table_id')
		.notNull()
		.references(() => tables.id, { onDelete: 'cascade' }),
	status: text('status').notNull(),
})
