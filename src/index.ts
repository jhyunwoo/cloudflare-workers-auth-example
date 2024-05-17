import signIn from './auth/sign-in'
import signUp from './auth/sign-up'
import corsHeaders from '../lib/cors'
import validate from './auth/validate'
import signOut from './auth/sign-out'
import getTables from './orgs/get-tables'

function handleHome() {
	return new Response(JSON.stringify({ result: 'Yonorder Server is Running' }), {
		status: 200,
		headers: { ...corsHeaders },
	})
}

function handleNotFound() {
	return new Response(JSON.stringify({ result: '404 Not Fount' }), {
		status: 404,
		headers: { ...corsHeaders },
	})
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const { pathname } = new URL(request.url)

		switch (pathname) {
			case '/':
				return handleHome()
			case '/auth/sing-in':
				return signIn(request, env, ctx)
			case '/auth/sing-up':
				return signUp(request, env, ctx)
			case '/auth/validate':
				return validate(request, env, ctx)
			case '/auth/sign-out':
				return signOut(request, env, ctx)
			case '/orgs/tables':
				if (request.method === 'GET') {
					return getTables(request, env, ctx)
				} else {
					return handleNotFound()
				}
			default:
				return handleNotFound()
		}
	},
}
