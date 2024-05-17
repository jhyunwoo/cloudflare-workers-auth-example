import { getIronSession } from 'iron-session'
import { SessionType } from './types'

export default function getSession(request: Request, response: Response, env: Env) {
	return getIronSession<SessionType>(request, response, {
		cookieName: 'moveto-session',
		password: env.SESSION_PASSWORD,
		ttl: 604800,
	})
}
