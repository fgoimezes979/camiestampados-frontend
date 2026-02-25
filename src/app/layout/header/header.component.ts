import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  template: `
    <header class="header">
      <!-- Logo + Nombre -->
      <div class="logo-container">
        <img src="assets/logo.png" alt="Mi Logo" class="logo-img">
        <span class="app-name">📝 Mi Dashboard</span>
        <button class="hamburger" (click)="toggleSidebar()">☰</button>
      </div>

      <!-- Navegación de escritorio -->
      <nav class="nav-desktop">
        <a routerLink="/dashboard">🏠 Dashboard</a>
        <a routerLink="/orders">📦 Órdenes</a>
        <a routerLink="/products">🛍️ Productos</a>
        <a routerLink="/clients">👤 Clientes</a>
        <a routerLink="/locations">🏢 Ubicaciones</a>
        <a routerLink="/suppliers">🚚 Proveedores</a>
      </nav>

      <!-- Avatar usuario -->
      <div class="user-profile">
        <img src="assets/photo4.jpg" alt="Usuario" class="avatar">
      </div>
    </header>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 1rem;
      background-color: #1a202c;
      color: #fff;
    }
    .logo-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .logo-img {
      width: 40px;
      height: 40px;
    }
    .app-name {
      font-weight: bold;
      font-size: 1.2rem;
    }
    .nav-desktop a {
      margin-left: 1rem;
      color: #fff;
      text-decoration: none;
    }
    .nav-desktop a:hover {
      text-decoration: underline;
    }
    .user-profile .avatar {
      width: 35px;
      height: 35px;
      border-radius: 50%;
    }
    .hamburger {
      display: none; /* Para escritorio, se puede mostrar en mobile */
      background: none;
      border: none;
      color: #fff;
      font-size: 1.5rem;
      cursor: pointer;
    }
    @media (max-width: 768px) {
      .nav-desktop {
        display: none;
      }
      .hamburger {
        display: block;
      }
    }
  `]
})
export class HeaderComponent {
  toggleSidebar() {
    // Implementa la lógica para mostrar/ocultar sidebar
    console.log('Toggle sidebar');
  }
}
