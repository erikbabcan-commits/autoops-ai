import { registerSW } from 'virtual:pwa-register';

export const updateServiceWorker = registerSW({
  immediate: true,
  onRegisteredSW(_swUrl, registration) {
    if (!registration) return;
    window.setInterval(() => {
      void registration.update();
    }, 1000 * 60 * 60);
  },
  onOfflineReady() {
    console.info('[AutoOps AI] Offline mode ready. The robot can now work in a cave. Mostly.');
  },
  onNeedRefresh() {
    console.info('[AutoOps AI] New build available.');
  }
});
