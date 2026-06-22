// Application route paths

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  STARTUPS: '/startups',
  OPPORTUNITIES: '/opportunities',
  DASHBOARD: '/dashboard',

  // Founder
  FOUNDER_OVERVIEW: '/dashboard/founder/overview',
  FOUNDER_STARTUP: '/dashboard/founder/my-startup',
  FOUNDER_OPPORTUNITIES: '/dashboard/founder/opportunities',
  FOUNDER_CREATE_OPPORTUNITY: '/dashboard/founder/opportunities/create',
  FOUNDER_APPLICATIONS: '/dashboard/founder/applications',
  FOUNDER_UPGRADE: '/dashboard/founder/upgrade',

  // Collaborator
  COLLABORATOR_OVERVIEW: '/dashboard/collaborator/overview',
  COLLABORATOR_BROWSE: '/dashboard/collaborator/browse',
  COLLABORATOR_APPLICATIONS: '/dashboard/collaborator/applications',

  // Admin
  ADMIN_OVERVIEW: '/dashboard/admin/overview',
  ADMIN_USERS: '/dashboard/admin/users',
  ADMIN_STARTUPS: '/dashboard/admin/startups',
  ADMIN_TRANSACTIONS: '/dashboard/admin/transactions',

  // Profile
  PROFILE: '/dashboard/profile',
  PROFILE_EDIT: '/dashboard/profile/edit',

  // Payment
  PAYMENT_SUCCESS: '/payment/success',
  PAYMENT_CANCEL: '/payment/cancel',
};

// Helper to get dashboard home by role
export const getDashboardRoute = (role) => {
  switch (role) {
    case 'founder':
      return ROUTES.FOUNDER_OVERVIEW;
    case 'collaborator':
      return ROUTES.COLLABORATOR_OVERVIEW;
    case 'admin':
      return ROUTES.ADMIN_OVERVIEW;
    default:
      return ROUTES.HOME;
  }
};
