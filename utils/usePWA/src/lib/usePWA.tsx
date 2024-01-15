import { useEffect } from 'react';
import { useInstallPWA } from '../installPWAContext/installPWAContextProvider';

type EventHandler = EventListenerOrEventListenerObject;

export function usePWA() {
  const { deferredPrompt, is_installing, installPWADispatch } = useInstallPWA();
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleBeforeInstallPrompt: EventHandler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      installPWADispatch({ payload: e, type: 'SET_PROMPT' });
    };

    const handleAppInstalled: EventHandler = () => {
      installPWADispatch({ payload: null, type: 'SET_PROMPT' });
    };

    const cleanup = () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
      installPWADispatch({ type: 'CLEANUP' });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return cleanup;
  }, [installPWADispatch]);

  async function installApp() {
    installPWADispatch({ payload: true, type: 'UPDATE_INSTALLATION_STATUS' });
    deferredPrompt.prompt().then(() => {
      installPWADispatch({
        payload: false,
        type: 'UPDATE_INSTALLATION_STATUS',
      });
    });
  }

  return {
    isInstalled: !deferredPrompt,
    isInstallable: !!deferredPrompt && !is_installing,
    isInstalling: is_installing && !!deferredPrompt,
    installApp,
  };
}
