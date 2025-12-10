import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';

export const customerGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  const user = userService.getCurrentUser(); // method must exist in UserService

  // Not logged in or not customer → block
  if (!user || user.role !== 'customer') {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
