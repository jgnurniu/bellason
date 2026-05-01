// supabase/functions/mp-webhook/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const body = await req.json()

    // MP manda distintos tipos de notificación — solo nos importa payment
    if (body.type !== 'payment') {
      return new Response('ok', { status: 200 })
    }

    const paymentId = body.data?.id
    if (!paymentId) {
      return new Response('ok', { status: 200 })
    }

    const MP_ACCESS_TOKEN = Deno.env.get('MP_ACCESS_TOKEN')!

    // Consultar el pago a MP para verificarlo
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { 'Authorization': `Bearer ${MP_ACCESS_TOKEN}` },
    })

    const payment = await mpRes.json()

    // Solo procesar pagos aprobados
    if (payment.status !== 'approved') {
      return new Response('ok', { status: 200 })
    }

    const { provider_id, credits } = payment.metadata

    if (!provider_id || !credits) {
      console.error('Metadata incompleta en pago:', paymentId)
      return new Response('error: metadata incompleta', { status: 400 })
    }

    // Usar service role para escribir sin RLS
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Verificar que este pago no fue procesado ya (idempotencia)
    const { data: existing } = await supabase
      .from('credit_transactions')
      .select('id')
      .eq('mp_payment_id', String(paymentId))
      .maybeSingle()

    if (existing) {
      console.log('Pago ya procesado:', paymentId)
      return new Response('ok', { status: 200 })
    }

    // Sumar créditos
    const { error: creditError } = await supabase.rpc('add_credits', {
      p_provider_id: provider_id,
      p_credits: Number(credits),
      p_mp_payment_id: String(paymentId),
      p_amount: payment.transaction_amount,
    })

    if (creditError) {
      console.error('Error sumando créditos:', creditError)
      return new Response('error al sumar créditos', { status: 500 })
    }

    return new Response('ok', { status: 200 })

  } catch (err) {
    console.error(err)
    return new Response('error interno', { status: 500 })
  }
})