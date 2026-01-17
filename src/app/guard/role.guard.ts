import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../service/auth-service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data['role'];

  console.log('Role Guard Check:', authService.getRole(), requiredRole);

  if (authService.isAuthenticated() && authService.getRole() === requiredRole) {
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};
