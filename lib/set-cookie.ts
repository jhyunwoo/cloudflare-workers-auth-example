import { Cookie } from 'lucia'

export default function setCookie(response: Response, sessionCookie: Cookie | null) {
	if (sessionCookie) {
		const cookie = {
			name: sessionCookie.name,
			value: sessionCookie.value,
			attributes: {
				httpOnly: sessionCookie.attributes.httpOnly,
				secure: sessionCookie.attributes.secure,
				sameSite: sessionCookie.attributes.sameSite,
				path: sessionCookie.attributes.path,
				maxAge: sessionCookie.attributes.maxAge,
			},
		}
		const newCookie = `${cookie.name}=${cookie.value}; ${cookie.attributes.httpOnly ? 'HttpOnly; ' : ''} ${cookie.attributes.secure ? 'Secure; ' : ''} SameSite=${cookie.attributes.sameSite}; path=${cookie.attributes.path}; max-age=${cookie.attributes.maxAge}`
		response.headers.set('Set-Cookie', newCookie)
	}
	return response
}
