import corsHeaders from '../../lib/cors'
import validate from './validate'
import createDb from '../../db'
import createLucia from '../../lib/lucia'
import { Session, User } from 'lucia'
import setCookie from '../../lib/set-cookie'

export default async function signOut(request: Request, env: Env, ctx: ExecutionContext) {
	const db = createDb(env)
	const lucia = createLucia(db)

	const reqSession = await validate(request, env, ctx)
	const session: { user: User; session: Session } = await reqSession.json()
	if (!session) {
		return new Response(JSON.stringify({ result: 'Unauthorized' }), {
			status: 401,
			headers: { ...corsHeaders },
		})
	}
	await lucia.invalidateSession(session.session.id)

	const sessionCookie = lucia.createBlankSessionCookie()

	let response = new Response(JSON.stringify({ result: 'Sign Out' }), {
		status: 200,
		headers: { ...corsHeaders },
	})
	response = setCookie(response, sessionCookie)
	return response
}
