import corsHeaders from '../../lib/cors'
import getSession from '../../lib/get-session'
import createDb from '../../db'
import { eq } from 'drizzle-orm'
import { sessions } from '../../db/schema'

function handleUnauthorized() {
	return new Response(JSON.stringify({ error: 'Unauthorized' }), {
		headers: { ...corsHeaders },
		status: 401,
	})
}

export default async function validate(request: Request, env: Env, ctx: ExecutionContext) {
	const response = new Response(JSON.stringify({ result: 'Validated' }))
	const session = await getSession(request, response, env)

	if (session?.user?.id) {
		const db = createDb(env)
		const findSession = await db.query.sessions.findFirst({
			where: eq(sessions.id, session.session.id),
		})
		if (findSession) {
			return response
		} else {
			return handleUnauthorized()
		}
	} else {
		return handleUnauthorized()
	}
}
