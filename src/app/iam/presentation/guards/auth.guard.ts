import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { IamStore } from '../../application/iam.store';

export const authGuard: CanActivateFn = (_route, state) => {
  const iamStore = inject(IamStore);
  const router = inject(Router);

  if (iamStore.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { redirectTo: state.url }
  });
};
