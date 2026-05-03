import { useEffect, useRef } from 'react';
import { getCookieConsent } from './CookieBanner';

interface AdSlotProps {
  slot: string;
  format?: string;
  className?: string;
}

export default function AdSlot({ slot, format = 'auto', className = '' }: AdSlotProps) {
  const ref = useRef<HTMLDivElement>(null);
  const adsenseEnabled = import.meta.env.VITE_ENABLE_ADSENSE === 'true';

  useEffect(() => {
    if (!adsenseEnabled) return;
    const consent = getCookieConsent();
    if (consent !== 'all') return;

    // Push ad
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      // ignore
    }
  }, [adsenseEnabled]);

  const consent = getCookieConsent();
  if (!adsenseEnabled || consent !== 'all') return null;

  return (
    <div ref={ref} className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={import.meta.env.VITE_ADSENSE_CLIENT ?? ''}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
