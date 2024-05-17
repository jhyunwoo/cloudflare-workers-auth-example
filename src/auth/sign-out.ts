import corsHeaders from '../../lib/cors'
import { getIronSession } from 'iron-session'

export default async function signOut(request: Request, env: Env, ctx: ExecutionContext) {
	let response = new Response(JSON.stringify({ result: 'Sign Out' }), {
		status: 200,
		headers: { ...corsHeaders },
	})
	const session = await getIronSession(request, response, {
		password: env.SESSION_PASSWORD,
		cookieName: 'moveto-session',
	})
	session.destroy()

	return response
}
