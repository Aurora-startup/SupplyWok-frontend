import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IamStore } from '../application/iam.store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const iamStore = inject(IamStore);
  const router = inject(Router);
  const currentUser = iamStore.currentUser();
  const isBackendRequest = req.url.startsWith(environment.supplyWokPlatformBaseUrl);
  const isAuthenticationRequest = req.url.startsWith(
    `${environment.supplyWokPlatformBaseUrl}${environment.authenticationEndpointPath}`,
  );

  const authenticatedRequest =
    isBackendRequest && !isAuthenticationRequest && currentUser?.token
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        })
      : req;

  return next(authenticatedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (isBackendRequest && !isAuthenticationRequest && error.status === 401) {
        iamStore.logout();
        void router.navigateByUrl('/login');
      }

      return throwError(() => error);
    }),
  );
};
