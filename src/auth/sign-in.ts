import corsHeaders from '../../lib/cors'
import createDb from '../../db'
import { eq } from 'drizzle-orm'
import { users } from '../../db/schema'
import hash from '../../lib/hash'
import setSession from '../../lib/set-session'

export default async function signIn(request: Request, env: Env, ctx: ExecutionContext) {
	const userData: { email: string; password: string } = await request.json()
	const db = createDb(env)

	const existingUser = await db.query.users.findFirst({ where: eq(users.email, userData.email) })
	if (!existingUser) {
		return new Response(JSON.stringify({ error: '이메일 또는 비밀번호가 옳지 않습니다.' }), {
			headers: { ...corsHeaders },
			status: 401,
		})
	}

	const validPassword = (await hash(userData.password)) === existingUser.password

	if (!validPassword) {
		return new Response(JSON.stringify({ error: '이메일 또는 비밀번호가 옳지 않습니다.' }), {
			headers: { ...corsHeaders },
			status: 401,
		})
	}

	let response = new Response(JSON.stringify({ result: 'Success' }), {
		headers: { ...corsHeaders },
		status: 200,
	})
	await setSession(request, response, env, {
		id: existingUser.id,
		role: existingUser.role,
		email: existingUser.email,
		orgId: existingUser.orgId,
	})

	return response
}
