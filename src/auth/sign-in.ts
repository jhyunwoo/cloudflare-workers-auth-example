import corsHeaders from '../../lib/cors';

export default function signIn() {
	return new Response(JSON.stringify({ result: 'Sign In function' }), { headers: { ...corsHeaders }, status: 200 });
}
