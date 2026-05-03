import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useTranslation } from '../lib/i18n';

export type ConversionState = 'idle' | 'uploading' | 'processing' | 'done' | 'error';

interface ConversionProgressProps {
  state: ConversionState;
  progress?: number;
  errorMessage?: string;
  fileName?: string;
}

const stateVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.95, y: -8, transition: { duration: 0.2 } },
};

export default function ConversionProgress({
  state,
  progress,
  errorMessage,
  fileName,
}: ConversionProgressProps) {
  const { t, lang } = useTranslation();

  if (state === 'idle') return null;

  return (
    <AnimatePresence mode="wait">
      {state === 'uploading' && (
        <motion.div
          key="uploading"
          variants={stateVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex flex-col items-center gap-4 py-8"
        >
          <Loader size={40} className="text-primary-500 animate-spin" />
          <div className="text-center">
            <p className="font-semibold text-gray-800 dark:text-gray-100">
              {lang === 'en' ? 'Uploading...' : 'Subiendo...'}
            </p>
            {fileName && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate max-w-xs">{fileName}</p>
            )}
          </div>
          {typeof progress === 'number' && (
            <div className="w-full max-w-sm">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary-500 to-violet-500 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-right">{progress}%</p>
            </div>
          )}
        </motion.div>
      )}

      {state === 'processing' && (
        <motion.div
          key="processing"
          variants={stateVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex flex-col items-center gap-4 py-8"
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-primary-100 dark:border-primary-900" />
            <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-800 dark:text-gray-100">{t('common.processing')}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {lang === 'en'
                ? 'This usually takes a few seconds.'
                : 'Esto suele tardar unos segundos.'}
            </p>
          </div>
        </motion.div>
      )}

      {state === 'done' && (
        <motion.div
          key="done"
          variants={stateVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex flex-col items-center gap-3 py-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
          >
            <CheckCircle size={56} className="text-green-500" />
          </motion.div>
          <p className="font-semibold text-gray-800 dark:text-gray-100">{t('common.success')}</p>
        </motion.div>
      )}

      {state === 'error' && (
        <motion.div
          key="error"
          variants={stateVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex flex-col items-center gap-3 py-6"
        >
          <AlertCircle size={48} className="text-red-500" />
          <div className="text-center">
            <p className="font-semibold text-gray-800 dark:text-gray-100">{t('common.error')}</p>
            {errorMessage && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1 max-w-sm">{errorMessage}</p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
