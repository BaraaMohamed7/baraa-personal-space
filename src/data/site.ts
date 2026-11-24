// Edit your actual project content, experience and links here.
// Hiding a project from the production site: change published to false.

export type Language = 'en' | 'ar';
export type Translated = Record<Language, string>;

export interface Project {
  id: string;
  title: Translated;
  description: Translated;
  stack: string[];
  domain: string;
  featured: boolean;
  published: boolean;
  href?: string;
}

export interface Experience {
  id: string;
  role: Translated;
  period: string;
  body: Translated;
}

export const projects: Project[] = [
  {
    id: 'sectionly',
    title: { en: 'Sectionly', ar: 'Sectionly' },
    description: { en: 'Course section registration with academic constraints, conflict checks, and administrative workflows.', ar: 'نظام لتسجيل السيكشنات الدراسية فيه قيود وتحقق من التعارضات واحتياجات الإدارة.' },
    stack: ['Next.js', 'PostgreSQL', 'Prisma'], domain: 'Education', featured: true, published: true,
    href: 'https://github.com/BaraaMohamed7/sectionly',
  },
  {
    id: '7fza',
    title: { en: '7FZA / Hafza', ar: '7FZA / حفظتي' },
    description: { en: 'A cashback marketplace being developed with partner, merchant, and customer flows.', ar: 'منصة كاش باك قيد التطوير تشمل تدفقات الشركاء والتجار والعملاء.' },
    stack: ['NestJS', 'PostgreSQL', 'Flutter'], domain: 'Fintech', featured: true, published: true,
  },
  {
    id: 'wa-man-ahyaha',
    title: { en: 'Wa Man Ahyaha', ar: 'ومن أحياها' },
    description: { en: 'Mobile-first doctor booking with temporary booking holds and administrative workflows.', ar: 'تطبيق موبايل لحجز مواعيد طبيب مع حجز مؤقت وتدفقات إدارية.' },
    stack: ['React Native', 'NestJS', 'PostgreSQL'], domain: 'Healthcare', featured: true, published: true,
    href: 'https://github.com/BaraaMohamed7/wa-man-ahyaha-api',
  },
  {
    id: 'loglens',
    title: { en: 'LogLens', ar: 'LogLens' },
    description: { en: 'A streaming log analyzer designed for large files under limited memory.', ar: 'محلل Logs بأسلوب streaming للتعامل مع ملفات كبيرة باستخدام ذاكرة محدودة.' },
    stack: ['Algorithms', 'Systems'], domain: 'Developer Tools', featured: false, published: true,
    href: 'https://github.com/BaraaMohamed7/loglens',
  },
  {
    id: 'lifeos',
    title: { en: 'LifeOS PoC', ar: 'LifeOS PoC' },
    description: { en: 'A scheduling-engine proof of concept for tasks and changing constraints.', ar: 'نموذج أولي لمحرك جدولة للمهام والقيود المتغيرة.' },
    stack: ['TypeScript', 'Planning'], domain: 'Productivity', featured: false, published: true,
    href: 'https://github.com/BaraaMohamed7/lifeos-poc',
  },
];

export const experiences: Experience[] = [
  { id: 'etisalat', role: { en: 'Backend Engineering Intern — e& Egypt', ar: 'متدرب هندسة Backend — e& Egypt' }, period: '2026', body: { en: 'Backend development using Spring Boot, SQL Server, and API documentation tools.', ar: 'تطوير Backend باستخدام Spring Boot وSQL Server وأدوات توثيق الـAPI.' } },
  { id: 'freelance', role: { en: 'Freelance Developer — Adilbaba', ar: 'مطور مستقل — Adilbaba' }, period: '2026', body: { en: 'Refactoring and building Next.js features in an existing web product.', ar: 'إعادة هيكلة وبناء Features باستخدام Next.js في منتج ويب قائم.' } },
  { id: 'depi', role: { en: 'Full-Stack .NET Trainee — DEPI', ar: 'متدرب Full-Stack .NET — DEPI' }, period: '2026', body: { en: 'Hands-on software-development training across the stack.', ar: 'تدريب عملي على تطوير البرمجيات عبر أجزاء الـStack المختلفة.' } },
];

export const socials = {
  github: 'https://github.com/BaraaMohamed7',
  linkedin: 'https://www.linkedin.com/in/baraa-mohamed-dev',
  whatsapp: '+201024255791',
  email: 'baraa.mohamed.ahmed7@gmail.com',
};
