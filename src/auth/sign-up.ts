import corsHeaders from '../../lib/cors';

export default function singUp() {
	return new Response(JSON.stringify({ result: 'Sign Un function' }), { headers: { ...corsHeaders }, status: 200 });
}
