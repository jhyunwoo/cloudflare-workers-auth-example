import corsHeaders from '../../lib/cors'
import createDb from '../../db'
import { users } from '../../db/schema'
import hash from '../../lib/hash'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { nanoid } from 'nanoid'
import setSession from '../../lib/set-session'

const signUpSchema = z
	.object({
		email: z
			.string({
				invalid_type_error: '이메일을 입력해주세요.',
				required_error: '이메일을 입력해주세요.',
			})
			.email({ message: '이메일 형식이 올바르지 않습니다.' }),
		password: z
			.string({ invalid_type_error: '올바른 비밀번호를 입력해주세요.' })
			.min(8, { message: '비밀번호는 8자 이상이어야 합니다.' })
			.regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@!%*#?&])[A-Za-z\d$@!%*#?&]{8,16}$/, {
				message: `영문 대소문자와 숫자, 특수문자를 포함하여야 합니다.`,
			}),
		confirmPassword: z
			.string({ invalid_type_error: '올바른 비밀번호를 입력해주세요.' })
			.min(8, { message: '비밀번호는 8자 이상이어야 합니다.' }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: '비밀번호가 일치하지 않습니다',
		path: ['confirmPassword'],
	})

export default async function singUp(request: Request, env: Env, ctx: ExecutionContext) {
	const userData: { email: string; password: string; confirmPassword: string } =
		await request.json()

	const checkSignUpData = signUpSchema.safeParse(userData)
	if (!checkSignUpData.success) {
		return new Response(JSON.stringify(checkSignUpData.error.flatten()), {
			headers: { ...corsHeaders },
			status: 400,
		})
	}

	const db = createDb(env)

	const existingUser = await db.query.users.findFirst({
		where: eq(users.email, userData.email),
	})

	if (existingUser) {
		return new Response(
			JSON.stringify({
				formErrors: [],
				fieldErrors: { confirmPassword: [], email: ['이미 사용중인 이메일입니다.'], password: [] },
			}),
			{
				headers: { ...corsHeaders },
				status: 400,
			},
		)
	}

	const userId = nanoid(16) // 16 characters long

	await db.insert(users).values({
		id: userId,
		email: userData.email,
		password: await hash(userData.password),
		role: 'user',
	})

	let response = new Response(JSON.stringify({ result: 'success' }), {
		headers: { ...corsHeaders },
		status: 200,
	})

	await setSession(request, response, env, {
		id: userId,
		role: 'user',
		email: userData.email,
		orgId: null,
	})

	return response
}
