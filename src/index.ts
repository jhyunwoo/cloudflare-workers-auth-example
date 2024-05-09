import signIn from './auth/sign-in';
import signUp from './auth/sign-up';
import corsHeaders from '../lib/cors';

function handleHome() {
	return new Response('Yonorder Server is Running...', { status: 200, headers: { ...corsHeaders } });
}

function handleNotFound() {
	return new Response('404 Not Fount', { status: 404, headers: { ...corsHeaders } });
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const { pathname, searchParams } = new URL(request.url);
		switch (pathname) {
			case '/':
				return handleHome();
			case '/auth/sing-in':
				return signIn();
			case '/auth/sing-up':
				return signUp();
			default:
				return handleNotFound();
		}
	},
};
