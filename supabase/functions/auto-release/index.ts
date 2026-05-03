import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

Deno.serve(async () => {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from('leads')
    .update({ status: 'completed' })
    .eq('status', 'por_confirmar')
    .lt('unlocked_at', cutoff)
    .select('id')

  if (error) {
    console.error('auto-release error:', error)
    return new Response(JSON.stringify({ error }), { status: 500 })
  }

  console.log(`auto-release: ${data?.length ?? 0} leads liberados`)
  return new Response(JSON.stringify({ released: data?.length ?? 0 }), { status: 200 })
})