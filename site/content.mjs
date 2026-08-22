export const routes = [
  '/', '/work', '/work/global-institute', '/work/health', '/work/ai-lab',
  '/publications', '/insights', '/events', '/about', '/leadership', '/partner',
  '/support', '/standards', '/publication/hsa-v1-2026',
  '/publication/rrg-v1-2025', '/publication/rebs-v1-2025'
];

export const externalDestinations = {
  health: 'https://health.sozorockfoundation.org/',
  aiLab: 'https://ai-lab.sozorockfoundation.org/',
  cbcap: 'https://cbcap.sozorockfoundation.org/'
};

// Keep the approved parent paths for backwards compatibility, but production
// serves these two legacy parent routes as permanent redirects to the dedicated
// product sites. They are intentionally omitted from the parent sitemap.
export const redirectRoutes = new Map([
  ['/work/health', externalDestinations.health],
  ['/work/ai-lab', externalDestinations.aiLab]
]);

export const indexableRoutes = routes.filter(route => !redirectRoutes.has(route));

export const publications = [
  {
    slug: 'hsa-v1-2026',
    label: 'Assurance',
    title: 'Health Systems Assurance',
    subtitle: 'Evidence for trustworthy health systems.',
    meta: 'Volume 1 · Dr. Oluwabiyi Adeyemo · August 2026',
    href: '/publication/hsa-v1-2026',
    isbn: '979-8-9936477-3-9',
    authors: ['Dr. Oluwabiyi Adeyemo'],
    datePublished: '2026-08',
    cover: '/assets/hsa-cover.webp'
  },
  {
    slug: 'rrg-v1-2025',
    label: 'Governance and systems',
    title: 'Rethinking Rural Governance',
    subtitle: 'From Compliance to Systems Intelligence.',
    meta: 'Volume 1 · Oluwabiyi Adeyemo · November 2025',
    href: '/publication/rrg-v1-2025',
    isbn: '9798993647715',
    doi: '10.65473/rrg-v1-2025',
    authors: ['Oluwabiyi Adeyemo'],
    datePublished: '2025-11-20',
    cover: '/assets/rrg-cover.jpg'
  },
  {
    slug: 'rebs-v1-2025',
    label: 'Access and equity',
    title: 'Rural Equity Blueprint Series',
    subtitle: 'Access Day — Building a Framework for Rural Health Equity in New York State.',
    meta: 'Volume 1 · Oluwabiyi Adeyemo & Jordan Hare · October 2025',
    href: '/publication/rebs-v1-2025',
    isbn: '9798993647708',
    doi: '10.65473/rebs-v1-2025',
    authors: ['Oluwabiyi Adeyemo', 'Jordan Hare'],
    datePublished: '2025-10',
    cover: '/assets/rebs-cover.jpg'
  }
];

export const leadership = [
  {
    name: 'Dr. Oluwabiyi Adeyemo',
    credentials: 'MBA',
    title: 'Director of Strategic Initiatives',
    image: '/assets/leadership/oluwabiyi-adeyemo.png',
    bio: 'Leads strategy, research, program design, and applied implementation across the Foundation.'
  },
  {
    name: 'Nike Oye',
    credentials: 'MBA',
    title: 'Director of Global Health Partnerships',
    image: '/assets/leadership/nike-oye.png',
    bio: 'Leads health partnerships and cross-sector relationships that connect community needs with institutional capacity.'
  },
  {
    name: 'Anthony Abraham',
    credentials: 'MSC',
    title: 'Director of Global Affairs',
    image: '/assets/leadership/anthony-abraham.png',
    bio: 'Leads global affairs and international relationships across the Foundation’s work.'
  },
  {
    name: 'Jordan Hare',
    credentials: 'BSN, RN',
    title: 'Director of Health Education',
    image: '/assets/leadership/jordan-hare.png',
    bio: 'Leads health education and community learning that connect people with trusted information and care.'
  }
];
