import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // ruta según tu proyecto


@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAdmin()) return true;       // permite acceso si es ADMIN
    this.router.navigate(['/dashboard']);              // redirige si no es ADMIN
    return false;
  }
}
