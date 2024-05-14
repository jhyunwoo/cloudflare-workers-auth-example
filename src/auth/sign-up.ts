import corsHeaders from '../../lib/cors'
import { generateIdFromEntropySize } from 'lucia'
import createDb from '../../db'
import { users } from '../../db/schema'
import createLucia from '../../lib/lucia'
import setCookie from '../../lib/set-cookie'
import hash from '../../lib/hash'
import { eq } from 'drizzle-orm'

export default async function singUp(request: Request, env: Env, ctx: ExecutionContext) {
	const userData: { email: string; password: string; passwordConfirm: string } =
		await request.json()

	const db = createDb(env)

	const lucia = createLucia(db)

	const userId = generateIdFromEntropySize(10) // 16 characters long

	const existingUser = await db.query.users.findFirst({
		where: eq(users.email, userData.email),
	})
	if (existingUser) {
		return new Response(JSON.stringify({ result: 'User already exists' }), {
			headers: { ...corsHeaders },
			status: 409,
		})
	}
	await db.insert(users).values({
		email: userData.email,
		password_hash: await hash(userData.password),
		id: userId,
	})

	const session = await lucia.createSession(userId, {})
	const sessionCookie = lucia.createSessionCookie(session.id)

	let response = new Response(JSON.stringify({ result: 'Sign Un function' }), {
		headers: { ...corsHeaders },
		status: 200,
	})
	response = setCookie(response, sessionCookie)
	return response
}
