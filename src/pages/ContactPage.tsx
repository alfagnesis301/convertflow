import { useState } from 'react';
import { CheckCircle, AlertCircle, Mail } from 'lucide-react';
import { useTranslation } from '../lib/i18n';
import { generateMetaTags } from '../lib/seo';
import SEOHead from '../components/SEOHead';
import Breadcrumbs from '../components/Breadcrumbs';

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL ?? 'support@flowtopdf.com';

export default function ContactPage() {
  const { lang } = useTranslation();
  const meta = generateMetaTags('contact', lang);
  const isEn = lang === 'en';

  const [form, setForm] = useState<FormState>({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [serverError, setServerError] = useState('');

  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {};
    if (!form.name.trim()) newErrors.name = isEn ? 'Name is required.' : 'El nombre es obligatorio.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = isEn ? 'A valid email is required.' : 'Se requiere un email válido.';
    }
    if (!form.subject.trim()) newErrors.subject = isEn ? 'Subject is required.' : 'El asunto es obligatorio.';
    if (form.message.trim().length < 20) {
      newErrors.message = isEn
        ? 'Message must be at least 20 characters.'
        : 'El mensaje debe tener al menos 20 caracteres.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitState('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Server error');
      setSubmitState('success');
    } catch {
      setServerError(
        isEn
          ? 'Failed to send message. Please try again or email us directly.'
          : 'Error al enviar el mensaje. Inténtalo de nuevo o escríbenos directamente.'
      );
      setSubmitState('error');
    }
  };

  const field = (
    id: keyof FormState,
    label: string,
    type: 'text' | 'email' | 'textarea' = 'text'
  ) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label} <span className="text-red-500">*</span>
      </label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          rows={5}
          value={form[id]}
          onChange={(e) => setForm((f) => ({ ...f, [id]: e.target.value }))}
          className="input-base dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 resize-y"
        />
      ) : (
        <input
          id={id}
          type={type}
          value={form[id]}
          onChange={(e) => setForm((f) => ({ ...f, [id]: e.target.value }))}
          className="input-base dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        />
      )}
      {errors[id] && (
        <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors[id]}</p>
      )}
    </div>
  );

  return (
    <>
      <SEOHead meta={meta} />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />

        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {isEn ? 'Contact Us' : 'Contacto'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {isEn
            ? 'Have a question, feedback, or need help? We would love to hear from you.'
            : '¿Tienes una pregunta, comentario o necesitas ayuda? Nos encantaría saber de ti.'}
        </p>

        {/* Direct email */}
        <div className="flex items-center gap-3 p-4 bg-primary-50 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-800 rounded-xl mb-8">
          <Mail size={18} className="text-primary-500 shrink-0" />
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {isEn ? 'Or email us directly at ' : 'O envíanos un correo directamente a '}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
              {SUPPORT_EMAIL}
            </a>
          </p>
        </div>

        {submitState === 'success' ? (
          <div className="flex flex-col items-center gap-4 py-12">
            <CheckCircle size={56} className="text-green-500" />
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {isEn ? 'Message sent!' : '¡Mensaje enviado!'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {isEn
                  ? 'We have received your message and will get back to you shortly.'
                  : 'Hemos recibido tu mensaje y te responderemos en breve.'}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {field('name', isEn ? 'Name' : 'Nombre')}
            {field('email', 'Email', 'email')}
            {field('subject', isEn ? 'Subject' : 'Asunto')}
            {field('message', isEn ? 'Message' : 'Mensaje', 'textarea')}

            {submitState === 'error' && serverError && (
              <div className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitState === 'loading'}
              className="btn-primary w-full justify-center py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitState === 'loading'
                ? (isEn ? 'Sending...' : 'Enviando...')
                : (isEn ? 'Send Message' : 'Enviar mensaje')}
            </button>
          </form>
        )}
      </main>
    </>
  );
}
