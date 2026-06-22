// Application constants

export const APP_NAME = 'StartupForge';
export const APP_TAGLINE = 'Build Your Dream Startup Team';
export const APP_DESCRIPTION =
  'Connect with talented collaborators and bring your ideas to life.';

export const INDUSTRIES = [
  'Technology',
  'SaaS',
  'FinTech',
  'HealthTech',
  'EdTech',
  'E-Commerce',
  'AI/ML',
  'Blockchain',
  'CleanTech',
  'Food & Beverage',
  'Real Estate',
  'Media & Entertainment',
  'Manufacturing',
  'Transportation',
  'Other',
];

export const FUNDING_STAGES = [
  'Pre-Seed',
  'Seed',
  'Series A',
  'Series B',
  'Series C',
  'Bootstrapped',
  'Grant Funded',
];

export const WORK_TYPES = ['Remote', 'On-site', 'Hybrid'];

export const COMMITMENT_LEVELS = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
];

export const APPLICATION_STATUSES = ['pending', 'accepted', 'rejected'];

export const STARTUP_STATUSES = ['pending', 'approved', 'rejected'];

// Free tier limits
export const FREE_OPPORTUNITY_LIMIT = 3;

// Premium plan
export const PREMIUM_PLAN = {
  name: 'Premium Founder',
  price: 100000001,
  interval: 'month',
  features: [
    'Unlimited opportunity posts',
    'Priority applicant listing',
    'Advanced analytics',
    '24/7 support',
    'Featured startup badge',
    'Direct messaging',
  ],
};

// Statistic counters for the home page
export const PLATFORM_STATS = [
  { label: 'Active Founders', value: 12500, suffix: '+' },
  { label: 'Startups Listed', value: 3400, suffix: '+' },
  { label: 'Open Opportunities', value: 8900, suffix: '+' },
  { label: 'Successful Hires', value: 5600, suffix: '+' },
];

// How it works steps
export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: 'Create Your Profile',
    description:
      'Sign up as a founder or collaborator and build a profile that showcases your skills and vision.',
    icon: 'UserPlus',
  },
  {
    step: 2,
    title: 'Connect & Discover',
    description:
      'Founders post opportunities, collaborators browse and find roles that match their expertise.',
    icon: 'Search',
  },
  {
    step: 3,
    title: 'Build Together',
    description:
      'Apply, collaborate, and grow your startup with the right team by your side.',
    icon: 'Rocket',
  },
];

// Platform benefits
export const PLATFORM_BENEFITS = [
  {
    title: 'For Founders',
    description:
      'Find skilled collaborators, post unlimited opportunities with premium, and grow your dream team.',
    icon: 'Briefcase',
    color: 'primary',
  },
  {
    title: 'For Collaborators',
    description:
      'Discover exciting startups, apply to roles that match your skills, and build your career.',
    icon: 'Users',
    color: 'secondary',
  },
  {
    title: 'Quality Matches',
    description:
      'Our smart filtering and skill matching help you find the perfect fit every time.',
    icon: 'Target',
    color: 'success',
  },
  {
    title: 'Secure & Trusted',
    description:
      'Verified startups, secure payments, and a trusted community of builders.',
    icon: 'ShieldCheck',
    color: 'warning',
  },
];

// Success stories / testimonials
export const SUCCESS_STORIES = [
  {
    name: 'Sarah Chen',
    role: 'Co-founder, NovaAI',
    avatar: 'https://i.ibb.co/0jqjJpV/avatar1.png',
    quote:
      'StartupForge helped us find our lead engineer in just two weeks. The quality of collaborators is unmatched.',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'CTO, FinFlow',
    avatar: 'https://i.ibb.co/SKfzMgz/avatar2.png',
    quote:
      'As a collaborator, I found three amazing projects here. The platform made it easy to connect with serious founders.',
    rating: 5,
  },
  {
    name: 'Priya Patel',
    role: 'Founder, GreenLeaf',
    avatar: 'https://i.ibb.co/kH5qY0L/avatar3.png',
    quote:
      'The premium plan paid for itself ten times over. We built our entire founding team through StartupForge.',
    rating: 5,
  },
];
