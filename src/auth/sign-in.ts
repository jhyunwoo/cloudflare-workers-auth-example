import corsHeaders from '../../lib/cors'
import createDb from '../../db'
import createLucia from '../../lib/lucia'
import { eq } from 'drizzle-orm'
import { users } from '../../db/schema'
import setCookie from '../../lib/set-cookie'
import hash from '../../lib/hash'

export default async function signIn(request: Request, env: Env, ctx: ExecutionContext) {
	const userData: { email: string; password: string } = await request.json()
	const db = createDb(env)

	const lucia = createLucia(db)

	const existingUser = await db.query.users.findFirst({ where: eq(users.email, userData.email) })
	if (!existingUser) {
		return new Response(JSON.stringify({ result: 'User not found' }), {
			headers: { ...corsHeaders },
			status: 404,
		})
	}

	const validPassword = (await hash(userData.password)) === existingUser.password_hash

	if (!validPassword) {
		return new Response(JSON.stringify({ result: 'Invalid password' }), {
			headers: { ...corsHeaders },
			status: 401,
		})
	}
	const session = await lucia.createSession(existingUser.id, {})
	const sessionCookie = lucia.createSessionCookie(session.id)

	let response = new Response(JSON.stringify({ result: 'Success' }), {
		headers: { ...corsHeaders },
		status: 200,
	})
	response = setCookie(response, sessionCookie)

	return response
}
