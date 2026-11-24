import { projects, experiences, socials, type Language, type Project, type Experience } from './site';

export const defaultCopy = {
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
} satisfies Record<Language, Record<string,string>>;

export const defaultRoles: Record<Language,string[]> = {
  en: ['Software Engineer', 'Backend Engineer', 'Full-Stack Developer', 'Builder & Thinker'],
  ar: ['مهندس برمجيات', 'مطور Backend', 'مطور Full-Stack', 'بانٍ ومفكر'],
};

export interface SiteContent {
  copy: typeof defaultCopy;
  roles: Record<Language, string[]>;
  projects: Project[];
  experiences: Experience[];
  socials: typeof socials;
  images: { hero: string; sea: string; event: string };
  sections: { work: boolean; experience: boolean; about: boolean; now: boolean; contact: boolean };
}

export const defaultSiteContent: SiteContent = {
  copy: defaultCopy,
  roles: defaultRoles,
  projects,
  experiences,
  socials,
  images: {
    hero: "/images/hero-portrait.png",
    sea: "/images/sea-photo.png",
    event: "/images/icpc-photo.jpg",
  },
  sections: {
    work: true,
    experience: true,
    about: true,
    now: true,
    contact: true,
  },
};
