export type AppRoute =
  | { kind: 'auth'; step?: 'email' | 'otp' }
  | { kind: 'onboarding' }
  | { kind: 'app'; role?: string; tab?: string };

export const buildAppLocation = (route: AppRoute): string => {
  switch (route.kind) {
    case 'auth':
      return route.step === 'otp' ? '#/auth/otp' : '#/auth';
    case 'onboarding':
      return '#/onboarding';
    case 'app': {
      const role = route.role || 'student';
      const tab = route.tab || 'dashboard';
      return `#/${role}/${tab}`;
    }
    default:
      return '#/auth';
  }
};

export const parseAppLocation = (hash: string = typeof window === 'undefined' ? '' : window.location.hash): AppRoute => {
  const cleaned = hash.startsWith('#') ? hash.slice(1) : hash;
  const segments = cleaned.split('/').filter(Boolean);

  if (segments[0] === 'auth') {
    return { kind: 'auth', step: segments[1] === 'otp' ? 'otp' : 'email' };
  }

  if (segments[0] === 'onboarding') {
    return { kind: 'onboarding' };
  }

  if (segments[0]) {
    return { kind: 'app', role: segments[0], tab: segments[1] || 'dashboard' };
  }

  return { kind: 'app', role: 'student', tab: 'dashboard' };
};

export const navigateToRoute = (
  route: AppRoute,
  options?: { replace?: boolean }
): void => {
  if (typeof window === 'undefined') return;

  const nextUrl = buildAppLocation(route);
  const currentUrl = window.location.hash || '#/';

  if (currentUrl === nextUrl) {
    return;
  }

  const state = { appRoute: route };
  if (options?.replace) {
    window.history.replaceState(state, '', nextUrl);
    return;
  }

  window.history.pushState(state, '', nextUrl);
};
