import { Shield, Trash2, UserX } from 'lucide-react';
import { useTranslation } from '../lib/i18n';

export default function TrustSection() {
  const { lang } = useTranslation();

  const items = lang === 'en'
    ? [
        {
          icon: Shield,
          title: 'Secure Processing',
          desc: 'All file transfers are encrypted with HTTPS/TLS. Your data is never shared with third parties.',
          color: 'text-blue-500',
          bg: 'bg-blue-50 dark:bg-blue-950/40',
        },
        {
          icon: Trash2,
          title: 'Auto File Deletion',
          desc: 'Uploaded files and converted results are automatically deleted from our servers within 30 minutes.',
          color: 'text-violet-500',
          bg: 'bg-violet-50 dark:bg-violet-950/40',
        },
        {
          icon: UserX,
          title: 'No Registration',
          desc: 'No account, no email, no credit card required. Just upload your file and convert.',
          color: 'text-emerald-500',
          bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        },
      ]
    : [
        {
          icon: Shield,
          title: 'Procesamiento seguro',
          desc: 'Todas las transferencias de archivos están cifradas con HTTPS/TLS. Tus datos nunca se comparten con terceros.',
          color: 'text-blue-500',
          bg: 'bg-blue-50 dark:bg-blue-950/40',
        },
        {
          icon: Trash2,
          title: 'Eliminación automática',
          desc: 'Los archivos subidos y convertidos se eliminan automáticamente de nuestros servidores en 30 minutos.',
          color: 'text-violet-500',
          bg: 'bg-violet-50 dark:bg-violet-950/40',
        },
        {
          icon: UserX,
          title: 'Sin registro',
          desc: 'Sin cuenta, sin email, sin tarjeta de crédito. Sube tu archivo y conviértelo.',
          color: 'text-emerald-500',
          bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        },
      ];

  return (
    <section className="py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="flex flex-col items-center text-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm"
            >
              <div className={`p-3 rounded-2xl ${item.bg}`}>
                <Icon size={28} className={item.color} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
