import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { tap } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  return inject(AuthService).isAuthenticated$.pipe(
    tap(isAuthenticated => {
      return isAuthenticated;
    }),
  );
};
