import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import webpush from 'npm:web-push';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

webpush.setVapidDetails(
  Deno.env.get('VAPID_EMAIL')!,
  Deno.env.get('VAPID_PUBLIC_KEY')!,
  Deno.env.get('VAPID_PRIVATE_KEY')!
);

Deno.serve(async (req) => {
  const { user_id, title, body, url, tag } = await req.json();

  if (!user_id || !title) {
    return new Response('Faltan parámetros', { status: 400 });
  }

  const { data: subs, error } = await supabase
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth')
    .eq('user_id', user_id);

  if (error || !subs?.length) {
    return new Response('Sin suscripciones', { status: 200 });
  }

  const payload = JSON.stringify({ title, body, url: url || '/', tag });

  const results = await Promise.allSettled(
    subs.map((sub) =>
      webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload
      )
    )
  );

  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    if (r.status === 'rejected' && r.reason?.statusCode === 410) {
      await supabase
        .from('push_subscriptions')
        .delete()
        .eq('endpoint', subs[i].endpoint);
    }
  }

  return new Response('OK', { status: 200 });
});