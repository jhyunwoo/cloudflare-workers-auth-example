import { defineConfig } from 'drizzle-kit'
export default defineConfig({
	dialect: 'postgresql',
	schema: './db/schema.ts',
	out: './drizzle',
	dbCredentials: {
		url: 'postgres://default:FuBsn9IEaxg7@ep-late-silence-a1q2ajic-pooler.ap-southeast-1.aws.neon.tech:5432/verceldb?sslmode=require',
	},
})
