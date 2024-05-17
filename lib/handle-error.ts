import corsHeaders from './cors'

export default function handleError(error: string, status: number) {
	return new Response(JSON.stringify({ error }), { headers: { ...corsHeaders }, status: status })
}
