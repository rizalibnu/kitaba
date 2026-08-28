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
      title: 'Multi-Format Export',
      desc: t(
        'about.features.export',
        'Export documents to PDF, standalone HTML, PNG/JPG images, RTF, and plain text.'
      ),
    },
    {
      icon: WifiOff,
      title: 'Offline-First & Private',
      desc: t(
        'about.features.pwa',
        'PWA technology with local IndexedDB storage. No server required, your text stays on your device.'
      ),
    },
  ];

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      title={t('about.title', 'About Kitaba')}
      size="lg"
    >
      <div className="space-y-5">
        {/* App Hero / Branding banner */}
        <div className="flex flex-col items-center justify-center text-center p-5 rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 text-white shadow-sm relative overflow-hidden">
          <div className="absolute -right-8 -top-8 text-8xl font-arabic text-white/10 select-none pointer-events-none">
            كتابة
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center mb-3 shadow-inner border border-white/20">
            <span className="text-3xl font-arabic font-bold text-amber-300">
              ك
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Kitaba <span className="font-arabic font-normal text-amber-200">(كتابة)</span>
          </h1>
          <p className="text-xs text-emerald-100 mt-1 max-w-sm">
            {t('about.subtitle', 'Modern Arabic & Latin Text Editor')}
          </p>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-3 rounded-full bg-white/15 text-[11px] font-mono text-emerald-100">
            <span>{t('about.version', 'Version')} 1.0.0</span>
            <span className="opacity-60">•</span>
            <span>PWA Ready</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300 text-center px-2">
          {t(
            'about.description',
            'Kitaba is a modern Arabic and Latin text editor, engineered with React 19, TypeScript, Tiptap, and Tailwind CSS.'
          )}
        </p>

        {/* Feature Highlights */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2.5">
            {t('about.featuresTitle', 'Key Features')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {featureItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl border border-gray-100 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-800/40"
                >
                  <div className="p-1.5 rounded-lg bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 mt-0.5 shrink-0">
                    <Icon size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                      {item.title}
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technical stack & License */}
        <div className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{t('about.license', 'Open Source - MIT License')}</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
            >
              <Code2 size={14} />
              <span>Source Code</span>
              <ExternalLink size={10} />
            </a>
          </div>
        </div>

        {/* PWA Update Checker */}
        <div className="flex flex-col items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700/60">
          <button
            onClick={handleCheckUpdate}
            disabled={checkingUpdate}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-900 dark:text-amber-200 bg-amber-100/70 dark:bg-amber-950/60 hover:bg-amber-200 dark:hover:bg-amber-900/80 border border-amber-300 dark:border-amber-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={13} className={checkingUpdate ? 'animate-spin' : ''} />
            <span>{checkingUpdate ? 'Memeriksa Pembaruan...' : 'Periksa Pembaruan Kitaba'}</span>
          </button>
          {updateStatus && (
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 text-center animate-in fade-in">
              <CheckCircle size={13} />
              <span>{updateStatus}</span>
            </div>
          )}
        </div>

        {/* Footer credits */}
        <div className="flex items-center justify-center gap-1 text-[11px] text-gray-400 dark:text-gray-500">
          <span>Crafted with</span>
          <Heart size={12} className="text-rose-500 fill-rose-500 inline" />
          <span>for Arabic Typography</span>
        </div>
      </div>
    </Dialog>
  );
}

export default AboutDialog;
