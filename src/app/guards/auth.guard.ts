import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Obtén el servicio de autenticación
  const router = inject(Router); // Obtén el Router

  if (authService.isAuthenticated()) {
    return true; // Permite el acceso si el usuario está autenticado
  } else {
    /* router.navigate(['/login']); */ // Redirige al login si no está autenticado
    return false; // Bloquea el acceso
  }
  
};
