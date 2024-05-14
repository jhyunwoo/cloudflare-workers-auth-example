export default async function hash(password: string) {
	const passwordHash = await crypto.subtle.digest(
		{
			name: 'SHA-256',
		},
		new TextEncoder().encode(password),
	)
	return btoa(String.fromCharCode(...new Uint8Array(passwordHash)))
}
