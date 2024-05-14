import getCookie from '../../lib/get-cookie'
import createDb from '../../db'
import createLucia from '../../lib/lucia'
import corsHeaders from '../../lib/cors'
import setCookie from '../../lib/set-cookie'

export default async function validate(request: Request, env: Env, ctx: ExecutionContext) {
	const db = createDb(env)
	const lucia = createLucia(db)

	const sessionId = getCookie(request, lucia.sessionCookieName)

	if (!sessionId) {
		return new Response(JSON.stringify({ user: null, session: null }), {
			headers: { ...corsHeaders },
			status: 401,
		})
	}

	const result = await lucia.validateSession(sessionId)
	let sessionCookie = null
	try {
		if (result.session && result.session.fresh) {
			sessionCookie = lucia.createSessionCookie(result.session.id)
		}
		if (!result.session) {
			sessionCookie = lucia.createBlankSessionCookie()
		}
	} catch {
		return new Response(JSON.stringify({ user: null, session: null }), {
			headers: { ...corsHeaders },
			status: 401,
		})
	}

	let response = new Response(JSON.stringify({ user: result.user, session: result.session }), {
		headers: { ...corsHeaders },
		status: 200,
	})
	response = setCookie(response, sessionCookie)
	return response
}
