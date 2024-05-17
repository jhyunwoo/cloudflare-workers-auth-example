import getSession from './get-session'
import createDb from '../db'
import { nanoid } from 'nanoid'
import { sessions } from '../db/schema'

export default async function setSession(
	request: Request,
	response: Response,
	env: Env,
	userData: { id: string; role: string; orgId: string | null; email: string },
) {
	const db = createDb(env)
	const sessionId = nanoid(32)

	const currentTime = Date.now()
	const expiresAt = currentTime + 604_800_000

	await db.insert(sessions).values({ id: sessionId, userId: userData.id, expiresAt })

	const session = await getSession(request, response, env)
	session.user = userData
	session.session = { id: sessionId, expiresAt }
	await session.save()
}
