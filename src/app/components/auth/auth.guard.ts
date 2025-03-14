import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './service/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.isAuthenticated()) //loggedIn
  {
    if(authService.hasRole('Admin')){
      return true;
    }
    else if(authService.hasRole('User')){
      return true
    }
    else{
      return router.createUrlTree(['/login'], {queryParams: {returnUrl: state.url}})
    }
  }
  else{
    authService.signOut()
    return router.createUrlTree(['/login'], {queryParams: {returnUrl: state.url}});
  }
  
};
