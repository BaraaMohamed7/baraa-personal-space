import Image from 'next/image';
import type { Language } from '@/data/site';

export default function HeroPortrait({ lang }: { lang: Language }) {
  return (
    <Image
      className="hero-portrait"
      src="/images/hero-portrait.png"
      alt={lang === 'ar' ? 'صورة شخصية للبراء' : 'Portrait of Baraa'}
      width={733}
      height={681}
      priority
      unoptimized
    />
  );
}
