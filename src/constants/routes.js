

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  STARTUPS: '/startups',
  OPPORTUNITIES: '/opportunities',
  DASHBOARD: '/dashboard',

  FOUNDER_OVERVIEW: '/dashboard/founder/overview',
  FOUNDER_STARTUP: '/dashboard/founder/my-startup',
  FOUNDER_OPPORTUNITIES: '/dashboard/founder/opportunities',
  FOUNDER_CREATE_OPPORTUNITY: '/dashboard/founder/opportunities/create',
  FOUNDER_APPLICATIONS: '/dashboard/founder/applications',
  FOUNDER_UPGRADE: '/dashboard/founder/upgrade',

  COLLABORATOR_OVERVIEW: '/dashboard/collaborator/overview',
  COLLABORATOR_BROWSE: '/dashboard/collaborator/browse',
  COLLABORATOR_APPLICATIONS: '/dashboard/collaborator/applications',

  ADMIN_OVERVIEW: '/dashboard/admin/overview',
  ADMIN_USERS: '/dashboard/admin/users',
  ADMIN_STARTUPS: '/dashboard/admin/startups',
  ADMIN_TRANSACTIONS: '/dashboard/admin/transactions',

  PROFILE: '/dashboard/profile',
  PROFILE_EDIT: '/dashboard/profile/edit',

  PAYMENT_SUCCESS: '/payment/success',
  PAYMENT_CANCEL: '/payment/cancel',
};

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
