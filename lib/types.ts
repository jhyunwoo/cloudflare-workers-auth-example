export interface SessionType {
	user: { id: string; role: string; email: string; orgId: string | null }
	session: { id: string; expiresAt: number }
}
