import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from '@/components/common/Dialog';
import { useUIStore } from '@/stores/uiStore';
import {
  Feather,
  Sparkles,
  Keyboard,
  Download,
  WifiOff,
  Code2,
  Heart,
  ExternalLink,
  RefreshCw,
  CheckCircle,
} from 'lucide-react';

interface AboutDialogProps {
  open?: boolean;
  onClose?: () => void;
}

export function AboutDialog({ open, onClose }: AboutDialogProps) {
  const { t } = useTranslation();
  const activeDialog = useUIStore((s) => s.activeDialog);
  const closeDialog = useUIStore((s) => s.closeDialog);

  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);

  const isOpen = open !== undefined ? open : activeDialog === 'about';
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      closeDialog();
    }
  };

  const handleCheckUpdate = async () => {
    if (!('serviceWorker' in navigator)) {
      setUpdateStatus('Browser tidak mendukung Service Worker / PWA.');
      return;
    }

    setCheckingUpdate(true);
    setUpdateStatus(null);

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        setTimeout(() => {
          setCheckingUpdate(false);
          setUpdateStatus('Versi Kitaba Anda saat ini sudah yang paling mutakhir!');
        }, 1000);
      } else {
        setTimeout(() => {
          setCheckingUpdate(false);
          setUpdateStatus('Aplikasi siap untuk pembaruan online.');
        }, 800);
      }
    } catch {
      setCheckingUpdate(false);
      setUpdateStatus('Gagal memeriksa pembaruan. Periksa koneksi internet Anda.');
    }
  };

  const featureItems = [
    {
      icon: Keyboard,
      title: '3-Mode Arabic Typing',
      desc: t(
        'about.features.typing',
        'Smart phonetic combos (sh -> ص), Windows Standard 101, and Arabic ISO.'
      ),
    },
    {
      icon: Sparkles,
      title: 'Rapid Harakat & Diacritics',
      desc: t(
        'about.features.harakat',
        'Insert tashkeel effortlessly using F1-F12 keys or interactive visual palette.'
      ),
    },
    {
      icon: Feather,
      title: 'Quranic Typesetting',
      desc: t(
        'about.features.quran',
        'Waqaf marks, special calligraphy ligatures (ﷺ, ﷻ), and ornamental ayah numbers.'
      ),
    },
    {
      icon: Download,
      title: 'Multi-Format Export & Import',
      desc: t(
        'about.features.export',
        'Export to PDF, HTML, PNG/JPG, RTF, Plain Text & Import legacy .kht documents.'
      ),
    },
    {
      icon: WifiOff,
      title: 'Offline-First & Private',
      desc: t(
        'about.features.pwa',
        'IndexedDB local storage. Your documents remain private on your device.'
      ),
    },
  ];

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      title={t('about.title', 'Tentang Kitaba')}
      size="lg"
    >
      <div className="space-y-6 p-1">
        {/* App Hero / Branding banner */}
        <div className="flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-950 text-white shadow-md relative overflow-hidden">
          <div className="absolute -right-6 -top-6 text-9xl font-arabic text-white/5 select-none pointer-events-none">
            كتابة
          </div>
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-3.5 shadow-inner border border-white/20">
            <span className="text-3xl font-arabic font-bold text-amber-300">
              ك
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Kitaba <span className="font-arabic font-normal text-amber-200">(كتابة)</span>
          </h1>
          <p className="text-xs text-emerald-100/90 mt-1.5 max-w-sm leading-relaxed">
            {t('about.subtitle', 'Editor Teks Arab & Latin Modern')}
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 mt-4 rounded-full bg-black/25 backdrop-blur-xs text-xs font-mono font-medium text-amber-200 border border-white/10">
            <span>v0.1.0-beta</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300 text-center px-4">
          {t(
            'about.description',
            'Kitaba adalah aplikasi web modern offline-first yang dirancang khusus untuk menulis, menata gaya, dan memformat teks Arab serta teks Latin dengan teknologi web masa kini.'
          )}
        </p>

        {/* Feature Highlights */}
        <div className="space-y-3">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-1">
            {t('about.featuresTitle', 'Fitur Utama')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {featureItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-xl border border-gray-200/80 dark:border-gray-700/60 bg-gray-50/70 dark:bg-gray-800/40 hover:border-amber-400/50 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-emerald-100/80 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 mt-0.5 shrink-0 shadow-2xs">
                    <Icon size={16} />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                      {item.title}
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technical stack & License */}
        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{t('about.license', 'Lisensi: Sumber Terbuka (MIT)')}</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/rizalibnu/kitaba"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors shadow-2xs"
            >
              <Code2 size={14} />
              <span>Source Code GitHub</span>
              <ExternalLink size={11} className="opacity-60" />
            </a>
          </div>
        </div>

        {/* Update Checker */}
        <div className="flex flex-col items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700/60">
          <button
            onClick={handleCheckUpdate}
            disabled={checkingUpdate}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-amber-900 dark:text-amber-200 bg-amber-100/80 dark:bg-amber-950/60 hover:bg-amber-200/90 dark:hover:bg-amber-900/80 border border-amber-300 dark:border-amber-700/70 rounded-xl transition-all cursor-pointer shadow-2xs disabled:opacity-50"
          >
            <RefreshCw size={13} className={checkingUpdate ? 'animate-spin' : ''} />
            <span>{checkingUpdate ? 'Memeriksa Pembaruan...' : 'Periksa Pembaruan Kitaba'}</span>
          </button>
          {updateStatus && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 text-center animate-in fade-in py-1">
              <CheckCircle size={14} />
              <span>{updateStatus}</span>
            </div>
          )}
        </div>

        {/* Footer credits */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 pt-1">
          <span>Dibuat dengan</span>
          <Heart size={13} className="text-rose-500 fill-rose-500 inline" />
          <span>untuk Tipografi Arab & Latin</span>
        </div>
      </div>
    </Dialog>
  );
}

export default AboutDialog;
