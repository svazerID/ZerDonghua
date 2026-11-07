import { useSyncExternalStore } from 'react';

// Chrome/Android fires `beforeinstallprompt` when the PWA is installable.
// The event is stashed so the app can offer its own "Instal Aplikasi"
// button. preventDefault() is deliberately not called, so Chrome's own
// install prompt still shows too.
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<unknown>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

// Module scope, not an effect: the event can fire right after page load,
// before React has hydrated and run effects.
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    deferredPrompt = event as BeforeInstallPromptEvent;
    notify();
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    notify();
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useCanInstall(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => deferredPrompt !== null,
    () => false,
  );
}

// Must run inside a click handler (prompt() needs a user gesture). The event
// is single-use; Chrome fires a fresh one later if the user dismisses it.
export function promptInstall(): void {
  const event = deferredPrompt;
  if (!event) return;
  deferredPrompt = null;
  notify();
  event.prompt().catch((err) => console.warn('Install prompt failed:', err));
}
