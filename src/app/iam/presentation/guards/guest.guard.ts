import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { IamStore } from '../../application/iam.store';
import { resolveHomeRoute } from '../routing/home-route';

export const guestGuard: CanActivateFn = () => {
  const iamStore = inject(IamStore);
  const router = inject(Router);

  if (!iamStore.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree([resolveHomeRoute(iamStore.currentUserRole())]);
};
