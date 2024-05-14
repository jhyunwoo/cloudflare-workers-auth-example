export default function getCookie(request: Request, key: string) {
	let cookieString = request.headers.get('Cookie')
	if (cookieString) {
		const allCookies = cookieString.split('; ')
		const targetCookie = allCookies.find((cookie) => cookie.includes(key))
		if (targetCookie) {
			const [_, value] = targetCookie.split('=')
			return value
		}
	}
	return null
}
