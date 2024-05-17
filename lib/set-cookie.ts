import { Cookie } from 'lucia'

export default function setCookie(response: Response, sessionCookie: Cookie | null) {
	if (sessionCookie) {
		response.headers.set('Set-Cookie', sessionCookie.serialize() + '; domain=.moveto.kr')
		// response.headers.set('Set-Cookie', sessionCookie.serialize())
	}
	return response
}
