import cron from 'node-cron';
import { syncWithJebApi } from '$lib/server/jeb-sync';

export function startScheduler() {
  if ((globalThis as any).__scheduler_started__) return;
  (globalThis as any).__scheduler_started__ = true;

  const cronExpr = process.env.SYNC_CRON ?? '0 */1 * * *'; // every 1 hour at minute 0
  let running = false;

  const runOnce = async () => {
    if (running) return;
    running = true;
    try {
      console.log('scheduler: starting syncWithJebApi');
      await syncWithJebApi();
      console.log('scheduler: syncWithJebApi completed');
    } catch (err) {
      console.error('scheduler: syncWithJebApi error', err);
    } finally {
      running = false;
    }
  };

  // run immediately once, then schedule
  void runOnce();

  cron.schedule(cronExpr, () => {
    void runOnce();
  });

  console.log(`scheduler: scheduled syncWithJebApi with cron "${cronExpr}"`);
}
