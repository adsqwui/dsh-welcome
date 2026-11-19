export const name = 'dsh-welcome';
export const inject = ['connection'];
export const MAX_NAME = 40;

export function cleanName(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\x00-\x1f\x7f]/g, '').replace(/\s+/g, ' ').trim().slice(0, MAX_NAME);
}

// A volatile Config field arrives as a ref ({ get() }) that the settings page updates in place,
// so it is read on every request rather than once at startup.
export function readName(config) {
  const value = config?.name;
  return cleanName(value && typeof value.get === 'function' ? value.get() : value);
}

// The browser half asks for the current name each time the blank chat screen mounts.
export function apply(ctx, config = {}) {
  ctx.effect(() => ctx.connection.fetch.register({
    path: '/api/dsh-welcome/config', methods: ['POST'], requestBody: 'buffered',
    async fetch(request) {
      let body;
      try { body = await request.json(); } catch { body = null; }
      return Response.json({ type: 'server-response', rpcId: body?.rpcId ?? null, result: { ok: true, value: { name: readName(config) } } });
    },
  }));
}
