export const name = 'dsh-welcome';
export const inject = ['connection'];

export function cleanName(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\x00-\x1f\x7f]/g, '').replace(/\s+/g, ' ').trim().slice(0, 40);
}

// The browser half asks for the configured name once per page.
export function apply(ctx, config = {}) {
  const value = { name: cleanName(config?.name) };
  ctx.effect(() => ctx.connection.fetch.register({
    path: '/api/dsh-welcome/config', methods: ['POST'], requestBody: 'buffered',
    async fetch(request) {
      let body;
      try { body = await request.json(); } catch { body = null; }
      return Response.json({ type: 'server-response', rpcId: body?.rpcId ?? null, result: { ok: true, value } });
    },
  }));
}
