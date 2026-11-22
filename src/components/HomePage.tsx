'use client';

import Image from 'next/image';
import HeroPortrait from './HeroPortrait';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { experiences, projects, socials, type Language, type Project } from '@/data/site';

type TranslationKey = keyof typeof copy.en;

const copy = {
  en: {
    navWork: 'Work', navExperience: 'Experience', navAbout: 'About', navConnect: 'Connect',
    heroEyebrow: 'A personal space for work, ideas, and exploration.',
    heroGreeting: "Hey, I'm", heroName: 'Baraa.', heroSubtitle: 'I build software and explore ideas.',
    typingPrefix: "Some days, I'm a",
    heroDescription: 'I enjoy building software products, understanding how things work beneath the surface, and turning ideas into systems people can actually use.',
    ctaWork: 'Explore my work', ctaAbout: 'Know me better', heroMeta: 'Based in Alexandria, Egypt — building on the internet.', heroScroll: 'Scroll to explore',
    workKicker: 'Selected work', workTitle: "Things I've built.", workIntro: 'A few products and experiments that reflect how I like to build and think.',
    filterStack: 'Technology', filterDomain: 'Domain', filterAll: 'All', featured: 'Featured', project: 'Project', viewProject: 'View project', inProgress: 'In progress',
    manage: 'Manage visibility', finishManaging: 'Done managing', show: 'Show', hide: 'Hide', projectNote: 'Prototype: edit published content in src/data/site.ts.', noProjects: 'No projects match these filters.',
    expKicker: 'Experience', expTitle: 'A few stops along the way.', expIntro: 'Learning, shipping, and building with other people — one step at a time.',
    aboutKicker: 'Beyond code', aboutTitle: 'A little more human.',
    aboutText1: 'I like building useful things, learning deeply, and exploring the ideas behind systems and products.',
    aboutText2: 'This site is part portfolio, part personal space — a place to share work, experiments, and the things that make me curious.',
    tag1: 'Curiosity', tag2: 'Systems', tag3: 'Communities', tag4: 'Builder mindset',
    nowKicker: 'Right now', nowTitle: 'Currently building, learning, and exploring.', nowText: "A snapshot of what I'm focused on these days.",
    now1Title: 'Building', now1Text: 'Products, prototypes, and backend systems.',
    now2Title: 'Learning', now2Text: 'Better engineering, better systems thinking.',
    now3Title: 'Exploring', now3Text: 'Ideas worth turning into real products.',
    contactKicker: "Let's connect", contactTitle1: 'Have an idea?', contactTitle2: "Let's talk.",
    contactText: "Whether it's a project, an opportunity, or a good conversation, I'd love to hear from you.",
  },
  ar: {
    navWork: 'المشاريع', navExperience: 'الخبرات', navAbout: 'عنّي', navConnect: 'تواصل',
    heroEyebrow: 'مساحة شخصية للشغل والأفكار والاستكشاف.',
    heroGreeting: 'أهلًا، أنا', heroName: 'البراء.', heroSubtitle: 'أبني البرمجيات وأستكشف الأفكار.',
    typingPrefix: 'أحيانًا أكون',
    heroDescription: 'أحب بناء المنتجات البرمجية، وفهم كيف تعمل الأشياء من الداخل، وتحويل الأفكار إلى أنظمة وحلول عملية يقدر الناس يستخدموها فعلًا.',
    ctaWork: 'استكشف مشاريعي', ctaAbout: 'تعرّف عليّ أكثر', heroMeta: 'من الإسكندرية، مصر — وببني على الإنترنت.', heroScroll: 'انزل واكتشف',
    workKicker: 'أعمال مختارة', workTitle: 'حاجات اشتغلت عليها.', workIntro: 'مجموعة مشاريع وتجارب بتعبر عن طريقتي في البناء والتفكير.',
    filterStack: 'التقنية', filterDomain: 'المجال', filterAll: 'الكل', featured: 'مميز', project: 'مشروع', viewProject: 'عرض المشروع', inProgress: 'قيد التطوير',
    manage: 'إدارة الظهور', finishManaging: 'إنهاء الإدارة', show: 'إظهار', hide: 'إخفاء', projectNote: 'نسخة أولية: عدّل المشاريع من src/data/site.ts.', noProjects: 'مفيش مشاريع مناسبة للفلاتر دي.',
    expKicker: 'الخبرات', expTitle: 'محطات في الرحلة.', expIntro: 'تعلم، وتنفيذ، وبناء مع ناس مختلفة — خطوة بخطوة.',
    aboutKicker: 'بعيدًا عن الكود', aboutTitle: 'شخصيتي أكبر من مجرد كود.',
    aboutText1: 'أحب أبني حاجات مفيدة، وأتعلم بعمق، وأفهم الأفكار اللي وراء الأنظمة والمنتجات.',
    aboutText2: 'الموقع ده جزء Portfolio وجزء مساحة شخصية — أشارك فيه شغلي وتجارب بسيطة والحاجات اللي بتثير فضولي.',
    tag1: 'فضول', tag2: 'أنظمة', tag3: 'مجتمعات', tag4: 'عقلية البنّاء',
    nowKicker: 'حاليًا', nowTitle: 'حاليًا ببني وأتعلم وأستكشف.', nowText: 'لقطة سريعة للحاجات اللي مركز عليها هذه الأيام.',
    now1Title: 'ببني', now1Text: 'منتجات وبروتوتايبات وأنظمة Backend.',
    now2Title: 'بتعلم', now2Text: 'هندسة أفضل وتفكير أعمق في الأنظمة.',
    now3Title: 'بستكشف', now3Text: 'أفكار تستحق تتحول لمنتجات حقيقية.',
    contactKicker: 'خلّينا نتواصل', contactTitle1: 'عندك فكرة؟', contactTitle2: 'يلا نتكلم.',
    contactText: 'سواء مشروع أو فرصة أو حتى نقاش مفيد — يسعدني نتواصل.',
  },
} satisfies Record<Language, Record<string, string>>;

const roles: Record<Language, string[]> = {
  en: ['Software Engineer', 'Backend Engineer', 'Full-Stack Developer', 'Builder & Thinker'],
  ar: ['مهندس برمجيات', 'مطور Backend', 'مطور Full-Stack', 'بانٍ ومفكر'],
};

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return reduced;
}

function AtmosphericBackground({ reducedMotion }: { reducedMotion: boolean }) {
  const layersRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reducedMotion) return;
    const layers = [...(layersRef.current?.querySelectorAll<HTMLElement>('[data-parallax]') ?? [])];
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        // Bounded movement avoids pulling the stars out of view on long pages.
        const offset = Math.min(window.scrollY, window.innerHeight * 1.7);
        for (const layer of layers) {
          const speed = Number(layer.dataset.parallax ?? 0);
          layer.style.transform = `translate3d(0, ${offset * speed}px, 0)`;
        }
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      for (const layer of layers) layer.style.transform = '';
    };
  }, [reducedMotion]);

  return (
    <div className="page-bg" aria-hidden="true" ref={layersRef}>
      <div className="bg-gradient layer" data-parallax="0.06" />
      <div className="star-layer star-layer-a layer" data-parallax="0.12" />
      <div className="star-layer star-layer-b layer" data-parallax="0.18" />
      <div className="geo-layer layer" data-parallax="0.10">
        <span className="geo geo-circle geo-1" /><span className="geo geo-circle geo-2" />
        <span className="geo geo-arc geo-3" /><span className="geo geo-grid geo-4" />
        <span className="geo geo-line geo-5" /><span className="geo geo-triangle geo-6" />
        <span className="geo geo-cross geo-7" /><span className="geo geo-dots geo-8" />
      </div>
    </div>
  );
}

function useReveal() {
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('.reveal');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      sections.forEach(section => section.classList.add('visible'));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      }
    }, { rootMargin: '0px 0px -20px 0px', threshold: .08 });
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);
}

function TypingRole({ lang, reducedMotion }: { lang: Language; reducedMotion: boolean }) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [removing, setRemoving] = useState(false);
  const currentRole = roles[lang][roleIndex % roles[lang].length];

  useEffect(() => {
    if (reducedMotion) return;
    const delay = !removing && charCount === currentRole.length ? 1300 : removing ? 45 : 72;
    const handle = window.setTimeout(() => {
      if (!removing && charCount === currentRole.length) setRemoving(true);
      else if (removing && charCount === 0) {
        setRemoving(false);
        setRoleIndex(value => value + 1);
      } else {
        setCharCount(value => value + (removing ? -1 : 1));
      }
    }, delay);
    return () => window.clearTimeout(handle);
  }, [charCount, removing, currentRole, reducedMotion]);

  return (
    <span className="typing-value" aria-label={currentRole}>
      {reducedMotion ? roles[lang][0] : currentRole.slice(0, charCount)}
    </span>
  );
}

function Header({ lang, setLang }: { lang: Language; setLang: (value: Language) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = copy[lang];
  const nav = [
    { href: '#work', label: t.navWork }, { href: '#experience', label: t.navExperience },
    { href: '#about', label: t.navAbout }, { href: '#contact', label: t.navConnect },
  ];
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="#top" aria-label="Baraa home">
          <span className="brand-mark">b<span>.</span></span><span className="brand-text">baraa mohamed</span>
        </a>
        <nav className={`main-nav ${menuOpen ? 'open' : ''}`} id="main-nav" aria-label={lang === 'ar' ? 'القائمة الرئيسية' : 'Main navigation'}>
          {nav.map(item => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>)}
        </nav>
        <div className="header-actions">
          <button className="lang-toggle" type="button" onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} aria-label={lang === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}>
            <span className="lang-primary">{lang === 'en' ? 'العربية' : 'English'}</span><span className="lang-slash">/</span>
            <span className="lang-secondary">{lang === 'en' ? 'EN' : 'AR'}</span>
          </button>
          <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="main-nav" onClick={() => setMenuOpen(!menuOpen)} aria-label={lang === 'ar' ? 'فتح القائمة' : 'Toggle navigation'}><span /><span /></button>
        </div>
      </div>
    </header>
  );
}

function SectionKicker({ number, children }: { number: string; children: ReactNode }) {
  return <div className="section-kicker"><span>{number} / 05</span><span>{children}</span></div>;
}

function Hero({ lang, reducedMotion }: { lang: Language; reducedMotion: boolean }) {
  const t = copy[lang];
  return (
    <section className="hero section" id="top" aria-labelledby="hero-title">
      <div className="container hero-grid">
        <div className="hero-copy reveal">
          <div className="eyebrow"><span className="eyebrow-dot" /><span>{t.heroEyebrow}</span></div>
          <h1 className="hero-title" id="hero-title"><span className="hero-greeting">{t.heroGreeting}</span><span className="hero-name">{t.heroName}</span></h1>
          <p className="hero-subtitle">{t.heroSubtitle}</p>
          <div className="typing-wrap"><span className="typing-prefix">{t.typingPrefix}</span><TypingRole key={lang} lang={lang} reducedMotion={reducedMotion} /><span className="typing-caret" aria-hidden="true" /></div>
          <p className="hero-description">{t.heroDescription}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#work"><span>{t.ctaWork}</span><span aria-hidden="true">↗</span></a>
            <a className="btn btn-secondary" href="#about"><span>{t.ctaAbout}</span><span aria-hidden="true">↗</span></a>
          </div>
          <div className="hero-meta"><span className="meta-label">{t.heroMeta}</span></div>
        </div>
        <div className="hero-visual reveal">
          <div className="hero-visual-frame">
            <div className="portrait-halo" aria-hidden="true" />
            <div className="portrait-rings" aria-hidden="true"><span /><span /><span /></div>
            <HeroPortrait lang={lang} />
            <div className="portrait-card note-a" aria-hidden="true">Builder</div><div className="portrait-card note-b" aria-hidden="true">Thinker</div>
          </div>
        </div>
      </div>
      <div className="container hero-footer"><div className="hero-index">01 <span /> 05</div><div className="hero-scroll">{t.heroScroll} ↓</div></div>
    </section>
  );
}

function ProjectCard({ project, lang, hidden, managing, toggleHidden }: { project: Project; lang: Language; hidden: boolean; managing: boolean; toggleHidden: (id: string) => void }) {
  const t = copy[lang];
  return (
    <article className={`project-card ${project.featured ? 'featured' : ''} ${hidden ? 'is-hidden' : ''}`}>
      <span className="project-badge">{project.featured ? t.featured : t.project}</span>
      <h3>{project.title[lang]}</h3><p>{project.description[lang]}</p>
      <div className="card-meta">{project.stack.map(stack => <span key={stack}>{stack}</span>)}</div>
      <div className="card-footer"><span>{project.domain}</span>
        {project.href ? <a className="card-link" href={project.href} target="_blank" rel="noopener noreferrer">{t.viewProject} ↗</a> : <span className="muted-link">{t.inProgress}</span>}
      </div>
      {managing && <button type="button" className="visibility-toggle" onClick={() => toggleHidden(project.id)} aria-pressed={hidden}>{hidden ? t.show : t.hide}</button>}
    </article>
  );
}

function Projects({ lang }: { lang: Language }) {
  const [stack, setStack] = useState('All');
  const [domain, setDomain] = useState('All');
  const [managing, setManaging] = useState(false);
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const t = copy[lang];

  useEffect(() => {
    // Read browser-only state after hydration, without synchronously setting React state in an effect.
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem('baraa-hidden-projects');
        if (saved) {
          const parsed: unknown = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) setHiddenIds(parsed);
        }
      } catch { /* Private browsing or invalid saved data. */ }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const stacks = useMemo(() => ['All', ...new Set(projects.flatMap(project => project.stack))], []);
  const domains = useMemo(() => ['All', ...new Set(projects.map(project => project.domain))], []);
  const visible = projects.filter(project => {
    if (!project.published) return false;
    if (!managing && hiddenIds.includes(project.id)) return false;
    return (stack === 'All' || project.stack.includes(stack)) && (domain === 'All' || project.domain === domain);
  });

  function toggleHidden(id: string) {
    const updated = hiddenIds.includes(id) ? hiddenIds.filter(item => item !== id) : [...hiddenIds, id];
    setHiddenIds(updated);
    try { window.localStorage.setItem('baraa-hidden-projects', JSON.stringify(updated)); } catch { /* Storage blocked. */ }
  }

  return (
    <section className="section work-section" id="work" aria-labelledby="work-title"><div className="container">
      <div className="section-head reveal"><div><SectionKicker number="01">{t.workKicker}</SectionKicker><h2 id="work-title">{t.workTitle}</h2></div><p>{t.workIntro}</p></div>
      <div className="filters reveal">
        <div className="filter-label">{t.filterStack}</div>
        <div className="filter-group" aria-label={t.filterStack}>{stacks.map(item => <button key={item} type="button" className={`filter-chip ${stack === item ? 'active' : ''}`} onClick={() => setStack(item)} aria-pressed={stack === item}>{item === 'All' ? t.filterAll : item}</button>)}</div>
        <div className="filter-label">{t.filterDomain}</div>
        <div className="filter-group" aria-label={t.filterDomain}>{domains.map(item => <button key={item} type="button" className={`filter-chip ${domain === item ? 'active' : ''}`} onClick={() => setDomain(item)} aria-pressed={domain === item}>{item === 'All' ? t.filterAll : item}</button>)}</div>
        <button type="button" className="manage-button" onClick={() => setManaging(!managing)} aria-pressed={managing}>{managing ? t.finishManaging : t.manage}</button>
      </div>
      <div className="project-grid" aria-live="polite">{visible.map(project => <ProjectCard key={project.id} project={project} lang={lang} hidden={ready && hiddenIds.includes(project.id)} managing={managing} toggleHidden={toggleHidden} />)}</div>
      {visible.length === 0 && <p className="empty-message">{t.noProjects}</p>}
      <p className="project-note">{t.projectNote}</p>
    </div></section>
  );
}

function ExperienceSection({ lang }: { lang: Language }) {
  const t = copy[lang];
  return <section className="section experience-section" id="experience" aria-labelledby="experience-title"><div className="container">
    <div className="section-head reveal"><div><SectionKicker number="02">{t.expKicker}</SectionKicker><h2 id="experience-title">{t.expTitle}</h2></div><p>{t.expIntro}</p></div>
    <div className="timeline">{experiences.map(item => <article className="timeline-item" key={item.id}><h3>{item.role[lang]}</h3><span className="timeline-period">{item.period}</span><p>{item.body[lang]}</p></article>)}</div>
  </div></section>;
}

function About({ lang }: { lang: Language }) {
  const t = copy[lang];
  return <section className="section about-section" id="about" aria-labelledby="about-title"><div className="container about-grid">
    <div className="about-copy reveal"><SectionKicker number="03">{t.aboutKicker}</SectionKicker><h2 id="about-title">{t.aboutTitle}</h2><p>{t.aboutText1}</p><p>{t.aboutText2}</p>
      <div className="tag-row">{(['tag1', 'tag2', 'tag3', 'tag4'] as TranslationKey[]).map(key => <span key={key}>{t[key]}</span>)}</div>
    </div>
    <div className="about-visuals reveal"><figure className="about-photo large"><Image src="/images/sea-photo.png" alt="Baraa outdoors near the sea" width={960} height={1280} sizes="(max-width: 800px) 100vw, 35vw" /></figure>
      <figure className="about-photo small"><Image src="/images/event-photo.png" alt="Baraa at a technology event" width={960} height={1280} sizes="(max-width: 800px) 100vw, 25vw" /></figure></div>
  </div></section>;
}

function Now({ lang }: { lang: Language }) {
  const t = copy[lang];
  return <section className="section now-section" id="now"><div className="container now-panel reveal">
    <SectionKicker number="04">{t.nowKicker}</SectionKicker>
    <div className="now-grid"><div><h2>{t.nowTitle}</h2><p>{t.nowText}</p></div>
      <div className="now-items">{[1, 2, 3].map(index => <div className="now-item" key={index}>
        <strong>{t[`now${index}Title` as TranslationKey]}</strong><span>{t[`now${index}Text` as TranslationKey]}</span>
      </div>)}</div>
    </div>
  </div></section>;
}

function Contact({ lang }: { lang: Language }) {
  const t = copy[lang];
  return <section className="section contact-section" id="contact"><div className="container contact-box reveal">
    <SectionKicker number="05">{t.contactKicker}</SectionKicker>
    <h2>{t.contactTitle1}<br />{t.contactTitle2}</h2><p>{t.contactText}</p>
    <div className="contact-actions"><a className="btn btn-primary" target="_blank" rel="noopener noreferrer" href={socials.linkedin}>LinkedIn ↗</a>
      <a className="btn btn-secondary" target="_blank" rel="noopener noreferrer" href={socials.github}>GitHub ↗</a></div>
  </div></section>;
}

export default function HomePage() {
  const [lang, setLang] = useState<Language>('en');
  const reducedMotion = useReducedMotion();
  useReveal();

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  return <>
    <AtmosphericBackground reducedMotion={reducedMotion} />
    <a className="skip-link" href="#main">{lang === 'ar' ? 'تخطى إلى المحتوى' : 'Skip to content'}</a>
    <Header lang={lang} setLang={setLang} />
    <main id="main"><Hero lang={lang} reducedMotion={reducedMotion} /><Projects lang={lang} /><ExperienceSection lang={lang} /><About lang={lang} /><Now lang={lang} /><Contact lang={lang} /></main>
  </>;
}
