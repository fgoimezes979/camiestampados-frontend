import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // ajusta la ruta

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

 canActivate(): boolean {
  const token = localStorage.getItem('token');

  if (!token) {
    this.router.navigate(['/login']);
    return false;
  }

  return true;
}

}
