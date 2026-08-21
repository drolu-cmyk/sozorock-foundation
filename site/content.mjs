export const routes = [
  '/', '/work', '/work/global-institute', '/work/health', '/work/ai-lab',
  '/publications', '/insights', '/events', '/about', '/leadership', '/partner',
  '/support', '/standards', '/publication/hsa-v1-2026',
  '/publication/rrg-v1-2025', '/publication/rebs-v1-2025'
];

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
    cover: '/assets/hsa-cover.webp',
    coverClass: 'hsa'
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
    coverClass: 'rrg'
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
    coverClass: 'rebs'
  }
];

export const leadership = [
  { name: 'Dr. Oluwabiyi Adeyemo', credentials: 'MBA', initials: 'OA', title: 'Director of Strategic Initiatives', bio: 'Leads strategic initiatives, research architecture, program design, and applied implementation across the Foundation.' },
  { name: 'Nike Oye', credentials: 'MBA', initials: 'NO', title: 'Director of Global Health Partnerships', bio: 'Supports health partnerships and cross-sector relationships that connect community needs with institutional capacity.' },
  { name: 'Anthony Abraham', credentials: 'MSC', initials: 'AA', title: 'Director of Global Affairs', bio: 'Supports global affairs, public-system relationships, and the Foundation’s international engagement.' },
  { name: 'Jordan Hare', credentials: 'BSN, RN', initials: 'JH', title: 'Director of Health Education', bio: 'Supports health education, community learning, and practical pathways to trusted information and care.' }
];
