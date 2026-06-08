import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../_services/auth/auth';
import { ToastrService } from 'ngx-toastr';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  if (!authService.isUserAuthenticated()) {
    return true;
  } else {
    toastr.info("You are already logged in", "Already logged in");
    return router.parseUrl("/home"); //return a UrlTree
  }
};
