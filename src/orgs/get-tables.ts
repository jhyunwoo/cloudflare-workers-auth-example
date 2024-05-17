import createDb from '../../db'
import validate from '../auth/validate'
import handleError from '../../lib/handle-error'
import getSession from '../../lib/get-session'
import { eq } from 'drizzle-orm'
import { tables } from '../../db/schema'
import corsHeaders from '../../lib/cors'

export default async function getTables(request: Request, env: Env, ctx: ExecutionContext) {
	const { searchParams } = new URL(request.url)
	const orgId = searchParams.get('orgId')
	if (orgId === null) {
		return handleError('Bad Request', 400)
	}
	const db = createDb(env)
	const session = await getSession(request, env, ctx)
	if (session.user === null) {
		return handleError('Unauthorized', 401)
	}
	const orgTables = await db.query.tables.findMany({
		where: eq(tables.orgId, orgId),
	})
	if (orgTables.length > 0) {
		return new Response(JSON.stringify(orgTables), {
			headers: { ...corsHeaders },
			status: 200,
		})
	} else {
		return handleError('Not Found', 404)
	}
}
