import { useState, useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Sparkles, RefreshCw, X, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function PwaUpdatePrompt() {
  const { t } = useTranslation();
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (r) {
        // Auto-check for updates every 30 minutes
        setInterval(() => {
          r.update().catch(() => {});
        }, 30 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.warn('PWA registration error:', error);
    },
  });

  // Prevent immediate re-showing of prompt if we just reloaded
  const isRecentlyUpdated = () => {
    try {
      const lastUpdate = sessionStorage.getItem('kitaba_sw_updated');
      if (lastUpdate && Date.now() - parseInt(lastUpdate, 10) < 15000) {
        return true;
      }
    } catch {}
    return false;
  };

  // Check for updates when the user returns to the tab or reconnects online
  useEffect(() => {
    if (isRecentlyUpdated()) {
      setNeedRefresh(false);
      return;
    }

    const handleCheckUpdate = () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then((reg) => {
          reg?.update().catch(() => {});
        });
      }
    };

    window.addEventListener('focus', handleCheckUpdate);
    window.addEventListener('online', handleCheckUpdate);
    return () => {
      window.removeEventListener('focus', handleCheckUpdate);
      window.removeEventListener('online', handleCheckUpdate);
    };
  }, []);

  const handleUpdateNow = () => {
    setIsUpdating(true);
    try {
      sessionStorage.setItem('kitaba_sw_updated', Date.now().toString());
    } catch {}

    // Tell service worker to skip waiting and reload the page
    setNeedRefresh(false);
    updateServiceWorker(true);
  };

  const handleClose = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if ((!needRefresh && !offlineReady) || isRecentlyUpdated()) {
    return null;
  }

  return (
    <div className="fixed bottom-10 right-6 z-50 max-w-sm w-full animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-amber-300 dark:border-amber-700/60 p-4 text-gray-900 dark:text-gray-100 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {needRefresh ? (
              <div className="p-2 bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 rounded-lg">
                <Sparkles size={20} className="text-amber-600 dark:text-amber-400" />
              </div>
            ) : (
              <div className="p-2 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <CheckCircle2 size={20} />
              </div>
            )}
            <div>
              <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100">
                {needRefresh
                  ? t('pwa.updateAvailable', 'Pembaruan Kitaba Tersedia!')
                  : t('pwa.offlineReadyTitle', 'Siap Digunakan Offline')}
              </h4>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">
                {needRefresh
                  ? t(
                      'pwa.updateDescription',
                      'Versi terbaru telah siap. Klik perbarui untuk memuat fitur dan perbaikan terbaru.'
                    )
                  : t(
                      'pwa.offlineReadyDescription',
                      'Seluruh aset dan font telah disimpan di perangkat Anda.'
                    )}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-md transition-colors cursor-pointer"
            title="Tutup"
          >
            <X size={16} />
          </button>
        </div>

        {needRefresh && (
          <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-100 dark:border-gray-700/60">
            <button
              onClick={handleClose}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors cursor-pointer"
            >
              {t('pwa.later', 'Nanti')}
            </button>
            <button
              onClick={handleUpdateNow}
              disabled={isUpdating}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-md shadow-xs transition-colors cursor-pointer disabled:opacity-75"
            >
              <RefreshCw size={13} className={isUpdating ? 'animate-spin' : ''} />
              <span>{isUpdating ? 'Memperbarui...' : t('pwa.updateNow', 'Perbarui Sekarang')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PwaUpdatePrompt;
