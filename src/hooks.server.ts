import { verifyToken } from '$lib/server/auth';
import { startScheduler } from '$lib/server/scheduler';

// start scheduler once per process (globalThis guard inside)
if (process.env.NODE_ENV === 'development') {
  setTimeout(() => startScheduler(), 1000);
} else {
  // optional: start in dev but deferred to avoid HMR recursion
  startScheduler();
}

export async function handle({ event, resolve }) {
  const token = event.cookies.get('auth_token');

  // Clear user on every request to ensure no stale data
  event.locals.user = null;

  if (token) {
    const userPayload = verifyToken(token);
    if (userPayload) {
      event.locals.user = userPayload;
    } else {
      event.cookies.delete('auth_token', { path: '/' });
    }
  }

  return resolve(event);
}