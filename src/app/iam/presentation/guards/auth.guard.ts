import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { IamStore } from '../../application/iam.store';
import { getHomeByRole, getRoleFromPath, normalizeRole } from '../../../shared/application/role-routing';

export const authGuard: CanActivateFn = (_route, state) => {
  const iamStore = inject(IamStore);
  const router = inject(Router);

  if (!iamStore.isAuthenticated()) {
    return router.createUrlTree(['/login'], {
      queryParams: { redirectTo: state.url }
    });
  }

  const currentRole = normalizeRole(iamStore.currentUserRole());
  const requiredRole = getRoleFromPath(state.url);

  if (currentRole && requiredRole && currentRole !== requiredRole) {
    return router.createUrlTree([getHomeByRole(iamStore.currentUserRole())]);
  }

  return true;
};
