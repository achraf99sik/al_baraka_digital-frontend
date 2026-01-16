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
  
  // If authenticated but wrong role, maybe redirect to home or login
  // For now, redirect to login
  router.navigate(['/login']);
  return false;
};
