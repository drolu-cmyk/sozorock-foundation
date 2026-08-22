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
    name: 'Nike Oye',
    credentials: 'MBA',
    title: 'Director of Global Health Partnerships',
    image: '/assets/leadership/nike-oye.png',
    bio: 'Coordinates strategic alliances with regional and international stakeholders to accelerate innovation in equitable health delivery. Her work focuses on sustaining multilateral partnerships, facilitating technical cooperation, and expanding the Foundation’s reach across emerging and established health ecosystems.'
  },
  {
    name: 'Anthony Abraham',
    credentials: 'MSC',
    title: 'Director of Global Affairs',
    image: '/assets/leadership/anthony-abraham.png',
    bio: 'Leads cross-border policy and institutional relations, building collaborative pathways among health entities, academic networks, and development partners. He structures global alignment so locally grounded models can inform work across different health systems.'
  },
  {
    name: 'Jordan Hare',
    credentials: 'BSN, RN',
    title: 'Director of Health Education',
    image: '/assets/leadership/jordan-hare.png',
    bio: 'Guides education and community strategies that advance literacy, prevention, and trust. Her work includes evidence-based engagement models and Health Access Day as a participatory approach to community learning and workforce mentorship.'
  },
  {
    name: 'Dr. Oluwabiyi Adeyemo',
    credentials: '',
    title: 'Director of Strategic Initiatives',
    image: '/assets/leadership/oluwabiyi-adeyemo.png',
    bio: 'Designs and leads the Foundation’s strategic architecture across research, policy, technology, and implementation. His work connects the publication portfolio with Health Equity Hubs, Health Access Day, CB-CAP, and applied learning.'
  }
];
